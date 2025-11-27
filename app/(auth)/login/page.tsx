// app/login/page.tsx
import Image from "next/image";

export default function LoginPage() {
  const thumbnails = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: `Design ${i + 1}`,
    src: `/placeholders/thumb-${(i % 6) + 1}.jpg`,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 items-stretch">
        {/* LEFT: Branding */}
        <aside className="w-full md:w-1/2 lg:w-2/5 bg-gradient-to-br from-indigo-600 via-violet-500 to-pink-500 text-white p-8 flex flex-col justify-center">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422A12 12 0 0112 21a12 12 0 01-6.16-10.422L12 14z" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold">OnlyCampus</h1>
            </div>

            <p className="text-lg font-medium leading-relaxed mb-6">
              Revolutionizing Campus Experience
            </p>

            <p className="text-sm opacity-90 mb-8">
              OnlyCampus is the unified platform for students, faculty and admins — classes, announcements, grading, attendance and campus workflows in one place.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="bg-white/10 rounded-md p-3">Student-centric</li>
              <li className="bg-white/10 rounded-md p-3">Faculty tools</li>
              <li className="bg-white/10 rounded-md p-3">Role-based access</li>
              <li className="bg-white/10 rounded-md p-3">Secure auth</li>
            </ul>
          </div>
        </aside>

        {/* RIGHT: Auth + Inspiration gallery */}
        <main className="w-full md:w-1/2 lg:w-3/5 p-8 flex flex-col items-center">
          <div className="w-full max-w-xl">
            {/* Auth card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 -mt-20 relative z-20">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login to your account</h2>

              {/* Role tabs */}
              <div className="flex items-center gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
                <button className="px-3 py-1 rounded-lg bg-white text-sm font-medium shadow-sm">Student</button>
                <button className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600">Faculty</button>
                <button className="px-3 py-1 rounded-lg text-sm font-medium text-gray-600">Admin</button>
                <div className="ml-auto text-xs text-gray-400">Use college email</div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    placeholder="you@college.edu"
                    className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                    Remember me
                  </label>
                  <a className="text-indigo-600 hover:underline">Forgot password?</a>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition">
                  Sign In
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-500">
                Don’t have an account? <a className="text-indigo-600 hover:underline">Sign up</a>
              </div>
            </div>

            {/* Inspiration gallery */}
            <section className="mt-8">
              <h3 className="text-gray-700 font-semibold mb-4">Design inspiration</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {thumbnails.map((t) => (
                  <div key={t.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="h-28 bg-gray-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-800">{t.title}</div>
                      <div className="text-xs text-gray-500 mt-1">UI/UX · Inspiration</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* subtle footer */}
          <footer className="mt-auto w-full max-w-xl text-center text-xs text-gray-400 py-6">
            © OnlyCampus — Built for students, faculty and admins
          </footer>
        </main>
      </div>
    </div>
  );
}
