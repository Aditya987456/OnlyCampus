// components/ZegoMeetingWrapper.tsx
import React, { useCallback } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Define props for the wrapper
interface ZegoMeetingWrapperProps {
  roomID: string;
  userID: string;
}

// Load Keys Directly (FOR LOCAL TESTING ONLY) 
const APP_ID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID); 
const SERVER_SECRET = process.env.ZEGO_SERVER_SECRET || ""; 

function generateToken(userID: string, roomID: string) {
    if (!SERVER_SECRET) {
        console.error("ZEGO_SERVER_SECRET is missing. Cannot generate token.");
        return "";
    }
    return ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID, 
        SERVER_SECRET, 
        roomID, 
        userID, 
        userID 
    );
}

export default function ZegoMeetingWrapper({ roomID, userID }: ZegoMeetingWrapperProps) {
  
  const myMeeting = useCallback(async (element: HTMLDivElement | null) => {
    if (!element || !roomID || !SERVER_SECRET) return;

    const token = generateToken(userID, roomID);

    const zp = ZegoUIKitPrebuilt.create(token);

    zp.joinRoom({
        container: element,
        scenario: {
           	mode: ZegoUIKitPrebuilt.GroupCall,
           	config: {
                //@ts-ignore
           			role: ZegoUIKitPrebuilt.GroupCall.Host, 
         		},
         	},
        showTextChat: true,
        showUserList: true,
        showScreenSharingButton: true,
        maxUsers: 50,
        onLeaveRoom: () => {
            window.location.href = '/dashboard/student-dashboard'; 
        }
    });
  }, [roomID, userID]);

  return (
    <div className="w-full h-[80vh] border border-green-300 rounded-xl shadow-2xl overflow-hidden" 
    //@ts-ignore     
    ref={myMeeting} 
    />
  );
}