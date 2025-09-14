import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSend, IoAttach } from 'react-icons/io5'; // Icons for sending and attaching files
import axios from 'axios';

const MyChat = () => {
    const { courseId } = useParams(); // Extract courseId from the URL
    const [user, setUser] = useState({
        _id: '',
        fullName: '',
        email: '',
        role: '',
        profilePhoto: '',
        bio: '',
        skills: [],
      });
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Get token from localStorage
                if (!token) {
                    navigate('/login'); // Redirect to login if token is missing
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/v1/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the Authorization header
                    },
                });

                setUser(response.data.user); // Set user data from API response
                console.log(response);
                
            } catch (error) {
                console.error('Error fetching user data', error);
                setError('Error fetching user data');
            }
        };

        

        fetchUserData();
        
    }, [navigate]);

    // Fetch chat messages
    useEffect(() => {
        const fetchChatMessages = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:5000/api/v1/chat/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setMessages(data.messages || []);

                    markMessagesAsRead(data.messages);
                } else {
                    setError(data.message || 'Error fetching chat messages');
                }
            } catch (err) {
                setError('Something went wrong while fetching chat messages');
            } finally {
                setLoading(false);
            }
        };

        fetchChatMessages();
    }, [courseId]);

    const markMessagesAsRead = async (messages) => {
        
        const unreadMessages = messages.filter(
            (message) => !message.readBy.includes(user._id)
        );
    
        if (unreadMessages.length > 0) {
            const token = localStorage.getItem('authToken');
            try {
                
                await axios.patch(
                    `http://localhost:5000/api/v1/chat/${courseId}/mark-read`, 
                    {
                        messageIds: unreadMessages.map((msg) => msg._id), 
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                    }
                );
            } catch (err) {
                console.error('Error marking messages as read', err);
            }
        }
    };
    

    const handleMessageSend = async () => {
        if (newMessage.trim() === '') return;

        const token = localStorage.getItem('authToken');
        const messageData = {
            courseId,
            message: newMessage,
            timestamp: new Date().toISOString(),
            file: selectedFile,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/v1/chat/${courseId}/send-message`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages((prevMessages) => [...prevMessages, data.message]);
                setNewMessage('');
                setSelectedFile(null); // Clear the file after sending

                setTimeout(() => {
                    window.location.reload();
                }, 10); 
            } else {
                setError(data.message || 'Error sending message');
            }
        } catch (err) {
            setError('Something went wrong while sending the message');
        }
    };

    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="h-[70vh] overflow-y-auto mb-4 rounded-lg p-4">
                {messages.length === 0 ? (
                    <p>No messages yet. Be the first to ask a doubt!</p>
                ) : (
                    Object.entries(
                        messages
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort messages by timestamp
                            .reduce((acc, message) => {
                                const messageDate = formatDate(message.timestamp);
                                if (!acc[messageDate]) {
                                    acc[messageDate] = [];
                                }
                                acc[messageDate].push(message);
                                return acc;
                            }, {})
                    ).map(([date, messagesOnDate], index) => (
                        <div key={index}>
                            <h3 className="text-center text-gray-600 text-sm mt-4 py-2">{date}</h3>
                            {messagesOnDate.map((message) => (
                                <div
                                    key={message._id}
                                    className={`flex items-start mb-4 ${message.sender === user._id ? 'bg-blue-500' : 'bg-orange-400'} rounded-md`}
                                >
                                    <img
                                        src={user.profilePhoto || '/default-profile.png'}
                                        alt="User"
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    
                                    <div className="flex flex-col">
                                        <p className="font-semibold">{message.senderFullName}</p>
                                        <p className="text-sm">{message.message}</p>
                                        {message.file && (
                                            <a
                                                href={message.file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 text-sm"
                                            >
                                                Download file
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Message Input Area */}
            <div className="fixed bottom-6 left-6 right-6 bg-white p-4 shadow-lg rounded-lg flex items-center space-x-4">
                <input
                    type="text"
                    className="flex-1 border rounded-full p-2 text-black"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <input
                    type="file"
                    className="hidden"
                    id="file-input"
                    onChange={handleFileSelect}
                />
                <label htmlFor="file-input">
                    <IoAttach size={24} className="cursor-pointer text-gray-500" />
                </label>
                <button
                    onClick={handleMessageSend}
                    className="bg-blue-500 text-white rounded-full p-2"
                >
                    <IoSend size={24} />
                </button>
            </div>
        </div>
    );
};

export default MyChat;
