// app/dashboard/chat/page.tsx
"use client";
import React, { useState } from 'react';
import { Search, User, MessageSquare, Send, XCircle, Users } from 'lucide-react';
// import { useSocket } from '@/context/socketContext'; // Will be used later

const PRIMARY_COLOR = 'green-600';
const NEUTRAL_COLOR = 'gray-800';

// --- Mock Data ---
const mockContacts = [
    { id: 'f1', name: 'Dr. Smith (Faculty)', role: 'Faculty', lastMessage: 'Check the new assignment.', unread: 2 },
    { id: 's1', name: 'Alice Johnson', role: 'Student', lastMessage: 'Can you join the study group?', unread: 0 },
    { id: 's2', name: 'Group: Project Alpha', role: 'Group', lastMessage: 'Meeting rescheduled to 4 PM.', unread: 5 },
    { id: 's3', name: 'David Lee', role: 'Student', lastMessage: 'Thanks for the notes!', unread: 0 },
];

const mockMessages = [
    { id: 1, text: 'Hello Dr. Smith, I had a question about the assignment.', senderId: 's_user', timestamp: '10:00 AM' },
    { id: 2, text: 'Please review the lecture notes first, Alice.', senderId: 'f1', timestamp: '10:05 AM' },
    { id: 3, text: 'Understood. Thank you!', senderId: 's_user', timestamp: '10:10 AM' },
    { id: 4, text: 'The deadline has been extended to Friday.', senderId: 'f1', timestamp: '10:15 AM' },
];

// --- Sub-Components ---

// 1. Contact Item
interface ContactItemProps {
    contact: typeof mockContacts[0];
    isActive: boolean;
    onClick: () => void;
}
const ContactItem: React.FC<ContactItemProps> = ({ contact, isActive, onClick }) => (
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

// 2. Chat Message
interface ChatMessageProps {
    message: typeof mockMessages[0];
    isSender: boolean;
}
const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender }) => (
    <div className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-sm text-sm 
            ${isSender 
                ? `bg-${PRIMARY_COLOR} text-white rounded-br-none` 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}
        >
            <p>{message.text}</p>
            <span className={`block mt-1 text-xs ${isSender ? 'text-green-200' : 'text-gray-400'} text-right`}>
                {message.timestamp}
            </span>
        </div>
    </div>
);

// --- Main Chat Component ---

export default function ChatPage() {
    const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(mockContacts[0]);
    const [messageInput, setMessageInput] = useState('');
    // const socket = useSocket(); // Ready for integration

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() === '' || !selectedContact) return;

        // Future: Implement Socket.IO emit logic here
        console.log(`Sending message to ${selectedContact.name}: ${messageInput}`);

        setMessageInput('');
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
                            {mockMessages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                    isSender={message.senderId === 's_user'} // Assume 's_user' is the current user
                                />
                            ))}
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
                                    disabled={!selectedContact || messageInput.trim() === ''}
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