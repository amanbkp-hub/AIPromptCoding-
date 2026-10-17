// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const User = require("./models/User.js");

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const Challenge = require("./models/challenge.js");
// const Session = require("./models/session.js");
// const PromptAttempt = require("./models/PromptAttempt.js");
// const TokenTransaction = require("./models/TokenTransaction.js");
// const Submission = require("./models/Submission.js");

// const {
//     evaluatePrompt,
//     generateCode,
//     generateChallenge
// } = require("./services/geminiService");

// const {
//     runJavaCode
// } = require("./services/judge0Service.js");


 
// // ==========================================
// // DAILY TOKEN REFILL
// // ==========================================

   

// async function refillDailyTokens(user) {
//     const now = new Date();

//     const lastRefill = user.lastTokenRefill
//         ? new Date(user.lastTokenRefill)
//         : now;

//     const oneDay = 24 * 60 * 60 * 1000;
//     const elapsedTime = now.getTime() - lastRefill.getTime();

//     if (elapsedTime >= oneDay) {
//         user.tokens = 10000;
//         user.dailyTokenLimit = 10000;
//         user.lastTokenRefill = now;

//         await user.save();
//     }

//     return user;
// }

 


// function authenticateToken(req, res, next) {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : null;

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "Authentication required."
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.userId;
//         next();
//     } catch {
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token."
//         });
//     }
// }

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ==========================================
// // TEST USER
// // ==========================================
// app.post("/api/test-user", async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         const user = new User({
//             name: name,
//             email: email,
//             password: "test-password"
//         });
//         const savedUser = await user.save();
//         res.status(201).json({
//             success: true,
//             message: "User created successfully!",
//             user: savedUser
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to create user",
//             error: error.message
//         });
//     }
// });

// // ==========================================
// // TEST CHALLENGE
// // ==========================================
// app.post("/api/test-challenge", async (req, res) => {
//     try {
//         const challenge = new Challenge({
//             title: "Two Sum",
//             description:
//                 "Given an array of integers and a target, return the indices of two numbers that add up to the target.",
//             difficulty: "MEDIUM",
//             language: "Java",
//             inputFormat: "First line contains an integer n. Second line contains n space-separated integers. Third line contains the target integer.",
//             outputFormat: "Print two different indices whose values add up to the target. Print the indices separated by a space. If no valid pair exists, print -1.",
//             constraints: [
//                 "2 <= n <= 100000",
//                 "-1000000000 <= nums[i] <= 1000000000",
//                 "-1000000000 <= target <= 1000000000",
//                 "Indices must be different."
//             ],
//             examples: [
//                 {
//                     input: "4\n2 7 11 15\n9",
//                     output: "0 1",
//                     explanation: "nums[0] + nums[1] = 2 + 7 = 9."
//                 },
//                 {
//                     input: "5\n3 2 4 3 7\n6",
//                     output: "1 2",
//                     explanation: "nums[1] + nums[2] = 2 + 4 = 6."
//                 }
//             ],
//             concepts: [
//                 "Array",
//                 "HashMap"
//             ],
//             publicTests: [
//                 {
//                     input: "4\n2 7 11 15\n9",
//                     expectedOutput: "0 1"
//                 },
//                 {
//                     input: "5\n3 2 4 3 7\n6",
//                     expectedOutput: "1 2"
//                 },
//                 {
//                     input: "4\n1 5 8 10\n20",
//                     expectedOutput: "-1"
//                 }
//             ],
//             hiddenTests: [
//                 {
//                     input: "6\n10 20 30 40 50 60\n90",
//                     expectedOutput: "2 4"
//                 },
//                 {
//                     input: "5\n-3 4 7 -1 2\n1",
//                     expectedOutput: "0 2"
//                 },
//                 {
//                     input: "6\n5 5 10 15 20 25\n10",
//                     expectedOutput: "0 1"
//                 }
//             ]
//         });

//         const savedChallenge = await challenge.save();
//         return res.status(201).json({
//             success: true,
//             message: "Test challenge created successfully!",
//             challenge: savedChallenge
//         });
//     } catch (error) {
//         console.error("Test challenge error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create test challenge",
//             error: error.message
//         });
//     }
// });

// // ==========================================
// // GENERATE CHALLENGE
// // ==========================================
// app.post("/api/generate-challenge", async (req, res) => {
//     try {
//         const { difficulty = "Medium", concepts = [] } = req.body;

//         const allowedDifficulties = ["Easy", "Medium", "Hard"];
//         if (!allowedDifficulties.includes(difficulty)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Difficulty must be Easy, Medium, or Hard."
//             });
//         }

//         if (!Array.isArray(concepts)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Concepts must be an array."
//             });
//         }

//         const result = await generateChallenge(difficulty, concepts);
        
// const challengeData = {
//     ...result.challenge,
//     difficulty: result.challenge.difficulty.toUpperCase()
// };


//         const savedChallenge = await Challenge.create(challengeData);

//         return res.status(201).json({
//             success: true,
//             message: "Coding challenge generated successfully!",
//             challenge: savedChallenge
//         });

//     } catch (error) {
//         console.error("Generate challenge error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to generate coding challenge.",
//             error: error.message
//         });
//     }
// });

// // ==========================================
// // TEST SESSION
// // ==========================================

      
// app.post("/api/test-session", async (req, res) => {
//     try {
//         const { userId, challengeId } = req.body;

//         // Find the user
        
// const user = await User.findById(userId);

// if (!user) {
//     return res.status(404).json({
//         success: false,
//         message: "User not found"
//     });
// }

// await refillDailyTokens(user);


//         // Apply daily token refill if due
//         await refillDailyTokens(user);

//         // Create a new session using the user's current token balance
//         const session = new Session({
//             userId: userId,
//             challengeId: challengeId,
//             tokenBudget: user.tokens,
//             tokensRemaining: user.tokens
//         });

//         const savedSession = await session.save();

//         res.status(201).json({
//             success: true,
//             message: "Session created successfully!",
//             session: savedSession
//         });
//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to create session",
//             error: error.message
//         });
//     }
// });



// app.get("/api/latest-session/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const session = await Session.findOne({ userId })
//             .sort({ createdAt: -1 })
//             .populate("challengeId");

//         if (!session || !session.challengeId) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No previous challenge found."
//             });
//         }

//         return res.json({
//             success: true,
//             session: {
//                 _id: session._id,
//                 status: session.status,
//                 challenge: session.challengeId,
//                 tokensRemaining: session.tokensRemaining,
//                 generatedCode: session.generatedCode || ""
//             }
//         });
//     } catch (error) {
//         console.error("Latest session error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to load the latest challenge."
//         });
//     }
// });

  

// // ==========================================
// // TEST PROMPT EVALUATION
// // ==========================================
// app.post("/api/test-prompt", async (req, res) => {
//     try {
//         const {
//             sessionId,
//             userId,
//             challengeId,
//             userPrompt,
//             prompt
//         } = req.body;

//         const actualPrompt = userPrompt || prompt;

//         if (!sessionId || !userId || !challengeId || !actualPrompt) {
//             return res.status(400).json({
//                 success: false,
//                 message: "sessionId, userId, challengeId and userPrompt are required"
//             });
//         }

//         const user = await User.findById(userId);
//         await refillDailyTokens(user);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         if (user.tokens <= 0) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Insufficient tokens"
//             });
//         }

//         const session = await Session.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Session not found"
//             });
//         }

//         if (session.status === "COMPLETED") {
//             return res.status(400).json({
//                 success: false,
//                 message: "This challenge has already been completed."
//             });
//         }

//         if (session.tokensRemaining <= 0) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Session token budget exhausted"
//             });
//         }

//         const challenge = await Challenge.findById(challengeId);
//         if (!challenge) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Challenge not found"
//             });
//         }

//         const aiResult = await evaluatePrompt(
//             challenge,
//             actualPrompt
//         );

//         const cleanJson = aiResult.text
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim();

//         const evaluation = JSON.parse(cleanJson);
//         const tokensUsed = aiResult.usage?.totalTokenCount || 0;

//         const promptAttempt = new PromptAttempt({
//             sessionId: sessionId,
//             userId: userId,
//             userPrompt: actualPrompt,
//             evaluation: {
//                 objective: evaluation.objective,
//                 approach: evaluation.approach,
//                 constraints: evaluation.constraints,
//                 edgeCases: evaluation.edgeCases,
//                 outputRequirements: evaluation.outputRequirements,
//                 implementation: evaluation.implementation,
//                 overallScore: evaluation.overallScore
//             },
//             aiFeedback: evaluation.feedback,
//             missingInformation: evaluation.missingInformation,
//             tokensUsed: tokensUsed
//         });

//         const savedAttempt = await promptAttempt.save();
        
// const attempts = await PromptAttempt.find({ userId: userId });

// const totalScore = attempts.reduce((sum, attempt) => {
//     return sum + (attempt.evaluation?.overallScore || 0);
// }, 0);

// user.averagePromptScore = attempts.length
//     ? Math.round(totalScore / attempts.length)
//     : 0;

//         session.promptScore = evaluation.overallScore;
//         session.understandingScore = evaluation.overallScore;

//         session.tokensUsed += tokensUsed;
//         session.tokensRemaining = session.tokenBudget - session.tokensUsed;
//         if (session.tokensRemaining < 0) {
//             session.tokensRemaining = 0;
//         }
//         await session.save();

//         user.tokens -= tokensUsed;
//         if (user.tokens < 0) {
//             user.tokens = 0;
//         }
//         await user.save();

//         const tokenTransaction = new TokenTransaction({
//             userId: userId,
//             sessionId: sessionId,
//             type: "PROMPT_EVALUATION",
//             amount: tokensUsed,
//             description: "Tokens used for prompt evaluation"
//         });
//         await tokenTransaction.save();

//         res.status(201).json({
//             success: true,
//             message: "Prompt evaluated successfully!",
//             evaluation: savedAttempt,
//             status: evaluation.overallScore >= 80 ? "READY" : "NOT_READY",
//             tokenUsage: {
//                 tokensUsed: tokensUsed,
//                 sessionTokensRemaining: session.tokensRemaining,
//                 userTokensRemaining: user.tokens
//             }
//         });
//     } catch (error) {
//         console.error("Prompt evaluation error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Prompt evaluation failed",
//             error: error.message
//         });
//     }
// });

// // ==========================================
// // GENERATE CODE
// // ==========================================
// app.post("/api/generate-code", async (req, res) => {
//     try {
//         const {
//             sessionId,
//             userId,
//             challengeId,
//             userPrompt,
//             prompt
//         } = req.body;

//         const actualPrompt = userPrompt || prompt;

//         if (!sessionId || !userId || !challengeId || !actualPrompt) {
//             return res.status(400).json({
//                 success: false,
//                 message: "sessionId, userId, challengeId and userPrompt are required"
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }
//         await refillDailyTokens(user);

//         if (user.tokens <= 0) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Insufficient tokens"
//             });
//         }

//         const session = await Session.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Session not found"
//             });
//         }

//         if (session.tokensRemaining <= 0) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Session token budget exhausted"
//             });
//         }

//         if (session.promptScore < 80) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Prompt is not ready for code generation",
//                 promptScore: session.promptScore
//             });
//         }

//         const challenge = await Challenge.findById(challengeId);
//         if (!challenge) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Challenge not found"
//             });
//         }

//         const aiResult = await generateCode(
//             challenge,
//             actualPrompt
//         );

//         const generatedCode = aiResult.code;
//         const tokensUsed = aiResult.usage?.totalTokenCount || 0;

//         session.generatedCode = generatedCode;
//         session.tokensUsed += tokensUsed;
//         session.tokensRemaining = session.tokenBudget - session.tokensUsed;
//         if (session.tokensRemaining < 0) {
//             session.tokensRemaining = 0;
//         }
//         await session.save();

//         user.tokens -= tokensUsed;
//         if (user.tokens < 0) {
//             user.tokens = 0;
//         }
//         await user.save();

//         const tokenTransaction = new TokenTransaction({
//             userId: userId,
//             sessionId: sessionId,
//             type: "CODE_GENERATION",
//             amount: tokensUsed,
//             description: "Tokens used for code generation"
//         });
//         await tokenTransaction.save();

//         res.status(200).json({
//             success: true,
//             message: "Code generated successfully!",
//             code: generatedCode,
//             tokenUsage: {
//                 tokensUsed: tokensUsed,
//                 sessionTokensRemaining: session.tokensRemaining,
//                 userTokensRemaining: user.tokens
//             }
//         });
//     } catch (error) {
//         console.error("Code generation error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Code generation failed",
//             error: error.message
//         });
//     }
// });

// // ==========================================
// // RUN CODE USING JUDGE0
// // ==========================================
// app.post("/api/run-code", async (req, res) => {
//     try {
//         const {
//             sessionId,
//             userId,
//             code,
//             input
//         } = req.body;

//         if (!sessionId || !userId || !code) {
//             return res.status(400).json({
//                 success: false,
//                 message: "sessionId, userId and code are required"
//             });
//         }

//         const session = await Session.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Session not found"
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const result = await runJavaCode(
//             code,
//             input || ""
//         );

//         let submissionStatus = "ERROR";
//         if (result.status?.id === 3) {
//             submissionStatus = "PASSED";
//         } else if ([4, 5, 6, 7, 8].includes(result.status?.id)) {
//             submissionStatus = "FAILED";
//         }

//         const submission = new Submission({
//             sessionId: sessionId,
//             userId: userId,
//             language: "Java",
//             code: code,
//             executionTime: result.time || 0,
//             memoryUsed: result.memory || 0,
//             status: submissionStatus,
//             errorMessage:
//                 result.stderr ||
//                 result.compileOutput ||
//                 result.message ||
//                 ""
//         });
//         await submission.save();

//         return res.json({
//             success: true,
//             status: result.status,
//             stdout: result.stdout,
//             stderr: result.stderr,
//             compileOutput: result.compileOutput,
//             message: result.message,
//             time: result.time,
//             memory: result.memory,
//             submissionId: submission._id
//         });
//     } catch (error) {
//         console.error("Run code error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to run code"
//         });
//     }
// });

// // ==========================================
// // RUN PUBLIC TESTS
// // ==========================================
// app.post("/api/run-tests", async (req, res) => {
//     try {
//         const {
//             sessionId,
//             userId,
//             code
//         } = req.body;

//         if (!sessionId || !userId || !code) {
//             return res.status(400).json({
//                 success: false,
//                 message: "sessionId, userId and code are required"
//             });
//         }

//         const session = await Session.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Session not found"
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const challenge = await Challenge.findById(session.challengeId);
//         if (!challenge) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Challenge not found"
//             });
//         }

//         const publicTests = challenge.publicTests || [];
//         if (publicTests.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No public tests found"
//             });
//         }

//         const testResults = [];
//         let passedTests = 0;
//         for (let i = 0; i < publicTests.length; i++) {
//             const test = publicTests[i];
//             const result = await runJavaCode(
//                 code,
//                 test.input
//             );
//             const actualOutput = (result.stdout || "").trim();
//             const expectedOutput = (test.expectedOutput || "").trim();
//             const passed =
//                 result.status?.id === 3 &&
//                 actualOutput === expectedOutput;

//             if (passed) {
//                 passedTests++;
//             }

//             testResults.push({
//                 testNumber: i + 1,
//                 passed: passed,
//                 input: test.input,
//                 actualOutput: actualOutput,
//                 expectedOutput: expectedOutput,
//                 status: result.status?.description || "Unknown",
//                 error:
//                     result.stderr ||
//                     result.compileOutput ||
//                     result.message ||
//                     ""
//             });

//             if (result.status?.id !== 3 && result.compileOutput) {
//                 break;
//             }
//         }

//         const totalTests = publicTests.length;
//         const allPassed = passedTests === totalTests;
//         const submissionStatus = allPassed ? "PASSED" : "FAILED";

//         const submission = new Submission({
//             sessionId: sessionId,
//             userId: userId,
//             language: "Java",
//             code: code,
//             publicTestsPassed: passedTests,
//             publicTestsTotal: totalTests,
//             hiddenTestsPassed: 0,
//             hiddenTestsTotal: 0,
//             status: submissionStatus,
//             errorMessage: allPassed ? "" : "One or more public tests failed."
//         });
//         await submission.save();

//         return res.json({
//             success: true,
//             passedTests: passedTests,
//             totalTests: totalTests,
//             status: submissionStatus,
//             testResults: testResults,
//             submissionId: submission._id
//         });
//     } catch (error) {
//         console.error("Run tests error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to run public tests"
//         });
//     }
// });

// // ==========================================
// // SUBMIT CODE - RUN HIDDEN TESTS
// // ==========================================
// app.post("/api/submit-code", async (req, res) => {
//     try {
//         const {
//             sessionId,
//             userId,
//             code
//         } = req.body;

//         if (!sessionId || !userId || !code) {
//             return res.status(400).json({
//                 success: false,
//                 message: "sessionId, userId and code are required"
//             });
//         }

//         const session = await Session.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Session not found"
//             });
//         }

//         if (session.status === "COMPLETED") {
//             return res.status(400).json({
//                 success: false,
//                 message: "This challenge has already been completed."
//             });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const challenge = await Challenge.findById(session.challengeId);
//         if (!challenge) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Challenge not found"
//             });
//         }

//         const hiddenTests = challenge.hiddenTests || [];
//         if (hiddenTests.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No hidden tests found"
//             });
//         }

//         const testResults = [];
//         let passedTests = 0;
//         for (let i = 0; i < hiddenTests.length; i++) {
//             const test = hiddenTests[i];
//             const result = await runJavaCode(
//                 code,
//                 test.input
//             );
//             const actualOutput = (result.stdout || "").trim();
//             const expectedOutput = (test.expectedOutput || "").trim();
//             const passed =
//                 result.status?.id === 3 &&
//                 actualOutput === expectedOutput;

//             if (passed) {
//                 passedTests++;
//             }

//             testResults.push({
//                 testNumber: i + 1,
//                 passed: passed,
//                 status: result.status?.description || "",
//                 actualOutput: actualOutput,
//                 error:
//                     result.stderr ||
//                     result.compileOutput ||
//                     result.message ||
//                     ""
//             });

//             if (result.status?.id !== 3 && result.compileOutput) {
//                 break;
//             }
//         }

//         const totalTests = hiddenTests.length;
//         const allPassed = passedTests === totalTests;

        
// if (allPassed) {
//     session.status = "COMPLETED";
//     session.completedAt = new Date();
//     session.generatedCode = code;
//     await session.save();

//     user.totalSolved = (user.totalSolved || 0) + 1;
// }

// user.totalChallenges = (user.totalChallenges || 0) + 1;
// await user.save();

//         const submissionStatus = allPassed ? "PASSED" : "FAILED";

//         const submission = new Submission({
//             sessionId: sessionId,
//             userId: userId,
//             language: "Java",
//             code: code,
//             publicTestsPassed: 0,
//             publicTestsTotal: 0,
//             hiddenTestsPassed: passedTests,
//             hiddenTestsTotal: totalTests,
//             status: submissionStatus,
//             errorMessage: allPassed ? "" : "One or more hidden tests failed."
//         });
//         await submission.save();

//         return res.json({
//             success: true,
//             status: submissionStatus,
//             passedTests: passedTests,
//             totalTests: totalTests,
//             testResults: testResults,
//             submissionId: submission._id
//         });
//     } catch (error) {
//         console.error("Submit code error:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to submit code"
//         });
//     }
// });



// app.get("/api/user-stats/:userId", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.userId);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const promptStats = await PromptAttempt.aggregate([
//             {
//                 $match: {
//                     userId: user._id
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     averageScore: {
//                         $avg: "$evaluation.overallScore"
//                     }
//                 }
//             }
//         ]);

//         const averagePromptScore = Math.round(
//             promptStats[0]?.averageScore || 0
//         );

//         return res.json({
//             success: true,
//             stats: {
//                 totalChallenges: user.totalChallenges || 0,
//                 totalSolved: user.totalSolved || 0,
//                 averagePromptScore,
//                 tokens: user.tokens
//             }
//         });

//     } catch (error) {
//         console.error("User stats error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to load user statistics"
//         });
//     }
// });


// // ==========================================
// // SERVER INITIALIZATION
// // ==========================================
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai-prompt-coding";

// mongoose
//     .connect(MONGO_URI)
//     .then(() => {
//         console.log("Connected to MongoDB successfully.");
        
// app.post("/api/register", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Name, email, and password are required."
//             });
//         }

//         if (password.length < 8) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password must be at least 8 characters."
//             });
//         }

//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Email is already registered."
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Registration successful.",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 tokens: user.tokens
//             }
//         });
//     } catch (error) {
//         console.error("Registration error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Registration failed."
//         });
//     }
// });

// app.post("/api/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and password are required."
//             });
//         }

//         const user = await User.findOne({
//             email: email.toLowerCase().trim()
//         });

//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password."
//             });
//         }

//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Login successful.",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 tokens: user.tokens
//             }
//         });
//     } catch (error) {
//         console.error("Login error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Login failed."
//         });
//     }
// });


//         app.listen(PORT, () => {
//             console.log(`Server running on http://localhost:${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error("Database connection error:", err);
//     });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Challenge = require("./models/challenge.js");
const Session = require("./models/session.js");
const PromptAttempt = require("./models/PromptAttempt.js");
const TokenTransaction = require("./models/TokenTransaction.js");
const Submission = require("./models/Submission.js");

const {
    evaluatePrompt,
    generateCode,
    generateChallenge
} = require("./services/geminiService");

const {
    runJavaCode
} = require("./services/judge0Service.js");


 
// ==========================================
// DAILY TOKEN REFILL
// ==========================================

   

async function refillDailyTokens(user) {
    const now = new Date();

    const lastRefill = user.lastTokenRefill
        ? new Date(user.lastTokenRefill)
        : now;

    const oneDay = 24 * 60 * 60 * 1000;
    const elapsedTime = now.getTime() - lastRefill.getTime();

    if (elapsedTime >= oneDay) {
        user.tokens = 10000;
        user.dailyTokenLimit = 10000;
        user.lastTokenRefill = now;

        await user.save();
    }

    return user;
}

 


function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// TEST USER
// ==========================================
app.post("/api/test-user", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({
            name: name,
            email: email,
            password: "test-password"
        });
        const savedUser = await user.save();
        res.status(201).json({
            success: true,
            message: "User created successfully!",
            user: savedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
});

// ==========================================
// TEST CHALLENGE
// ==========================================
app.post("/api/test-challenge", async (req, res) => {
    try {
        const challenge = new Challenge({
            title: "Two Sum",
            description:
                "Given an array of integers and a target, return the indices of two numbers that add up to the target.",
            difficulty: "MEDIUM",
            language: "Java",
            inputFormat: "First line contains an integer n. Second line contains n space-separated integers. Third line contains the target integer.",
            outputFormat: "Print two different indices whose values add up to the target. Print the indices separated by a space. If no valid pair exists, print -1.",
            constraints: [
                "2 <= n <= 100000",
                "-1000000000 <= nums[i] <= 1000000000",
                "-1000000000 <= target <= 1000000000",
                "Indices must be different."
            ],
            examples: [
                {
                    input: "4\n2 7 11 15\n9",
                    output: "0 1",
                    explanation: "nums[0] + nums[1] = 2 + 7 = 9."
                },
                {
                    input: "5\n3 2 4 3 7\n6",
                    output: "1 2",
                    explanation: "nums[1] + nums[2] = 2 + 4 = 6."
                }
            ],
            concepts: [
                "Array",
                "HashMap"
            ],
            publicTests: [
                {
                    input: "4\n2 7 11 15\n9",
                    expectedOutput: "0 1"
                },
                {
                    input: "5\n3 2 4 3 7\n6",
                    expectedOutput: "1 2"
                },
                {
                    input: "4\n1 5 8 10\n20",
                    expectedOutput: "-1"
                }
            ],
            hiddenTests: [
                {
                    input: "6\n10 20 30 40 50 60\n90",
                    expectedOutput: "2 4"
                },
                {
                    input: "5\n-3 4 7 -1 2\n1",
                    expectedOutput: "0 2"
                },
                {
                    input: "6\n5 5 10 15 20 25\n10",
                    expectedOutput: "0 1"
                }
            ]
        });

        const savedChallenge = await challenge.save();
        return res.status(201).json({
            success: true,
            message: "Test challenge created successfully!",
            challenge: savedChallenge
        });
    } catch (error) {
        console.error("Test challenge error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create test challenge",
            error: error.message
        });
    }
});

// ==========================================
// GENERATE CHALLENGE
// ==========================================
app.post("/api/generate-challenge", async (req, res) => {
    try {
        const { difficulty = "Medium", concepts = [] } = req.body;

        const allowedDifficulties = ["Easy", "Medium", "Hard"];
        if (!allowedDifficulties.includes(difficulty)) {
            return res.status(400).json({
                success: false,
                message: "Difficulty must be Easy, Medium, or Hard."
            });
        }

        if (!Array.isArray(concepts)) {
            return res.status(400).json({
                success: false,
                message: "Concepts must be an array."
            });
        }

        const result = await generateChallenge(difficulty, concepts);
        
const challengeData = {
    ...result.challenge,
    difficulty: result.challenge.difficulty.toUpperCase()
};


        const savedChallenge = await Challenge.create(challengeData);

        return res.status(201).json({
            success: true,
            message: "Coding challenge generated successfully!",
            challenge: savedChallenge
        });

    } catch (error) {
        console.error("Generate challenge error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate coding challenge.",
            error: error.message
        });
    }
});

// ==========================================
// TEST SESSION
// ==========================================

      
app.post("/api/test-session", async (req, res) => {
    try {
        const { userId, challengeId } = req.body;

        // Find the user
        
const user = await User.findById(userId);

if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found"
    });
}

await refillDailyTokens(user);


        // Apply daily token refill if due
        await refillDailyTokens(user);

        // Create a new session using the user's current token balance
        const session = new Session({
            userId: userId,
            challengeId: challengeId,
            tokenBudget: user.tokens,
            tokensRemaining: user.tokens
        });

        const savedSession = await session.save();

        res.status(201).json({
            success: true,
            message: "Session created successfully!",
            session: savedSession
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create session",
            error: error.message
        });
    }
});



app.get("/api/latest-session/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const session = await Session.findOne({ userId })
            .sort({ createdAt: -1 })
            .populate("challengeId");

        if (!session || !session.challengeId) {
            return res.status(404).json({
                success: false,
                message: "No previous challenge found."
            });
        }

        return res.json({
            success: true,
            session: {
                _id: session._id,
                status: session.status,
                challenge: session.challengeId,
                tokensRemaining: session.tokensRemaining,
                generatedCode: session.generatedCode || ""
            }
        });
    } catch (error) {
        console.error("Latest session error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load the latest challenge."
        });
    }
});

  

// ==========================================
// TEST PROMPT EVALUATION
// ==========================================
app.post("/api/test-prompt", async (req, res) => {
    try {
        const {
            sessionId,
            userId,
            challengeId,
            userPrompt,
            prompt
        } = req.body;

        const actualPrompt = userPrompt || prompt;

        if (!sessionId || !userId || !challengeId || !actualPrompt) {
            return res.status(400).json({
                success: false,
                message: "sessionId, userId, challengeId and userPrompt are required"
            });
        }

        const user = await User.findById(userId);
        await refillDailyTokens(user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.tokens <= 0) {
            return res.status(403).json({
                success: false,
                message: "Insufficient tokens"
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "This challenge has already been completed."
            });
        }

        if (session.tokensRemaining <= 0) {
            return res.status(403).json({
                success: false,
                message: "Session token budget exhausted"
            });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        const aiResult = await evaluatePrompt(
            challenge,
            actualPrompt
        );

        const cleanJson = aiResult.text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const evaluation = JSON.parse(cleanJson);
        const tokensUsed = aiResult.usage?.totalTokenCount || 0;

        const promptAttempt = new PromptAttempt({
            sessionId: sessionId,
            userId: userId,
            userPrompt: actualPrompt,
            evaluation: {
                objective: evaluation.objective,
                approach: evaluation.approach,
                constraints: evaluation.constraints,
                edgeCases: evaluation.edgeCases,
                outputRequirements: evaluation.outputRequirements,
                implementation: evaluation.implementation,
                overallScore: evaluation.overallScore
            },
            aiFeedback: evaluation.feedback,
            missingInformation: evaluation.missingInformation,
            tokensUsed: tokensUsed
        });

        const savedAttempt = await promptAttempt.save();
        
const attempts = await PromptAttempt.find({ userId: userId });

const totalScore = attempts.reduce((sum, attempt) => {
    return sum + (attempt.evaluation?.overallScore || 0);
}, 0);

user.averagePromptScore = attempts.length
    ? Math.round(totalScore / attempts.length)
    : 0;

        session.promptScore = evaluation.overallScore;
        session.understandingScore = evaluation.overallScore;

        session.tokensUsed += tokensUsed;
        session.tokensRemaining = session.tokenBudget - session.tokensUsed;
        if (session.tokensRemaining < 0) {
            session.tokensRemaining = 0;
        }
        await session.save();

        user.tokens -= tokensUsed;
        if (user.tokens < 0) {
            user.tokens = 0;
        }
        await user.save();

        const tokenTransaction = new TokenTransaction({
            userId: userId,
            sessionId: sessionId,
            type: "PROMPT_EVALUATION",
            amount: tokensUsed,
            description: "Tokens used for prompt evaluation"
        });
        await tokenTransaction.save();

        res.status(201).json({
            success: true,
            message: "Prompt evaluated successfully!",
            evaluation: savedAttempt,
            status: evaluation.overallScore >= 80 ? "READY" : "NOT_READY",
            tokenUsage: {
                tokensUsed: tokensUsed,
                sessionTokensRemaining: session.tokensRemaining,
                userTokensRemaining: user.tokens
            }
        });
    } catch (error) {
        console.error("Prompt evaluation error:", error);
        res.status(500).json({
            success: false,
            message: "Prompt evaluation failed",
            error: error.message
        });
    }
});

// ==========================================
// GENERATE CODE
// ==========================================
app.post("/api/generate-code", async (req, res) => {
    try {
        const {
            sessionId,
            userId,
            challengeId,
            userPrompt,
            prompt
        } = req.body;

        const actualPrompt = userPrompt || prompt;

        if (!sessionId || !userId || !challengeId || !actualPrompt) {
            return res.status(400).json({
                success: false,
                message: "sessionId, userId, challengeId and userPrompt are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        await refillDailyTokens(user);

        if (user.tokens <= 0) {
            return res.status(403).json({
                success: false,
                message: "Insufficient tokens"
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.tokensRemaining <= 0) {
            return res.status(403).json({
                success: false,
                message: "Session token budget exhausted"
            });
        }

        if (session.promptScore < 80) {
            return res.status(403).json({
                success: false,
                message: "Prompt is not ready for code generation",
                promptScore: session.promptScore
            });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        const aiResult = await generateCode(
            challenge,
            actualPrompt
        );

        const generatedCode = aiResult.code;
        const tokensUsed = aiResult.usage?.totalTokenCount || 0;

        session.generatedCode = generatedCode;
        session.tokensUsed += tokensUsed;
        session.tokensRemaining = session.tokenBudget - session.tokensUsed;
        if (session.tokensRemaining < 0) {
            session.tokensRemaining = 0;
        }
        await session.save();

        user.tokens -= tokensUsed;
        if (user.tokens < 0) {
            user.tokens = 0;
        }
        await user.save();

        const tokenTransaction = new TokenTransaction({
            userId: userId,
            sessionId: sessionId,
            type: "CODE_GENERATION",
            amount: tokensUsed,
            description: "Tokens used for code generation"
        });
        await tokenTransaction.save();

        res.status(200).json({
            success: true,
            message: "Code generated successfully!",
            code: generatedCode,
            tokenUsage: {
                tokensUsed: tokensUsed,
                sessionTokensRemaining: session.tokensRemaining,
                userTokensRemaining: user.tokens
            }
        });
    } catch (error) {
        console.error("Code generation error:", error);
        res.status(500).json({
            success: false,
            message: "Code generation failed",
            error: error.message
        });
    }
});

// ==========================================
// RUN CODE USING JUDGE0
// ==========================================
app.post("/api/run-code", async (req, res) => {
    try {
        const {
            sessionId,
            userId,
            code,
            input
        } = req.body;

        if (!sessionId || !userId || !code) {
            return res.status(400).json({
                success: false,
                message: "sessionId, userId and code are required"
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const result = await runJavaCode(
            code,
            input || ""
        );

        let submissionStatus = "ERROR";
        if (result.status?.id === 3) {
            submissionStatus = "PASSED";
        } else if ([4, 5, 6, 7, 8].includes(result.status?.id)) {
            submissionStatus = "FAILED";
        }

        const submission = new Submission({
            sessionId: sessionId,
            userId: userId,
            language: "Java",
            code: code,
            executionTime: result.time || 0,
            memoryUsed: result.memory || 0,
            status: submissionStatus,
            errorMessage:
                result.stderr ||
                result.compileOutput ||
                result.message ||
                ""
        });
        await submission.save();

        return res.json({
            success: true,
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            compileOutput: result.compileOutput,
            message: result.message,
            time: result.time,
            memory: result.memory,
            submissionId: submission._id
        });
    } catch (error) {
        console.error("Run code error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to run code"
        });
    }
});

// ==========================================
// RUN PUBLIC TESTS
// ==========================================
app.post("/api/run-tests", async (req, res) => {
    try {
        const {
            sessionId,
            userId,
            code
        } = req.body;

        if (!sessionId || !userId || !code) {
            return res.status(400).json({
                success: false,
                message: "sessionId, userId and code are required"
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const challenge = await Challenge.findById(session.challengeId);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        const publicTests = challenge.publicTests || [];
        if (publicTests.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No public tests found"
            });
        }

        const testResults = [];
        let passedTests = 0;
        for (let i = 0; i < publicTests.length; i++) {
            const test = publicTests[i];
            const result = await runJavaCode(
                code,
                test.input
            );
            const actualOutput = (result.stdout || "").trim();
            const expectedOutput = (test.expectedOutput || "").trim();
            const passed =
                result.status?.id === 3 &&
                actualOutput === expectedOutput;

            if (passed) {
                passedTests++;
            }

            testResults.push({
                testNumber: i + 1,
                passed: passed,
                input: test.input,
                actualOutput: actualOutput,
                expectedOutput: expectedOutput,
                status: result.status?.description || "Unknown",
                error:
                    result.stderr ||
                    result.compileOutput ||
                    result.message ||
                    ""
            });

            if (result.status?.id !== 3 && result.compileOutput) {
                break;
            }
        }

        const totalTests = publicTests.length;
        const allPassed = passedTests === totalTests;
        const submissionStatus = allPassed ? "PASSED" : "FAILED";

        const submission = new Submission({
            sessionId: sessionId,
            userId: userId,
            language: "Java",
            code: code,
            publicTestsPassed: passedTests,
            publicTestsTotal: totalTests,
            hiddenTestsPassed: 0,
            hiddenTestsTotal: 0,
            status: submissionStatus,
            errorMessage: allPassed ? "" : "One or more public tests failed."
        });
        await submission.save();

        return res.json({
            success: true,
            passedTests: passedTests,
            totalTests: totalTests,
            status: submissionStatus,
            testResults: testResults,
            submissionId: submission._id
        });
    } catch (error) {
        console.error("Run tests error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to run public tests"
        });
    }
});

// ==========================================
// SUBMIT CODE - RUN HIDDEN TESTS
// ==========================================
app.post("/api/submit-code", async (req, res) => {
    try {
        const {
            sessionId,
            userId,
            code
        } = req.body;

        if (!sessionId || !userId || !code) {
            return res.status(400).json({
                success: false,
                message: "sessionId, userId and code are required"
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        if (session.status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "This challenge has already been completed."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const challenge = await Challenge.findById(session.challengeId);
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found"
            });
        }

        const hiddenTests = challenge.hiddenTests || [];
        if (hiddenTests.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hidden tests found"
            });
        }

        const testResults = [];
        let passedTests = 0;
        for (let i = 0; i < hiddenTests.length; i++) {
            const test = hiddenTests[i];
            const result = await runJavaCode(
                code,
                test.input
            );
            const actualOutput = (result.stdout || "").trim();
            const expectedOutput = (test.expectedOutput || "").trim();
            const passed =
                result.status?.id === 3 &&
                actualOutput === expectedOutput;

            if (passed) {
                passedTests++;
            }

            testResults.push({
                testNumber: i + 1,
                passed: passed,
                status: result.status?.description || "",
                actualOutput: actualOutput,
                error:
                    result.stderr ||
                    result.compileOutput ||
                    result.message ||
                    ""
            });

            if (result.status?.id !== 3 && result.compileOutput) {
                break;
            }
        }

        const totalTests = hiddenTests.length;
        const allPassed = passedTests === totalTests;

        
if (allPassed) {
    session.status = "COMPLETED";
    session.completedAt = new Date();
    session.generatedCode = code;
    await session.save();

    user.totalSolved = (user.totalSolved || 0) + 1;
}

user.totalChallenges = (user.totalChallenges || 0) + 1;
await user.save();

        const submissionStatus = allPassed ? "PASSED" : "FAILED";

        const submission = new Submission({
            sessionId: sessionId,
            userId: userId,
            language: "Java",
            code: code,
            publicTestsPassed: 0,
            publicTestsTotal: 0,
            hiddenTestsPassed: passedTests,
            hiddenTestsTotal: totalTests,
            status: submissionStatus,
            errorMessage: allPassed ? "" : "One or more hidden tests failed."
        });
        await submission.save();

        return res.json({
            success: true,
            status: submissionStatus,
            passedTests: passedTests,
            totalTests: totalTests,
            testResults: testResults,
            submissionId: submission._id
        });
    } catch (error) {
        console.error("Submit code error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to submit code"
        });
    }
});



app.get("/api/user-stats/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const promptStats = await PromptAttempt.aggregate([
            {
                $match: {
                    userId: user._id
                }
            },
            {
                $group: {
                    _id: null,
                    averageScore: {
                        $avg: "$evaluation.overallScore"
                    }
                }
            }
        ]);

        const averagePromptScore = Math.round(
            promptStats[0]?.averageScore || 0
        );

        return res.json({
            success: true,
            stats: {
                totalChallenges: user.totalChallenges || 0,
                totalSolved: user.totalSolved || 0,
                averagePromptScore,
                tokens: user.tokens
            }
        });

    } catch (error) {
        console.error("User stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load user statistics"
        });
    }
});


// ==========================================
// REGISTER AND LOGIN ROUTES
// ==========================================
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tokens: user.tokens
            }
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                tokens: user.tokens
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
});

// Basic health-check routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Prompt Coding backend is running."
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is missing. Add your MongoDB Atlas connection string in Render Environment settings."
            );
        }

        if (!process.env.JWT_SECRET) {
            throw new Error(
                "JWT_SECRET is missing. Add a strong JWT_SECRET in Render Environment settings."
            );
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully.");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();