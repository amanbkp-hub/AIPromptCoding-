
import React, { useState } from "react";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const response = await fetch(
        `https://ai-prompt-coding-api.onrender.com/api/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(isRegister ? { name } : {}),
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Authentication failed.");
        return;
      }

      if (isRegister) {
        setIsRegister(false);
        setPassword("");
        setError("Registration successful. Please log in.");
        return;
      }

      onLogin(data);
    } catch {
      setError("Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold mb-2">
          ⚡ AI Prompt Coding
        </h1>

        <p className="text-slate-400 mb-6">
          {isRegister ? "Create your account" : "Welcome back"}
        </p>

        {isRegister && (
          <input
            className="w-full mb-4 p-3 rounded-lg bg-slate-950 border border-slate-700"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          className="w-full mb-4 p-3 rounded-lg bg-slate-950 border border-slate-700"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded-lg bg-slate-950 border border-slate-700"
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {error && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-3 rounded-lg font-semibold"
        >
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create Account"
              : "Log In"}
        </button>

        <p className="text-center text-slate-400 mt-5">
          {isRegister
            ? "Already have an account?"
            : "New to AI Prompt Coding?"}{" "}
          <button
            type="button"
            className="text-blue-400 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Log in" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;
