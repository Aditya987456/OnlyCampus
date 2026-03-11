// export default function DashboardHome() {
//   return (
//     <div>
//       <h1>Welcome to OnlyCampus</h1>
//       <p>Select a feature from sidebar.</p>
//     </div>
//   );
// }



















import { GraduationCap, MessageSquare, Video, Megaphone } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    href: "#",
    icon: MessageSquare,
    title: "Class Chat",
    desc: "Connect with your batch and faculty in real time.",
    color: "bg-green-50 text-green-600 border-green-100",
  },
  {
    href: "#",
    icon: Megaphone,
    title: "Announcements",
    desc: "Stay updated with the latest notices from faculty.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    href: "/dashboard/videomeeting",
    icon: Video,
    title: "Meeting Room",
    desc: "Join or schedule live video meetings with your group.",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
];

export default function DashboardHome() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8 py-16 text-center">

      {/* Hero Icon */}
      <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-md mb-6">
        <GraduationCap size={30} className="text-white" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome to <span className="text-green-600">OnlyCampus</span>
      </h1>
      <p className="text-gray-500 text-sm max-w-md mb-10">
        Your all-in-one campus portal. Select a channel from the sidebar or explore features below.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {cards.map(({ href, icon: Icon, title, desc, color }) => (
          <Link
            key={title}
            href={href}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border ${color} hover:shadow-md transition-all duration-150 group`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-green-700 transition-colors">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}