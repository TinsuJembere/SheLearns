import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitForm } = form;
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        submitForm,
        {
          withCredentials: true, // 🔑 Required if backend uses credentials
        }
      );

      setMessage("Signup successful! You can now log in.");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
      });

      if (res.data.token && res.data.user) {
        login(res.data.token);
        setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
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

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl border-black border-1 w-full max-w-md"
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
            Create Your Account
          </h2>
          <p className="text-center text-gray-500 mb-4 text-sm">
            Join our community of aspiring tech minds and dedicated mentors.
          </p>

          <div className="flex mb-4 justify-center gap-2">
            <button
              type="button"
              onClick={() => handleRoleChange("student")}
              className={`px-4 py-2 rounded-full font-semibold border ${
                form.role === "student"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("mentor")}
              className={`px-4 py-2 rounded-full font-semibold border ${
                form.role === "mentor"
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Mentor
            </button>
          </div>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full border rounded px-3 py-2 mb-3"
          />
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
            placeholder="Create a strong password"
            required
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="my-4 flex items-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="px-3 text-gray-500">OR</div>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <div className="text-center">
            <a
              href="http://localhost:5000/api/auth/google"
              className="w-full text-black border-1 font-bold py-2 px-4 rounded inline-flex items-center justify-center space-x-2"
            >
              <FcGoogle />
              <span>Sign Up with Google</span>
            </a>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            By signing up, you agree to our{" "}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-500 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
