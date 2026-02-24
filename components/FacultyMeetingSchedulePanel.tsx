import React, { useEffect, useState } from 'react';
import { Clock, Users, Video, AlertTriangle, CalendarCheck } from 'lucide-react';

// Define the type structure used for mocking
interface IMeeting {
    _id: number;
    title: string;
    host: string;
    time: Date;
    link: string;
}

// Mock Data to replace the failing API call
const MOCK_MEETINGS: IMeeting[] = [
    {
        _id: 1,
        title: "Compiler Design: Phase 3 Review",
        host: "Dr. A. Sharma",
        time: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        link: "#meeting-1",
    },
    {
        _id: 2,
        title: "Departmental Research Sync-up",
        host: "Dean J. Singh",
        time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        link: "#meeting-2",
    },
    {
        _id: 3,
        title: "AI Club - Weekly Workshop",
        host: "Student Lead",
        time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        link: "#meeting-3",
    },
];

const PRIMARY_COLOR = "blue"; // Using 'blue' for Tailwind classes

// The component function, adapted to be runnable
function FacultyMeetingSchedulePanel() {
    const [meetings, setMeetings] = useState<IMeeting[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulate API fetch with mock data
    useEffect(() => {
        const loadMeetings = () => {
            // Simulate network delay
            setTimeout(() => {
                // In a real app, you would filter or sort this data
                setMeetings(MOCK_MEETINGS);
                setLoading(false);
            }, 500);
        };
        loadMeetings();
    }, []);

    const formatTime = (date: Date) => {
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            day: 'numeric', 
            month: 'short' 
        });
    }
    
    // Function to calculate time remaining until the meeting
    const getTimeRemaining = (date: Date) => {
        const diff = date.getTime() - Date.now();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(minutes / 60);

        if (minutes < 0) return 'Ended';
        if (minutes < 60) return `${minutes}m remaining`;
        if (hours < 24) return `${hours}h remaining`;
        return `${Math.ceil(hours / 24)} days away`;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-5">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-500">Loading schedule...</span>
            </div>
        );
    }

    if (meetings.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl m-4">
                <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-3"/>
                <p className="text-gray-600 font-medium">No upcoming classes or meetings scheduled.</p>
                <p className="text-sm text-gray-400 mt-1">Time to schedule one!</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100 max-w-lg mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-blue-600"/> Upcoming Sessions
            </h3>
            <div className="space-y-4">
                {meetings.map((m) => (
                    <a 
                        key={m._id.toString()} 
                        href={m.link} // Replaced Next.js Link with standard <a>
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition duration-300 ease-in-out cursor-pointer group"
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg text-blue-800 group-hover:text-blue-900 flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-600"/> {m.title}
                            </h4>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 whitespace-nowrap`}>
                                {getTimeRemaining(m.time)}
                            </span>
                        </div>
                        <div className="flex justify-start text-sm mt-2 text-gray-600 space-x-4">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-500"/> {formatTime(m.time)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-500"/> {m.host}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
            <p className="text-sm text-center text-gray-500 mt-5 pt-3 border-t border-gray-100">
                <a 
                    href="/dashboard/meetings" 
                    className={`text-${PRIMARY_COLOR}-600 hover:text-${PRIMARY_COLOR}-700 font-medium transition`}
                >
                    View all and manage meetings
                </a>
            </p>
        </div>
    );
}

// Main App component required for single-file React Immersive
export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
            <FacultyMeetingSchedulePanel />
        </div>
    );
}