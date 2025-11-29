"use client";
import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Role = "student" | "faculty";

const PRIMARY = "green-600";
const PRIMARY_HOVER = "green-700";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.message || "Login failed");
    setError(data.message || "Login failed");
    setLoading(false);
    return;
  }

  // success toast
  toast.success("Login Successful!");

  // save token
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", role);
  localStorage.setItem("firstname", data.firstname);

  // redirect role-wise
  if (role === "student") router.push("/dashboard/student-dashboard");
  else router.push("/dashboard/faculty-dashboard");

    } catch (err) {
      toast.error("Something went wrong. Try again.");
      setError("Something went wrong. Try again.");
    }


    setLoading(false);
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-green-50">

      {/* Soft Radial Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,#d1fae5_0%,transparent_50%)] opacity-60"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_70%,#bbf7d0_0%,transparent_50%)] opacity-60"></div>

      <div className="relative flex w-full max-w-7xl items-center justify-between px-6 lg:px-12 xl:px-20 gap-10 xl:gap-24">

        {/* Branding */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center px-6">
          <div className="h-32 w-32 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-8 border border-green-200 overflow-hidden">
            <Image
              src="/logo4.png"
              alt="OnlyCampus Logo"
              width={256}
              height={256}
              className="object-cover scale-150"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 tracking-wide">
            OnlyCampus
          </h1>
          <p className="mt-2 text-gray-600 text-lg max-w-xs text-center">
            Your Digital Campus Ecosystem.
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl px-6 lg:px-10 py-10 border border-green-100">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm">Login to your campus portal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Role Toggle */}
          <div className="flex bg-green-100 p-1 rounded-xl border border-green-300 mb-6">
            {["student", "faculty"].map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as Role)}
                  className={`w-1/2 py-2 text-sm font-medium rounded-xl transition-all duration-200
                    ${active 
                      ? "bg-green-600 text-white shadow-md"
                      : "text-green-700 hover:bg-green-200"
                    }`}
                >
                  {r[0].toUpperCase() + r.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Email */}
          <label className="text-sm font-medium text-gray-700">Institutional Email</label>
          <input
            type="email"
            placeholder="student@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full mt-1 p-3 border rounded-lg text-gray-700 focus:ring-${PRIMARY} focus:ring-2`}
            required
          />

          {/* Password */}
          <label className="text-sm font-medium text-gray-700 mt-4 block">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full mt-1 p-3 border rounded-lg text-gray-700 focus:ring-${PRIMARY} focus:ring-2`}
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className={`w-full py-3 text-white font-semibold rounded-lg bg-${PRIMARY} hover:bg-${PRIMARY_HOVER} shadow-md transition mt-6`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Signup redirect */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Don’t have an account?
            <a href="/signup" className={`ml-1 text-${PRIMARY} font-semibold hover:underline`}>
              Sign Up
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
