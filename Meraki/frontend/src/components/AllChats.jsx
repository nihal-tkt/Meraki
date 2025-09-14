import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AllChats = () => {
    const { courseId } = useParams();
    const [participants, setParticipants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllChats = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/chat/${courseId}/all-chats`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setParticipants(data);
                } else {
                    console.error("Failed to fetch all chats");
                }
            
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllChats();
    }, [courseId]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">All Chats</h2>
            <ul>
                {participants.map(participant => (
                    <li
                        key={participant.user._id}
                        className="flex items-center mb-4 cursor-pointer"
                        onClick={() => navigate(`/mychat/${courseId}/${participant.user._id}`)}
                    >
                        <img
                            src={participant.user.profilePhoto}
                            alt={participant.user.fullName}
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <p className="font-semibold">{participant.user.fullName}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllChats;
