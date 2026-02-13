export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function query_to_vector( query,  attempt = 0 ) {

    const MAX_RETRIES = 3;
    try {
        const response = await fetch("https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5/pipeline/feature-extraction",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        inputs: query,
                        options: { wait_for_model: true }
                    }
                )
            }
        );

        if ( response.status === 503 || response.status === 429 ) {
            throw new Error("Server Busy")
        }

        return await response.json()
    } catch (error) {
        if ( attempt >= MAX_RETRIES ) throw error;

        // Exponential Backoff Logic
        const backOffTime = Math.pow(2, attempt) * 1000;

        // Jitter
        const jitter = Math.random() * 1000;

        const totalWait = backOffTime + jitter;

        console.log(`Retrying in ${Math.round(totalWait)}ms...`);

        // Now waiting before calling the AI model again
        await new Promise(res => setTimeout(res, totalWait));
        return query_to_vector(query, attempt + 1);
    }
}


