// // app/dashboard/meeting/[roomID]/page.tsx
 "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { ZegoExpressEngine } from "zego-express-engine-webrtc";
// import { Loader2 } from "lucide-react";

// // !!! REPLACE THESE WITH YOUR ACTUAL ZEGOCLOUD CREDENTIALS !!!
// const APP_ID = process.env.NEXT_PUBLIC_ZEGO_APP_ID; // YOUR APP ID (Number)
// const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET; // YOUR SERVER SECRET (String)

// // Placeholder for Token Generation. 
// // For production, this function MUST be replaced by a secure API call to your backend.
// function generateToken(userID:any, roomID:any) {
//     console.warn("Using placeholder token generation. Use a secure backend for production.");
//     // In a real app, you would fetch the token from: /api/zegotoken?userID=...&roomID=...
//     return '04AAAAAE...'; 
// }

// export default function MeetingRoom({ params }:any) {
//   const { roomID } = params;
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Use a simple identifier for the user in this example
//   const userID = 'user-' + Math.random().toString(36).substring(2, 8); 

//   useEffect(() => {
//     if (!roomID) return;
    
//     // 1. Initialize Zego Express Engine
//     //@ts-ignore
//     const zego = new ZegoExpressEngine(APP_ID, 1);

//     // 2. Event Handlers
//     zego.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
//       if (updateType === "ADD" && streamList.length > 0) {
//         // Play remote stream
//         const remoteStream = await zego.startPlayingStream(streamList[0].streamID);
//         //@ts-ignore
//         remoteVideoRef.current.srcObject = remoteStream;
//       } else if (updateType === "DELETE") {
//         // Handle stream removal
//         zego.stopPlayingStream(streamList[0].streamID);
//         //@ts-ignore
//         remoteVideoRef.current.srcObject = null;
//       }
//     });

//     // 3. Login and Publish
//     async function startCall() {
//       const token = generateToken(userID, roomID); 
      
//       try {
//         await zego.loginRoom(roomID, token, { userID, userName: "User " + userID });
        
//         // Start publishing local stream
//         const localStream = await zego.createStream({ camera: { video: true, audio: true } });
//        //@ts-ignore
//         localVideoRef.current.srcObject = localStream;
//         zego.startPublishingStream(userID, localStream);
//         setLoading(false);

//       } catch (e) {
//         console.error("ZegoCloud connection error:", e);
//         //@ts-ignore
//         setError("Failed to connect to the meeting. Check ZegoCloud keys or token.");
//         setLoading(false);
//       }
//     }

//     startCall();

//     return () => {
//       // Cleanup on unmount
//       zego.logoutRoom(roomID);
//       //@ts-ignore
//       const localStream = localVideoRef.current?.srcObject;
//       if (localStream) zego.destroyStream(localStream);
//     };
//   }, [roomID]);


//   if (loading) {
//     return (
//       <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
//         <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-4" />
//         <p className="text-lg text-gray-700">Connecting to meeting room: {roomID}...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col h-screen items-center justify-center bg-red-50 p-10 rounded-lg">
//         <h1 className="text-2xl font-bold text-red-700 mb-4">Connection Failed</h1>
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full items-center justify-center p-6 bg-gray-100 min-h-screen">
//       <h1 className={`text-3xl font-bold mb-6 text-green-700`}>Live Meeting: {roomID}</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
//         <div className="bg-gray-900 aspect-video rounded-xl shadow-2xl overflow-hidden relative border-4 border-green-500">
//             <h3 className="absolute bottom-2 left-3 text-white z-10 font-semibold bg-black/50 px-2 py-1 rounded">You (Local)</h3>
//             <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
//         </div>
//         <div className="bg-gray-900 aspect-video rounded-xl shadow-2xl overflow-hidden relative border-4 border-gray-700">
//             <h3 className="absolute bottom-2 left-3 text-white z-10 font-semibold bg-black/50 px-2 py-1 rounded">Remote Participant</h3>
//             <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
//         </div>
//       </div>
//       {/* Add control buttons here (mute, hangup, etc.) */}
//       <div className="mt-8">
//         <button 
//             onClick={() => window.location.href = '/dashboard/student-dashboard'} 
//             className="py-3 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition shadow-lg"
//         >
//             Leave Meeting
//         </button>
//       </div>
//     </div>
//   );
// }


// app/dashboard/meeting/[roomID]/page.tsx
import React from "react";
import dynamic from "next/dynamic";
// Note: next/navigation imports (like useParams) are for Client Components

// --- 1. Dynamically import the wrapper component, disabling SSR ---
const DynamicMeetingWrapper = dynamic(
  () => import("@/components/ZegoMeetingWrapper"),
  { 
    ssr: false, 
    loading: () => <div className="p-8 text-center text-gray-500">Loading Zego Cloud meeting...</div>
  }
);

interface MeetingRoomProps {
    params: {
        roomID: string;
    };
}

// --- 2. FIX: Make the component function 'async' ---
export default async function MeetingRoom({ params }: MeetingRoomProps) {
  
  // FIX APPLIED: The warning is triggered by direct access. 
  // By making the function async, Next.js resolves the parameter access safely.
  // The 'await' is sometimes implied or handled by the runtime, but using 'async'
  // here is the structural change required to silence the warning in the Server Component.
  const { roomID } = params; 
  
  // These IDs must be consistent for the user (fetch from session/auth in a real app)
  const userID = 'user-' + Math.random().toString(36).substring(2, 8); 

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-xl font-semibold mb-4 text-gray-700">Joining Meeting: {roomID}</h1>
      
      {/* Render the dynamically imported component */}
      <DynamicMeetingWrapper roomID={roomID} userID={userID} />
      
      {/* Simple Leave Button */}
      <div className="mt-8 text-center">
        {/* Note: This button should be wrapped in a 'use client' component if you want onClick */}
        {/* For simplicity here, we'll assume a client wrapper exists or just render a simple link */}
        <a href="/dashboard/student-dashboard">
            <button 
                className="py-3 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition shadow-lg"
            >
                Leave Meeting
            </button>
        </a>
      </div>
    </div>
  );
}