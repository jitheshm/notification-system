import React, { useEffect } from "react";
import io from "socket.io-client";

function Dashboard() {
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    socket.on("notification", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>dashboard</div>;
}

export default Dashboard;
