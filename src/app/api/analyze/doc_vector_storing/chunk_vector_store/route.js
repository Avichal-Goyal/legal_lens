import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST (request) {

    try {
        const { chunks, vectors, fileName } = await request.json();
        // prepare the data to match your SQL table columns
        let curPage = 1;

        const rows = chunks.map((chunk, index) => {
            const text = typeof chunk === 'string' ? chunk : chunk.content;

            const pageMatch = text.match(/--- PAGE (\d+) ---/);

            if(pageMatch) {
                curPage = parseInt(pageMatch[1]);
            }

            return {
                file_name: fileName,
                content: text,
                embedding: vectors[index],
                metadata: {
                    page_number: curPage
                }
            };
        });

        const { data, error } = await supabase
            .from('legal_docs')
            .insert(rows)
            .select();

            if(error) {
                console.error("Supabase error details:", error.message);
                throw error;
            }

            console.log(`Successfully saved ${rows.length} chunks to Supabase`);
            return NextResponse.json({
                success: true,
                message: "Data stored",
                count: rows.length
            });
    } catch (error) {
        console.error("Supabase Insertion Error:", error.message);
        throw error;
    }
}