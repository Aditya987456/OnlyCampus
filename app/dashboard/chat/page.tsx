// app/dashboard/chat/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Send, XCircle, Users } from 'lucide-react';
import { useSocket } from '@/context/socketContext'; 
import { toast } from 'sonner';

// Assuming IMeeting is also imported here if used in contact list logic
// import { IChatMessage } from '@/lib/models/chatMessage'; 

const PRIMARY_COLOR = 'green-600';
const NEUTRAL_COLOR = 'gray-800';

// --- Mock Data and Types ---
// Define a client-side type for a message (based on the model)
interface ClientChatMessage {
    _id: string;
    senderId: string;
    recipientId: string;
    content: string;
    createdAt: string | Date;
}

const mockContacts = [
    { id: 'f1', name: 'Dr. Smith (Faculty)', role: 'Faculty', lastMessage: 'Check the new assignment.', unread: 2, chatId: 'userA_f1' },
    { id: 's1', name: 'Alice Johnson', role: 'Student', lastMessage: 'Can you join the study group?', unread: 0, chatId: 'userA_s1' },
    { id: 's2', name: 'Group: Project Alpha', role: 'Group', lastMessage: 'Meeting rescheduled to 4 PM.', unread: 5, chatId: 'group_alpha' },
];

// --- Sub-Components (Unchanged) ---
const ContactItem = ({ contact, isActive, onClick }: any) => (
    <div
        className={`flex items-center gap-3 p-4 cursor-pointer transition duration-150 border-b border-gray-100
            ${isActive ? `bg-${PRIMARY_COLOR}/10 border-l-4 border-${PRIMARY_COLOR}` : 'hover:bg-gray-50'}`}
        onClick={onClick}
    >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md`}
             style={{ backgroundColor: contact.role === 'Faculty' ? '#3b82f6' : contact.role === 'Group' ? '#ef4444' : '#10b981' }}>
            {contact.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
            <p className={`font-semibold truncate ${isActive ? `text-${PRIMARY_COLOR}` : `text-${NEUTRAL_COLOR}`}`}>{contact.name}</p>
            <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
        </div>
        {contact.unread > 0 && (
            <span className={`px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full`}>
                {contact.unread}
            </span>
        )}
    </div>
);

const ChatMessage: React.FC<{ message: ClientChatMessage, isSender: boolean }> = ({ message, isSender }) => {
    const formatTime = (date: string | Date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-sm text-sm 
                ${isSender 
                    ? `bg-${PRIMARY_COLOR} text-white rounded-br-none` 
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}
            >
                <p>{message.content}</p>
                <span className={`block mt-1 text-xs ${isSender ? 'text-green-200' : 'text-gray-400'} text-right`}>
                    {formatTime(message.createdAt)}
                </span>
            </div>
        </div>
    );
};

// --- Main Chat Component ---

export default function ChatPage() {
    // Current user is mocked as 'userA' for sending/receiving logic
    const CURRENT_USER_ID = 'userA'; 

    const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(mockContacts[0]);
    const [messages, setMessages] = useState<ClientChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const socket = useSocket();

    // --- 1. Fetch Messages on Contact Change ---
    useEffect(() => {
        if (!selectedContact) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/chat?chatId=${selectedContact.chatId}`);
                if (res.ok) {
                    const data: ClientChatMessage[] = await res.json();
                    setMessages(data);
                } else {
                    toast.error("Failed to load chat history.");
                }
            } catch (error) {
                toast.error("An error occurred while loading messages.");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedContact]);


    // --- 2. Real-time Socket Listener ---
    useEffect(() => {
        if (!socket) return;

        const messageHandler = (newMessage: ClientChatMessage) => {
            // Check if the received message belongs to the currently selected chat
            if (newMessage.recipientId === selectedContact?.chatId) {
                setMessages((prev) => [...prev, newMessage]);
            } else {
                // Future: Handle unread badge updates for other contacts
                console.log('Received message for another chat:', newMessage.recipientId);
            }
        };

        socket.on("chat-message-received", messageHandler); 

        return () => {
            socket.off("chat-message-received", messageHandler);
        };
    }, [socket, selectedContact]);


    // --- 3. Send Message Function ---
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = messageInput.trim();
        if (!content || !selectedContact) return;

        setMessageInput('');

        try {
            const newMessageData = {
                senderId: CURRENT_USER_ID,
                recipientId: selectedContact.chatId,
                content: content,
            };

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessageData),
            });

            if (!res.ok) {
                toast.error("Failed to send message.");
                // If the post fails, the user will need to re-type or recover the message
            }
            // Note: We don't update local state here; we wait for the socket echo (chat-message-received)
            // to ensure the message was persisted before displaying it.

        } catch (err) {
            toast.error("An unexpected error occurred while sending.");
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            
            {/* Left Panel: Contacts List */}
            <div className="w-80 border-r border-gray-100 flex flex-col">
                <div className={`p-4 border-b border-gray-100 bg-gray-50`}>
                    <h2 className={`text-xl font-bold text-${NEUTRAL_COLOR} flex items-center gap-2`}>
                        <Users className='w-6 h-6 text-green-500'/> Contacts
                    </h2>
                </div>
                <div className="p-3">
                    <div className="relative">
                        <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full py-2 pl-9 pr-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-green-400"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {mockContacts.map((contact) => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            isActive={selectedContact?.id === contact.id}
                            onClick={() => setSelectedContact(contact)}
                        />
                    ))}
                </div>
            </div>

            {/* Right Panel: Chat Window */}
            <div className="flex-1 flex flex-col">
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className={`p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50`}>
                            <div className='flex items-center gap-3'>
                                <MessageSquare className='w-6 h-6 text-gray-500'/>
                                <h3 className={`text-lg font-bold text-${NEUTRAL_COLOR}`}>{selectedContact.name}</h3>
                            </div>
                            <button onClick={() => setSelectedContact(null)} className='text-gray-400 hover:text-red-500 transition'>
                                <XCircle className='w-5 h-5'/>
                            </button>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500">Loading messages...</div>
                            ) : (
                                messages.map((message) => (
                                    <ChatMessage
                                        key={message._id}
                                        message={message}
                                        isSender={message.senderId === CURRENT_USER_ID}
                                    />
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                    disabled={!selectedContact}
                                />
                                <button
                                    type="submit"
                                    className={`bg-${PRIMARY_COLOR} text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50`}
                                    disabled={!selectedContact || messageInput.trim() === '' || !socket}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                        <MessageSquare className="w-12 h-12 mb-3"/>
                        <p className="text-lg font-medium">Select a contact to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}