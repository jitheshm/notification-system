import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../axios";

function Dashboard() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch active users from the API
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const users = await axiosInstance.get("/notifications/users/active");
        console.log(users.data.data);
        setActiveUsers(users.data.data);
      } catch (error) {
        console.error("Error fetching active users:", error);
      }
    };
    fetchActiveUsers();
  }, []);

  // Handle message input change for the individual user notification
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Handle message input change for the broadcast message
  const handleBroadcastMessageChange = (event) => {
    setBroadcastMessage(event.target.value);
  };

  // Handle sending a notification message to the selected user
  const sendNotification = async () => {
    if (!selectedUser || !message) return;
    try {
      await axiosInstance.post("/notifications/target", {
        userId: selectedUser,
        message,
      });
      setMessage(""); // Clear the message input after sending
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification.");
    }
  };

  // Handle sending a broadcast notification to all users
  const sendBroadcast = async () => {
    if (!broadcastMessage) return;
    try {
      await axiosInstance.post("/notifications/broadcast", {
        message: broadcastMessage,
      });
      setBroadcastMessage(""); // Clear the broadcast message input after sending
      alert("Broadcast message sent successfully!");
    } catch (error) {
      console.error("Error sending broadcast message:", error);
      alert("Failed to send broadcast message.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Active Users</h1>

      {/* Broadcast Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Broadcast Message</h2>
        <textarea
          value={broadcastMessage}
          onChange={handleBroadcastMessageChange}
          placeholder="Write your broadcast message here..."
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-4 text-right">
          <button
            disabled={broadcastMessage.trim() === "" ? true : false}
            onClick={sendBroadcast}
            className={`px-6 py-2 font-semibold rounded-lg shadow-md focus:outline-none 
            ${
              broadcastMessage.trim() === ""
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Send Broadcast
          </button>
        </div>
      </div>

      {/* Active Users Section */}
      <div className="space-y-4">
        {activeUsers.length > 0 ? (
          <ul className="space-y-3">
            {activeUsers.map((user) => (
              <li
                key={user.userId}
                className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200"
              >
                <button
                  onClick={() => setSelectedUser(user.userId)}
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {user.email}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No active users found.</p>
        )}

        {selectedUser && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Send Notification to User</h2>
            <textarea
              value={message}
              onChange={handleMessageChange}
              placeholder="Write your message here..."
              rows={6}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-4 text-right">
              <button
                disabled={message.trim() === "" ? true : false}
                onClick={sendNotification}
                className={`px-6 py-2 font-semibold rounded-lg shadow-md focus:outline-none 
                ${
                  message.trim() === ""
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Send Notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
