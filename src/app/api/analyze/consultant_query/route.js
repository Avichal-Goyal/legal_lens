import { query_to_vector } from "@/helper/convert_to_vector";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { getDocQueryResponse, rephraseUserQuery } from "@/lib/huggingFace";

export async function POST(request) {
    try {
        const { query, history, fileName } = await request.json();

        //provide the chat history and query to AI to rephrase the query to make it include the previous chat queries in it so that AI can get the context of whole chat history with that current query

        const rephrasedQuery = await rephraseUserQuery(query, history);

        const queryVector = await query_to_vector(rephrasedQuery);
        console.log(`Rephrased Query: ${rephrasedQuery}`)
        console.log("DEBUG: Searching for file:", fileName); //
        console.log("DEBUG: Query Vector Sample:", queryVector.slice(0, 5));

        // check fot the chunks similar to this query
        const { data: documents, error } = await supabase.rpc('match_legal_docs', {
            query_embedding: queryVector,
            match_threshold: 0.2,
            match_count: 5,
            file_filter: fileName
        })

        if(!documents || documents.length === 0) {
            console.log("NO CHUNK RETRIEVED BY SUPABASE")
            const aiGeneratedAnswer = await getDocQueryResponse(query, "");
            return NextResponse.json({
                answer: aiGeneratedAnswer,
                sources: '',
                uniquePages: ''
            });
        } else {
            console.log(documents);
        }

        const contextFromSupabase = documents.map((doc, index) => {
            return `[Source ${index + 1} - Page ${doc.metadata?.page_number}]: ${doc.content}`;
        }).join("\n\n");

        const sources = documents.map(doc => ({
            content: doc.content,
            pageNumber: doc.metadata?.page_number
        }));

        const uniquePages = [...new Set(documents.map(doc => doc.metadata?.page_number))];

        

        // send the query with the related chunks to the AI model for the answer

        const aiGeneratedAnswer = await getDocQueryResponse(rephrasedQuery, contextFromSupabase);
        console.log(aiGeneratedAnswer);

        // send the reply to the consultant on the frontend
        return NextResponse.json({
            answer: aiGeneratedAnswer,
            sources: sources,
            uniquePages: uniquePages ? uniquePages : ""
        });

    } catch (error) {
        console.error("Error in fetching consultant answer: ", error);
        throw error;
    }
}