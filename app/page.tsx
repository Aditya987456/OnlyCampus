'use client';

import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {isLoggedIn && (
        <aside className="w-64 bg-white border-r p-6 space-y-6">
          <nav className="space-y-4">
            <Link
              href="/chat"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <span>💬</span>
              <span>Chat</span>
            </Link>

            <Link
              href="/video"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <span>🎥</span>
              <span>Video Classes</span>
            </Link>

            <Link
              href="/assistant"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
            >
              <span>🤖</span>
              <span>AI Assistant</span>
            </Link>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-10">
        {!isLoggedIn ? (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to OnlyCampus</h2>
            <p className="text-gray-600">
              Your digital campus hub for groups, chat, classes, and more.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Important Announcements</h2>
            <div className="space-y-6">
              <div className="p-4 rounded-xl border bg-white shadow">
                <h3 className="font-semibold">Campus-wide announcement</h3>
                <p className="text-gray-600">
                  The semester exams will begin on 15th May.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl border bg-white shadow">
                  <h3 className="font-semibold mb-2">Course Groups</h3>
                  <p className="text-gray-600">
                    Access and participate in your course groups
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-white shadow">
                  <h3 className="font-semibold mb-2">Clubs</h3>
                  <p className="text-gray-600">
                    Join or create a club to meet like-minded people
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-white shadow">
                  <h3 className="font-semibold mb-2">Updates</h3>
                  <p className="text-gray-600">
                    Get updates about campus activities
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
