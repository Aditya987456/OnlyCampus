"use client";
import React, { useState, FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Role = "student" | "faculty";

const PRIMARY = "green-600";
const PRIMARY_HOVER = "green-700";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      setLoading(false);

      setTimeout(() => {
        router.push("/login"); // redirect to login page
      }, 1500);

    } catch (error) {
      toast.error("Network error, try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-green-50">
      {/* Soft Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,#d1fae5_0%,transparent_50%)] opacity-60"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_70%,#bbf7d0_0%,transparent_50%)] opacity-60"></div>

      <div className="relative flex w-full max-w-7xl items-center justify-between px-6 lg:px-12 xl:px-20 gap-10 xl:gap-24">

        {/* Left Side Branding */}
        <div className="hidden lg:flex w-1/2 flex-col items-center justify-center px-6">
          <div className="h-32 w-32 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-8 border border-green-200 overflow-hidden">
            <Image src="/logo4.png" alt="OnlyCampus Logo" width={256} height={256} className="object-cover scale-150" priority />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 tracking-wide">OnlyCampus</h1>
          <p className="mt-2 text-gray-600 text-lg max-w-xs text-center">Start your journey on the Digital Campus.</p>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full border border-green-300 shadow-md">
              <span className="text-2xl">🏫</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Institute</p>
                <p className="font-bold text-gray-800 text-sm">IERT Prayagraj</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl px-6 lg:px-10 py-10 border border-green-100"
        >

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm">Join the OnlyCampus ecosystem</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-green-100 p-1 rounded-xl border border-green-300 mb-6">
            {["student", "faculty"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r as Role)}
                className={`w-1/2 py-2 text-sm font-medium rounded-xl transition-all duration-200
                  ${role === r ? "bg-green-600 text-white shadow-md" : "text-green-700 hover:bg-green-200"}`}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Full Name */}
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full mt-1 p-3 border rounded-lg text-gray-700" />

          {/* Email */}
          <label className="text-sm font-medium text-gray-700 mt-4 block">Institutional Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 p-3 border rounded-lg text-gray-700" />

          {/* Password */}
          <label className="text-sm font-medium text-gray-700 mt-4 block">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 p-3 border rounded-lg text-gray-700" />

          {/* Confirm Password */}
          <label className="text-sm font-medium text-gray-700 mt-4 block">Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full mt-1 p-3 border rounded-lg text-gray-700" />

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`w-full py-3 text-white font-semibold rounded-lg bg-${PRIMARY} hover:bg-${PRIMARY_HOVER} mt-6 disabled:opacity-70`}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Redirect */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?
            <a onClick={() => router.push("/login")} className={`ml-1 text-${PRIMARY} font-semibold hover:underline cursor-pointer`}>
              Log In
            </a>
          </p>

        </form>
      </div>
    </div>
  );
}
