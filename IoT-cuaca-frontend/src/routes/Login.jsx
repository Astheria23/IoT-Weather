import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginRequest } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await loginRequest({ username, password });
      login(response.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message ?? "Login gagal, coba lagi.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">Weather Login</h1>
        <p className="text-center text-slate-500 mb-6">
          Masuk untuk memantau data sensor secara real-time
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-700">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
              placeholder="Masukkan username"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-50 border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
