import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function Dashboard() {
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("notification", (data) => {
      setNotification((prev) => {
        return [data, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-4">
        {notification.length > 0 ? (
          notification.map((notif, index) => (
            <div
              key={index}
              className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
            >
              <p className="text-lg font-semibold">{notif.title}</p>
              <p>{notif.message}</p>
              <span className="text-sm text-gray-500">{notif.timestamp}</span>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
