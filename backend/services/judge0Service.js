const JUDGE0_API_URL =
    process.env.JUDGE0_API_URL || "https://ce.judge0.com";

const JAVA_LANGUAGE_ID = 62;


// ==========================================
// RUN JAVA CODE
// ==========================================

async function runJavaCode(sourceCode, stdin = "") {

    const headers = {
        "Content-Type": "application/json"
    };


    // ------------------------------------------
    // ADD JUDGE0 AUTH TOKEN IF AVAILABLE
    // ------------------------------------------

    if (process.env.JUDGE0_API_KEY) {

        headers["X-Auth-Token"] =
            process.env.JUDGE0_API_KEY;

    }


    // ------------------------------------------
    // NORMALIZE INPUT
    // ------------------------------------------

    const normalizedInput =
        String(stdin)
            .replace(/\\n/g, "\n")
            .replace(/\r\n/g, "\n");


    // ------------------------------------------
    // 1. CREATE SUBMISSION
    // ------------------------------------------

    const submissionResponse = await fetch(
        `${JUDGE0_API_URL}/submissions/?base64_encoded=false&wait=false`,
        {
            method: "POST",

            headers: headers,

            body: JSON.stringify({

                source_code: sourceCode,

                language_id:
                    JAVA_LANGUAGE_ID,

                stdin:
                    normalizedInput

            })
        }
    );


    // ------------------------------------------
    // CHECK SUBMISSION REQUEST
    // ------------------------------------------

    if (!submissionResponse.ok) {

        const errorText =
            await submissionResponse.text();

        throw new Error(
            `Judge0 submission failed: ${errorText}`
        );

    }


    const submission =
        await submissionResponse.json();


    const token =
        submission.token;


    if (!token) {

        throw new Error(
            "Judge0 did not return a submission token."
        );

    }


    // ------------------------------------------
    // 2. CHECK SUBMISSION RESULT
    // ------------------------------------------

    let result = null;


    for (
        let attempt = 1;
        attempt <= 20;
        attempt++
    ) {

        await new Promise(resolve =>
            setTimeout(resolve, 1500)
        );


        const resultResponse =
            await fetch(
                `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`,
                {
                    method: "GET",

                    headers: headers
                }
            );


        if (!resultResponse.ok) {

            const errorText =
                await resultResponse.text();

            throw new Error(
                `Judge0 result request failed: ${errorText}`
            );

        }


        result =
            await resultResponse.json();


        const statusId =
            result.status?.id;


        // 1 = In Queue
        // 2 = Processing
        // Anything else = Finished

        if (
            statusId !== 1 &&
            statusId !== 2
        ) {

            break;

        }

    }


    // ------------------------------------------
    // 3. RETURN RESULT
    // ------------------------------------------

    return {

        status:
            result?.status || null,

        stdout:
            result?.stdout || "",

        stderr:
            result?.stderr || "",

        compileOutput:
            result?.compile_output || "",

        message:
            result?.message || "",

        time:
            result?.time || 0,

        memory:
            result?.memory || 0,

        token:
            result?.token || token

    };

}


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    runJavaCode
};