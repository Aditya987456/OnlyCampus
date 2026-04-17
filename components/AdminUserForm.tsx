"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RosterRole = "student" | "faculty";

type StoredUser = {
  role?: string;
  name?: string;
};

const initialForm = {
  name: "",
  email: "",
  role: "student" as RosterRole,
  department: "",
  year: "",
  isAllowed: true,
};

export default function AdminUserForm() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      router.replace("/login");
      return;
    }

    const parsed = JSON.parse(storedUser) as StoredUser;
    setCurrentUser(parsed);

    if (parsed.role !== "admin") {
      toast.error("Only admin can access that page.");
      router.replace("/dashboard");
    }
  }, [router]);

  const handleChange = (
    key: keyof typeof initialForm,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "role" && value === "faculty" ? { year: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again.");
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add user");
        return;
      }

      toast.success(data.message || "User added successfully");
      setForm(initialForm);
    } catch {
      toast.error("Something went wrong while creating the user.");
    } finally {
      setSubmitting(false);
    }
  };

  if (currentUser?.role !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-600">
          OnlyCampus Admin
        </p>
        <h1 className="text-2xl font-bold text-gray-800">Add New College User</h1>
        {/* <p className="mt-1 text-sm text-gray-500">
          Add a student or faculty record first. They will register later with the
          same college email to set their password.
        </p> */}
      </div>

      <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">College Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="name@iert.ac.in"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Role</span>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value as RosterRole)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Department</span>
              <input
                type="text"
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder="IT"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Year {form.role === "faculty" ? "(optional)" : ""}
              </span>
              <input
                type="text"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                placeholder={form.role === "student" ? "4" : "Leave blank"}
                required={form.role === "student"}
                disabled={form.role === "faculty"}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <input
              type="checkbox"
              checked={form.isAllowed}
              onChange={(e) => handleChange("isAllowed", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
            />
            <span className="text-sm text-gray-700">
              Allow this user to register and login
            </span>
          </label>


          {/* <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
            Admin only adds the roster entry. The user&apos;s password stays empty until
            they register for the first time.
          </div> */}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Adding user..." : "Add user"}
          </button>
        </form>
      </div>
    </div>
  );
}
