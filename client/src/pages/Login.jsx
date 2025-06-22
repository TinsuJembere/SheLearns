import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", form);
      login(res.data.token);
      setMessage("Login successful!");
      setForm({ email: "", password: "" });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-700 via-yellow-400 to-purple-300 items-center justify-center">
        <div className="px-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Empowering the Next Generation of Tech Leaders
          </h1>
          <p className="text-lg text-white/90 font-medium">
            Join SheLearns to connect, learn, and grow your tech skills with
            supportive mentors and a vibrant community.
          </p>
        </div>
      </div>
      {/* Right Side (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <div className="flex items-center justify-center mb-4">
            <span className="bg-yellow-400 rounded-full p-2 mr-2">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3.5 6.32V18a1 1 0 0 1-2 0v-2.68C6.5 13.5 5 11.5 5 9a7 7 0 0 1 7-7Z"
                />
              </svg>
            </span>
            <span className="font-bold text-xl text-gray-800">SheLearns</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">
            Log In to Your Account
          </h2>
          <p className="text-center text-gray-500 mb-4 text-sm">
            Welcome back! Please enter your details to continue.
          </p>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full border rounded px-3 py-2 mb-4"
          />
          {message && (
            <div className="mb-2 text-green-600 text-center text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-2 text-red-600 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white font-bold py-2 px-4 rounded hover:bg-yellow-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="my-4 flex items-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="px-3 text-gray-500">OR</div>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
          <div className="text-center">
            <a
              href="https://shelearns.onrender.com/api/auth/google"
              className="w-full text-black border-1 font-bold py-2 px-4 rounded inline-flex items-center justify-center space-x-2"
            >
              <FcGoogle />
              <span>Login with Google</span>
            </a>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            By logging in, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
          <p className="text-sm text-center mt-2">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
