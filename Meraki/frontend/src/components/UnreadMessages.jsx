import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UnreadMessages = () => {
    const { courseId } = useParams();
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnreadChats = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/chat/${courseId}/unread-message`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudents(data);
                } else {
                    console.error("Failed to fetch unread chats");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUnreadChats();
    }, [courseId]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Unread Messages</h2>
            <ul>
                {students.map(student => (
                    <li
                        key={student.sender._id}
                        className="flex items-center mb-4 cursor-pointer"
                        onClick={() => navigate(`/mychat/${courseId}/${student.sender._id}`)}
                    >
                        <img
                            src={student.sender.profilePhoto}
                            alt={student.sender.fullName}
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <p className="font-semibold">{student.sender.fullName}</p>
                            <p className="text-gray-500">
                                {student.messages.length} unread message(s)
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UnreadMessages;
