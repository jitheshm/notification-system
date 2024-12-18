# Notification System

## Overview
This is a MERN Application for Notification System.

## Technologies Used
- React.js
- Express.js
- Socket.io
- Docker
- Redis

## Prerequisites

Make sure you have the following installed on your system:

- Node.js (v14 or later)
- npm
- Docker

## Getting Started

### Setup

1. Clone the repository :

   ```bash
   git clone https://github.com/jitheshm/notification-system.git

2. Navigate to the folder :

   ```bash
   cd notification-system

3. Configure the environment variables:

    Create a .env file in both the notification-service and frontend directories with the following contents:

    notification-service .env:
    ```bash
        MONGODB_URL=<mongodb_url>
        JWT_SECRET=<secret_key>
        FRONTEND_URL=<client_url>
    ```

    frontend .env:
    ```bash
         VITE_APIURL= <api_url>
       

4. Run Docker:
    ```bash
   docker compose up --build


- The Notification-service will run at port 3000.
- The Frontend-service  will run at port 5173.


