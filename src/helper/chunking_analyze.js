




    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    async function fetchWithRetry(chunks, attempt = 0) {
        const MAX_RETRIES = 3;

        try {
            const response = await fetch("link_to_ai",
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            inputs: chunks,
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
            return fetchWithRetry(chunks, attempt + 1);
        }
    }


    async function processALlChunks(allChunks) {
        const batch_size = 20;
        let allVectors = [];

        // Sliding Window Loop
        for (let i = 0; i < allChunks.length; i += batch_size) {
            const batch = allChunks.slice(i, i + batch_size);

            console.log(`Processing Batch: ${i / batch_size + 1}`);

            try {
                const vectors_for_cur_batch = await fetchWithRetry(batch);
                allVectors.push(...vectors_for_cur_batch);

                await sleep(1000);
            } catch (error) {
                console.error("Batch failed after all retries. Moving to next.");
            }
        }

        return allVectors;
    }