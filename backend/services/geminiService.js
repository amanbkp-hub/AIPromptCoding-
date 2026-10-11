const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ==========================================
// EVALUATE USER PROMPT
// ==========================================

async function evaluatePrompt(challenge, userPrompt) {

    const prompt = `
You are an AI coding challenge prompt evaluator.

Your job is to evaluate whether the user's prompt clearly explains how to solve the given coding problem.

DO NOT provide the solution.
DO NOT provide code.
DO NOT reveal the intended algorithm if the user's prompt is incomplete.

CODING CHALLENGE:
${challenge.description}

INPUT FORMAT:
${challenge.inputFormat}

OUTPUT FORMAT:
${challenge.outputFormat}

CONSTRAINTS:
${challenge.constraints.join("\n")}

USER PROMPT:
${userPrompt}

Evaluate the user's prompt using these categories:

1. Objective: 20 points
2. Approach: 25 points
3. Constraints: 15 points
4. Edge Cases: 15 points
5. Output Requirements: 10 points
6. Implementation Requirements: 15 points

Return ONLY valid JSON in this format:

{
    "objective": 0,
    "approach": 0,
    "constraints": 0,
    "edgeCases": 0,
    "outputRequirements": 0,
    "implementation": 0,
    "overallScore": 0,
    "status": "READY",
    "feedback": "",
    "missingInformation": []
}

READY should only be returned when overallScore is 80 or higher.
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt
            });

            return {
                text: response.text,
                usage: response.usageMetadata
            };

        } catch (error) {

            if (error.status === 503 && attempt < maxRetries) {

                const delay = attempt * 2000;

                console.log(
                    `Gemini temporarily unavailable. Retrying in ${delay / 1000} seconds...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                );

            } else {

                throw error;

            }
        }
    }
}


// ==========================================
// GENERATE JAVA CODE
// ==========================================

async function generateCode(challenge, userPrompt) {

    const prompt = `
You are an expert Java programmer generating code for an AI coding challenge platform.

The user has already written a sufficiently clear solution prompt.

Generate the Java solution based ONLY on the coding challenge and the user's prompt.

CODING CHALLENGE:
${challenge.description}

INPUT FORMAT:
${challenge.inputFormat}

OUTPUT FORMAT:
${challenge.outputFormat}

CONSTRAINTS:
${challenge.constraints.join("\n")}

EXAMPLES:
${challenge.examples
    .map(example => `
Input: ${example.input}
Output: ${example.output}
Explanation: ${example.explanation}
`)
    .join("\n")}

USER'S SOLUTION PROMPT:
${userPrompt}

IMPORTANT RULES:

1. Generate complete Java code.
2. Follow the user's described approach.
3. Handle the stated edge cases.
4. Follow the given constraints.
5. Follow the required input and output format.
6. Do not include Markdown code fences.
7. Return ONLY the Java source code.
8. Do not explain the solution.
`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt
            });

            return {
                code: response.text.trim(),
                usage: response.usageMetadata
            };

        } catch (error) {

            if (error.status === 503 && attempt < maxRetries) {

                const delay = attempt * 2000;

                console.log(
                    `Gemini temporarily unavailable. Retrying in ${delay / 1000} seconds...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                );

            } else {

                throw error;

            }
        }
    }
}



/* ==========================================
   GENERATE CODING CHALLENGE
========================================== */

async function generateChallenge(difficulty = "Medium", concepts = []) {

    const prompt = `
You are an expert coding challenge creator for an AI coding practice platform.

Create ONE original coding challenge.

Difficulty: ${difficulty}
Concepts to practice: ${concepts.length ? concepts.join(", ") : "Data Structures and Algorithms"}

Return ONLY valid JSON with this exact structure:

{
  "title": "Challenge title",
  "description": "Complete problem statement",
  "difficulty": "${difficulty}",
  "language": "Java",
  "inputFormat": "Exact input format",
  "outputFormat": "Exact output format",
  "constraints": ["Constraint 1", "Constraint 2"],
  "examples": [
    {
      "input": "Sample input",
      "output": "Expected output",
      "explanation": "Why this output is correct"
    }
  ],
  "concepts": ["Concept 1", "Concept 2"],
  "publicTests": [
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    }
  ],
  "hiddenTests": [
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    },
    {
      "input": "Test input",
      "expectedOutput": "Expected output"
    }
  ]
}

Rules:
1. Make the problem appropriate for ${difficulty} difficulty.
2. Ensure every expected output is correct for its input.
3. Public and hidden tests must follow the exact input/output format.
4. Include edge cases in the tests.
5. Do not include a solution or code.
6. Return valid JSON only, without Markdown code fences.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    let text = response.text.trim();

    // Remove Markdown code fences if Gemini includes them.
    text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");

    const challenge = JSON.parse(text);

    // Basic validation before returning the challenge.
    const requiredFields = [
        "title",
        "description",
        "difficulty",
        "language",
        "inputFormat",
        "outputFormat",
        "constraints",
        "examples",
        "concepts",
        "publicTests",
        "hiddenTests"
    ];

    for (const field of requiredFields) {
        if (challenge[field] === undefined || challenge[field] === null) {
            throw new Error(`Generated challenge is missing: ${field}`);
        }
    }

    if (
        !Array.isArray(challenge.publicTests) ||
        !Array.isArray(challenge.hiddenTests) ||
        challenge.publicTests.length === 0 ||
        challenge.hiddenTests.length === 0
    ) {
        throw new Error("Generated challenge has invalid test cases.");
    }

    return {
        challenge,
        usage: response.usageMetadata
    };
}


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
    evaluatePrompt,
    generateCode,
    generateChallenge
};
