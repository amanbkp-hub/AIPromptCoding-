import { useState, useEffect } from "react";
import CodeEditor from "./components/CodeEditor";
import Auth from "./Auth";
function App() {

  const [code, setCode] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [loggedInUser, setLoggedInUser] = useState(() => {
  const savedUser = localStorage.getItem("loggedInUser");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [tokens, setTokens] = useState(() => {
  const savedUser = localStorage.getItem("loggedInUser");

  if (savedUser) {
    try {
      return JSON.parse(savedUser).user.tokens ?? 2000;
    } catch {
      return 2000;
    }
  }

  return 2000;
});
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState("");
  
const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
const [difficulty, setDifficulty] = useState("Easy");
const [selectedConcepts, setSelectedConcepts] = useState(["Array", "Loops"]);

  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ==============================
  // PROMPT EDITOR STATES
  // ==============================
  const [userPrompt, setUserPrompt] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [promptEvaluation, setPromptEvaluation] = useState(null);
  
const [sessionId, setSessionId] = useState("");
  
  const [userId, setUserId] = useState(() => {
  const savedUser = localStorage.getItem("loggedInUser");
  if (!savedUser) return "";

  try {
    return JSON.parse(savedUser).user.id;
  } catch {
    return "";
  }
});
  const [userStats, setUserStats] = useState({
  totalChallenges: 0,
  totalSolved: 0,
  averagePromptScore: 0,
  tokens: 0
});
  const [challengeId, setChallengeId] = useState("6ac4f31d0ba680299b12a34a");
  const [challenge, setChallenge] = useState({
    title: "Two Sum",
    description:
      "Given an array of integers and a target value, find two different indices whose values add up to the target.",
    difficulty: "HARD",
    language: "Java",
    inputFormat:
      "The first line contains n. The second line contains n integers. The third line contains the target integer.",
    outputFormat:
      "Print the two indices separated by a space. If no valid pair exists, print -1.",
    constraints: [
      "2 <= n <= 100000",
      "-10^9 <= arr[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],
    examples: [
      {
        input: `4\n2 7 11 15\n9`,
        output: "0 1",
        explanation: "2 + 7 = 9, so indices 0 and 1 are returned.",
      },
    ],
  });
  const evaluation =
    promptEvaluation?.evaluation?.evaluation ||
    promptEvaluation?.evaluation ||
    promptEvaluation;
  const handleCodeChange = (value) => {
    setCode(value);
    setTestResults(null);
    setSubmissionResult(null);
    setOutput("");
  };

const generateNewChallenge = async () => {
  try {
    setIsGeneratingChallenge(true);
    setOutput("");
    setPromptEvaluation(null);
    setTestResults(null);
    setSubmissionResult(null);
    setCode("");
    setUserPrompt("");

    const response = await fetch(
      "http://localhost:5000/api/generate-challenge",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          difficulty,
          concepts: selectedConcepts,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to generate challenge.");
      return;
    }

    const newChallenge = data.challenge;

    setChallenge({
      ...newChallenge,
      examples: newChallenge.examples || [],
      constraints: newChallenge.constraints || [],
    });

    setChallengeId(newChallenge._id);
    const savedUser = localStorage.getItem("loggedInUser");
const currentUserId = savedUser
  ? JSON.parse(savedUser).user.id
  : "";

if (currentUserId) {
  const sessionResponse = await fetch(
    "http://localhost:5000/api/test-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUserId,
        challengeId: newChallenge._id,
      }),
    }
  );

  const sessionData = await sessionResponse.json();

  if (sessionResponse.ok && sessionData.session) {
    setSessionId(sessionData.session._id);
    setUserId(currentUserId);
  } else {
    alert(sessionData.message || "Failed to create a new session.");
    return;
  }
}
    alert("New coding challenge generated successfully!");
  } catch (error) {
    console.error("Challenge generation error:", error);
    alert("Failed to connect to the server.");
  } finally {
    setIsGeneratingChallenge(false);
  }
};

const loadUserStats = async () => {
  if (!userId) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/user-stats/${userId}`
    );

    const data = await response.json();

    if (data.success) {
      setUserStats(data.stats);
    }
  } catch (error) {
    console.error("Failed to load user stats:", error);
  }
};


const restoreLatestChallenge = async (currentUserId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/latest-session/${currentUserId}`
    );

    const data = await response.json();

    if (!response.ok || !data.session) {
      console.log("No previous challenge found.");
      return;
    }

    const savedSession = data.session;
    const savedChallenge = savedSession.challenge;

    setSessionId(savedSession._id);
    setUserId(currentUserId);
    setChallengeId(savedChallenge._id);

    setChallenge({
      ...savedChallenge,
      examples: savedChallenge.examples || [],
      constraints: savedChallenge.constraints || [],
    });

    setCode(savedSession.generatedCode || "");
    setUserPrompt("");
    setPromptEvaluation(null);
    setTestResults(null);
    setSubmissionResult(null);
    setOutput("");
  } catch (error) {
    console.error("Failed to restore latest challenge:", error);
  }
};

  const evaluatePrompt = async () => {
    if (!userPrompt.trim()) {
      alert("Please write a prompt first.");
      return;
    }
    try {
      setIsEvaluating(true);
      setPromptEvaluation(null);
      const response = await fetch("http://localhost:5000/api/test-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          challengeId,
          prompt: userPrompt.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to evaluate prompt");
        return;
      }
      setPromptEvaluation(data);
      if (data.evaluation) {
        setOutput("Prompt evaluated successfully.");
      }
      if (data.tokenUsage) {
        setTokens(data.tokenUsage.userTokensRemaining);
      }
    } catch (error) {
      console.error("Prompt evaluation error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setIsEvaluating(false);
    }
  };
  const generateCodeFromAI = async () => {
    if (!promptEvaluation) {
      alert("Please evaluate your prompt first.");
      return;
    }
    const currentScore = evaluation?.overallScore ?? evaluation?.overall_score ?? 0;
    if (!evaluation || currentScore < 80) {
      alert("Your prompt must score at least 80/100 before code can be generated.");
      return;
    }
    if ((promptEvaluation.status || evaluation?.status) !== "READY") {
      alert("Your prompt is not ready for code generation.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          challengeId,
          prompt: userPrompt.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to generate code");
        return;
      }
      setCode(data.code);
      setTestResults(null);
      setSubmissionResult(null);
      setOutput("");
      if (data.tokenUsage) {
        setTokens(data.tokenUsage.userTokensRemaining);
      }
    } catch (error) {
      console.error("Code generation error:", error);
      alert("Failed to generate code");
    }
  };
  const runCode = async () => {
    if (!code.trim()) {
      alert("Please enter or generate code first.");
      return;
    }
    try {
      setIsRunning(true);
      setOutput("Running code...");
      const response = await fetch("http://localhost:5000/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          code,
          input,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOutput(data.message || "Failed to run code");
        return;
      }
      if (data.stdout) {
        setOutput(data.stdout);
      } else if (data.compileOutput) {
        setOutput("Compilation Error:\n\n" + data.compileOutput);
      } else if (data.stderr) {
        setOutput("Runtime Error:\n\n" + data.stderr);
      } else {
        setOutput(data.status?.description || "Code execution completed.");
      }
    } catch (error) {
      console.error("Run code error:", error);
      setOutput("Failed to connect to the server.");
    } finally {
      setIsRunning(false);
    }
  };
  const runTests = async () => {
    if (!code.trim()) {
      alert("Please enter or generate code first.");
      return;
    }
    try {
      setIsTesting(true);
      setTestResults(null);
      setOutput("Running public tests...");
      const response = await fetch("http://localhost:5000/api/run-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          code,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOutput(data.message || "Failed to run tests");
        return;
      }
      setTestResults(data);
      if (data.status === "PASSED") {
        setOutput(`All public tests passed! ${data.passedTests}/${data.totalTests}`);
      } else {
        setOutput(`Public tests: ${data.passedTests}/${data.totalTests} passed`);
      }
    } catch (error) {
      console.error("Run tests error:", error);
      setOutput("Failed to connect to the server.");
    } finally {
      setIsTesting(false);
    }
  };
  const submitCode = async () => {
    if (!code.trim()) {
      alert("Please enter or generate code first.");
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      setOutput("Submitting code and running hidden tests...");
      const response = await fetch("http://localhost:5000/api/submit-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userId,
          code,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOutput(data.message || "Submission failed");
        return;
      }
      setSubmissionResult(data);
      if (data.status === "PASSED") {
        setOutput(`🎉 Accepted! Hidden tests passed: ${data.passedTests}/${data.totalTests}`);
      } else {
        setOutput(`❌ Wrong Answer. Hidden tests passed: ${data.passedTests}/${data.totalTests}`);
      }
    } catch (error) {
      console.error("Submit code error:", error);
      setOutput("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  
useEffect(() => {
  if (loggedInUser?.user?.id) {
    restoreLatestChallenge(loggedInUser.user.id);
  }
}, [loggedInUser]);

  if (!loggedInUser) {
  return (
    <Auth
     
onLogin={async (data) => {
  setLoggedInUser(data);
  localStorage.setItem("loggedInUser", JSON.stringify(data));
  localStorage.setItem("authToken", data.token);
  setUserId(data.user.id);
  setTokens(data.user.tokens);

  
}}

    />
  );
}
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      
<header className="border-b border-slate-800 px-8 py-5 flex justify-between items-center">
  <h1 className="text-2xl font-bold">
    ⚡ AI Prompt Coding
  </h1>

  <div className="flex items-center gap-3">
    <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
      🪙 {tokens} Tokens
    </div>

    {loggedInUser && (
      <button
        onClick={() => {
          localStorage.removeItem("loggedInUser");
          localStorage.removeItem("authToken");
          setLoggedInUser(null);
          setUserId("");
          setSessionId("");
          setTokens(0);
          setUserStats({
            totalChallenges: 0,
            totalSolved: 0,
            averagePromptScore: 0,
            tokens: 0
          });
        }}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
      >
        Logout
      </button>
    )}
  </div>
</header>

      {/* Main Layout */}
      <div className="flex min-w-0">
        
    
        {/* Dashboard Main Content */}
          <main className="w-full min-w-0 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome */}
            <h2 className="text-4xl font-bold">
              Welcome to AI Prompt Coding 👋
            </h2>
            <p className="text-slate-400 mt-3 text-lg">
              Think clearly. Prompt precisely. Code successfully.
            </p>
            
{/* Progress Dashboard */}


            {/* Start Challenge */}
            <div className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold">Ready for a challenge?</h3>
              
<div className="mt-5">
  <label className="block text-sm font-medium mb-2">
    Choose Difficulty
  </label>

  <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    className="bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3"
    disabled={isGeneratingChallenge}
  >
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
  </select>
</div>


<div className="mt-5">
  <label className="block text-sm font-medium mb-3">
    Choose Concepts
  </label>

  {[
    { category: "Basic", topics: ["Array", "Loops", "String"] },
    {
      category: "Data Structures",
      topics: [
        "HashMap", "Stack", "Queue", "Linked List",
        "Trees", "Heap", "Trie", "Graph"
      ]
    },
    {
      category: "Algorithms",
      topics: [
        "Recursion", "Binary Search", "Sorting", "Greedy",
        "Dynamic Programming", "Backtracking", "Bit Manipulation"
      ]
    }
  ].map((group) => (
    <details
      key={group.category}
      className="mb-3 rounded-lg border border-slate-600 bg-slate-900/70"
    >
      <summary className="cursor-pointer px-4 py-3 font-semibold">
        {group.category}
        <span className="ml-2 text-sm text-slate-400">
          ({group.topics.filter(topic =>
            selectedConcepts.includes(topic)
          ).length} selected)
        </span>
      </summary>

      <div className="flex flex-wrap gap-3 px-4 pb-4">
        {group.topics.map((concept) => (
          <label
            key={concept}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedConcepts.includes(concept)}
              disabled={isGeneratingChallenge}
              onChange={(e) => {
                setSelectedConcepts((previous) =>
                  e.target.checked
                    ? [...previous, concept]
                    : previous.filter((item) => item !== concept)
                );
              }}
            />
            {concept}
          </label>
        ))}
      </div>
    </details>
  ))}
</div>


  
  

<p className="mt-2 text-blue-100">
  Gemini will generate a difficult coding problem. Your prompt
  must be clear enough before AI can generate the solution.
</p>

              
<button
  className="mt-6 bg-white text-black font-semibold px-6 py-3 rounded-lg hover:bg-slate-200 disabled:opacity-50"
  onClick={generateNewChallenge}
  disabled={isGeneratingChallenge}
>
  {isGeneratingChallenge
    ? "⏳ Generating Challenge..."
    : "🚀 Start Challenge"}
</button>

            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400">Difficulty</p>
                <h3 className="text-2xl font-bold mt-2">🔴 Hard</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400">Language</p>
                <h3 className="text-2xl font-bold mt-2">☕ Java</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <p className="text-slate-400">Session Budget</p>
                <h3 className="text-2xl font-bold mt-2">🪙 2000</h3>
              </div>
            </div>
            {/* Challenge Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-3xl font-bold">
                    🧩 {challenge.title}
                  </h2>
                  <p className="text-slate-400 mt-3">
                    {challenge.description}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="bg-red-900/40 text-red-400 px-3 py-1 rounded-lg text-sm font-semibold">
                    🔴 {challenge.difficulty}
                  </span>
                  <span className="bg-blue-900/40 text-blue-400 px-3 py-1 rounded-lg text-sm font-semibold">
                    ☕ {challenge.language}
                  </span>
                </div>
              </div>
              {/* Input Format */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3">📥 Input Format</h3>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 whitespace-pre-wrap">
                  {challenge.inputFormat}
                </pre>
              </div>
              {/* Output Format */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">📤 Output Format</h3>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 whitespace-pre-wrap">
                  {challenge.outputFormat}
                </pre>
              </div>
              {/* Constraints */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">⚙️ Constraints</h3>
                <ul className="space-y-2">
                  {challenge.constraints.map((constraint, index) => (
                    <li
                      key={index}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-300"
                    >
                      • {constraint}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Examples */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">💡 Example</h3>
                {challenge.examples.map((example, index) => (
                  <div
                    key={index}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-5"
                  >
                    <p className="text-slate-400 text-sm mb-2">Input</p>
                    <pre className="text-blue-300 whitespace-pre-wrap font-mono mb-5">
                      {example.input}
                    </pre>
                    <p className="text-slate-400 text-sm mb-2">Output</p>
                    <pre className="text-green-400 whitespace-pre-wrap font-mono mb-5">
                      {example.output}
                    </pre>
                    <p className="text-slate-400 text-sm mb-2">Explanation</p>
                    <p className="text-slate-300">{example.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Prompt Editor */}
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">🧠 Your Prompt</h2>
                  <p className="text-slate-400 mt-2">
                    Explain clearly how you want the AI to solve this problem.
                  </p>
                </div>
                <div className="bg-purple-900/30 border border-purple-700 px-4 py-2 rounded-lg">
                  ✨ AI Prompt Evaluation
                </div>
              </div>
              <div className="mt-6">
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Example: Use a HashMap to find two different indices whose values add up to the target..."
                  className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-5 text-white font-mono resize-none focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-slate-500 text-sm">
                  💡 Include the approach, constraints, edge cases, output
                  requirements, and implementation details.
                </p>
                <p className="text-slate-500 text-sm">
                  {userPrompt.length} characters
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={evaluatePrompt}
                  disabled={!userPrompt.trim() || isEvaluating}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold"
                >
                  {isEvaluating ? "⏳ Evaluating..." : "🔍 Evaluate Prompt"}
                </button>
              </div>
            </div>
            {/* Prompt Evaluation Result */}
            {promptEvaluation && (
              <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">
                      🧠 AI Prompt Evaluation
                    </h3>
                    <p className="text-slate-400 mt-1">
                      AI analysis of your prompt
                    </p>
                  </div>
                  <div
                    className={
                      promptEvaluation.status === "READY"
                        ? "bg-green-900/30 border border-green-700 text-green-400 px-4 py-2 rounded-lg font-semibold"
                        : "bg-red-900/30 border border-red-700 text-red-400 px-4 py-2 rounded-lg font-semibold"
                    }
                  >
                    {promptEvaluation.status === "READY"
                      ? "✅ READY"
                      : "❌ NOT READY"}
                  </div>
                </div>
                {/* Overall Score */}
                {evaluation && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 font-medium">
                        Overall Prompt Score
                      </span>
                      <span className="text-2xl font-bold text-purple-400">
                        {evaluation?.overallScore ?? evaluation?.overall_score ?? 0}/100
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={
                          (evaluation?.overallScore ?? evaluation?.overall_score ?? 0) >= 80
                            ? "h-full bg-green-500"
                            : "h-full bg-red-500"
                        }
                        style={{
                          width: `${evaluation?.overallScore ?? evaluation?.overall_score ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* Individual Scores */}
                {evaluation && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Objective</p>
                      <p className="text-xl font-bold mt-1">
                        {evaluation?.objective ?? 0}/20
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Approach</p>
                      <p className="text-xl font-bold mt-1">
                        {evaluation?.approach ?? 0}/25
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Constraints</p>
                      <p className="text-xl font-bold mt-1">
                        {evaluation?.constraints ?? 0}/15
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Edge Cases</p>
                      <p className="text-xl font-bold mt-1">
                        {evaluation?.edgeCases ?? 0}/15
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Output Requirements</p>
                      <p className="text-xl font-bold mt-1">
                        {evaluation?.outputRequirements ?? 0}/10
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Implementation</p>
                      <p className="text-xl font-bold mt-1">
                        {evaluation?.implementation ?? 0}/15
                      </p>
                    </div>
                  </div>
                )}
                {/* AI Feedback */}
                {(promptEvaluation.aiFeedback || evaluation?.feedback || evaluation?.aiFeedback) && (
                  <div className="mt-6 bg-slate-950 border border-slate-800 rounded-lg p-5">
                    <h4 className="font-semibold text-lg">💬 AI Feedback</h4>
                    <p className="text-slate-300 mt-2 leading-relaxed">
                      {promptEvaluation.aiFeedback || evaluation?.feedback || evaluation?.aiFeedback}
                    </p>
                  </div>
                )}
                {/* Missing Information */}
                {(promptEvaluation.missingInformation || evaluation?.missingInformation)?.length > 0 && (
                  <div className="mt-6 bg-red-950/20 border border-red-900 rounded-lg p-5">
                    <h4 className="font-semibold text-red-400 text-lg">
                      ⚠️ Missing Information
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {(promptEvaluation.missingInformation || evaluation?.missingInformation).map(
                        (item, index) => (
                          <li key={index} className="text-slate-300">
                            • {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {/* Code Editor Area */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">💻 Code Editor</h3>
                <div className="flex gap-3">
                  <button
                    onClick={generateCodeFromAI}
                    disabled={
                      !promptEvaluation ||
                      !evaluation ||
                      (evaluation?.overallScore ?? evaluation?.overall_score ?? 0) < 80 ||
                      (promptEvaluation.status || evaluation?.status) !== "READY"
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold"
                  >
                    🤖 Generate Code
                  </button>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-5 py-3 rounded-lg font-semibold"
                  >
                    {isRunning ? "⏳ Running..." : "▶️ Run Code"}
                  </button>
                  <button
                    onClick={runTests}
                    disabled={isTesting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-5 py-3 rounded-lg font-semibold"
                  >
                    {isTesting ? "⏳ Testing..." : "🧪 Run Tests"}
                  </button>
                  <button
                    onClick={submitCode}
                    disabled={
                      isSubmitting ||
                      !testResults ||
                      testResults.status !== "PASSED"
                    }
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-5 py-3 rounded-lg font-semibold"
                  >
                    {isSubmitting ? "⏳ Submitting..." : "🚀 Submit"}
                  </button>
                </div>
              </div>
              <CodeEditor code={code} setCode={handleCodeChange} />
              {/* Custom Input */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">📥 Custom Input</h3>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input for your program..."
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              {/* Output */}
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">🖥️ Output</h3>
                <div className="bg-black border border-slate-800 rounded-lg p-5 min-h-[150px]">
                  <pre className="text-green-400 whitespace-pre-wrap">
                    {output || "Program output will appear here..."}
                  </pre>
                </div>
              </div>
              {/* Test Results */}
              {testResults && (
                <div className="mt-6 bg-slate-900 border border-slate-800 rounded-lg p-5">
                  <h3 className="text-xl font-bold mb-4">
                    🧪 Public Test Results
                  </h3>
                  <div className="mb-5 text-lg font-semibold">
                    {testResults.passedTests} / {testResults.totalTests} Tests Passed
                  </div>
                  <div className="space-y-4">
                    {testResults.testResults?.map((test) => (
                      <div
                        key={test.testNumber}
                        className="bg-slate-800 rounded-lg p-5 border border-slate-700"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-bold">
                            Test {test.testNumber}
                          </h4>
                          <span
                            className={
                              test.passed
                                ? "text-green-400 font-semibold"
                                : "text-red-400 font-semibold"
                            }
                          >
                            {test.passed ? "✓ Passed" : "✗ Failed"}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-slate-400 text-sm mb-2">Input</p>
                          <pre className="bg-slate-950 rounded-lg p-3 text-blue-300 whitespace-pre-wrap font-mono text-sm">
                            {test.input}
                          </pre>
                        </div>
                        <div className="mb-4">
                          <p className="text-slate-400 text-sm mb-2">Your Output</p>
                          <pre className="bg-slate-950 rounded-lg p-3 text-green-400 whitespace-pre-wrap font-mono text-sm">
                            {test.actualOutput || "No output"}
                          </pre>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-2">Expected Output</p>
                          <pre className="bg-slate-950 rounded-lg p-3 text-yellow-400 whitespace-pre-wrap font-mono text-sm">
                            {test.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Submission Result */}
              {submissionResult && (
                <div className="mt-6 bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-5">
                    🚀 Submission Result
                  </h3>
                  <div
                    className={
                      submissionResult.status === "PASSED"
                        ? "p-4 bg-green-950 border border-green-700 rounded-lg text-green-300 font-semibold"
                        : "p-4 bg-red-950 border border-red-700 rounded-lg text-red-300 font-semibold"
                    }
                  >
                    {submissionResult.status === "PASSED"
                      ? `🎉 Accepted! Hidden tests passed: ${submissionResult.passedTests}/${submissionResult.totalTests}`
                      : `❌ Failed! Hidden tests passed: ${submissionResult.passedTests}/${submissionResult.totalTests}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default App;
                  