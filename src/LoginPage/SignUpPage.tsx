import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackGroundLogin from "./BackGroundLogin";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Sign up submitted:", { username, email, password });
      alert(`Account created successfully! Welcome ${username}!`);
      // You can redirect to login or dashboard here
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <section className="w-full h-screen relative">
        <BackGroundLogin />

        <div className="absolute top-4 left-4 z-30">
          <Link to="/">
            <button className="bg-[#61dca3] border-2 border-[#61dca3] text-black font-mono py-2 px-4 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105">
              [ ← HOME ]
            </button>
          </Link>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative bg-black/90 border-2 border-[#61b3dc] rounded-lg p-16 w-full max-w-2xl mx-4 shadow-2xl shadow-[#61b3dc]/20 z-20">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[#61b3dc] hover:text-[#61dca3] cursor-pointer text-xl font-mono transition-colors duration-300"
            >
              ×
            </button>
            <h2 className="text-[#61b3dc] font-mono text-2xl mb-8 text-center">
              REGISTER ACCESS
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#61b3dc] font-mono text-[18px] !mb-2">
                  &gt; USERNAME:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username)
                      setErrors({ ...errors, username: undefined });
                  }}
                  className={`w-full bg-transparent border rounded px-4 !mb-4 !py-2 text-[#61b3dc] font-mono transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#61b3dc] ${
                    errors.username
                      ? "border-red-500"
                      : "border-[#2b4539] focus:border-[#61b3dc]"
                  }`}
                  placeholder="Choose username..."
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 font-mono">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#61b3dc] font-mono text-[18px] !mb-2">
                  &gt; EMAIL:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full bg-transparent border rounded px-4 !mb-4 !py-2  text-[#61b3dc] font-mono transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#61b3dc] ${
                    errors.email
                      ? "border-red-500"
                      : "border-[#2b4539] focus:border-[#61b3dc]"
                  }`}
                  placeholder="Enter email address..."
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-mono">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#61b3dc] font-mono text-[18px] !mb-2">
                  &gt; PASSWORD:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  className={`w-full bg-transparent border rounded px-4 !mb-2 !py-2 text-[#61b3dc] font-mono transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#61b3dc] ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#2b4539] focus:border-[#61b3dc]"
                  }`}
                  placeholder="Create password..."
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-mono">
                    {errors.password}
                  </p>
                )}
                <p className="text-[#61b3dc] text-xs  !mb-3 font-mono">
                  Length: {password.length}
                </p>
              </div>

              <div>
                <label className="block text-[#61b3dc] font-mono text-[18px] !mb-2">
                  &gt; CONFIRM PASSWORD:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className={`w-full bg-transparent border rounded px-4 !mb-2 !py-2 text-[#61b3dc] font-mono transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#61b3dc] ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#2b4539] focus:border-[#61b3dc]"
                  }`}
                  placeholder="Confirm password..."
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-mono">
                    {errors.confirmPassword}
                  </p>
                )}
                <p className="text-[#61b3dc] text-xs !mb-3 font-mono">
                  Length: {confirmPassword.length}
                </p>
              </div>

              <div className="space-y-4 mt-8">
                <button
                  type="submit"
                  className="w-full bg-transparent border-2 border-[#61b3dc] text-[#61b3dc] font-mono py-4 h-10 rounded hover:bg-[#61b3dc] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  [ CREATE ACCOUNT ]
                </button>

                <div className="text-center">
                  <Link to="/login?openModal=true" className="">
                    <button className=" text-[#61dca3] font-mono text-sm hover:text-[#61b3dc] w-full bg-transparent border-2 border-[#61dca3]  font-mono py-4 h-8 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105">
                      Already have an account? [ LOGIN ]
                    </button>
                  </Link>
                </div>
              </div>
            </form>

            {/* Glowing effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#61b3dc]/20 via-[#61dca3]/20 to-[#61b3dc]/20 rounded-lg blur opacity-30 animate-pulse pointer-events-none -z-10"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;
