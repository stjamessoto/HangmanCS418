# 🪓 Hangman: Full-Stack Docker Edition
**CS 418 Group Project**

A modern, containerized Hangman game featuring a **React (Vite)** frontend, a **Node.js (Express)** API, and a **DynamoDB Local** database. This setup ensures a consistent development environment across any machine.

---

## 🏗️ Architecture & Stack
The project utilizes a microservices architecture managed by Docker Compose:

* **Frontend (React/Vite)**: Handles the game UI, keyboard event listeners, and local state management.
* **Backend (Node.js/Express)**: A Restful API that manages player authentication and score persistence.
* **Database (DynamoDB Local)**: A containerized NoSQL database that stores player records.



---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Docker Desktop** installed and running. No local installation of Node.js or Java is required.

### 2. Launch the Application
Run the following command in the root directory to build and start all services:
```bash
docker-compose up --build

### 3. Access the Game
Game UI: http://localhost:5173

API Health Check: http://localhost:3000

🔍 How to Verify the Database
Since DynamoDB Local is "headless," you can use these two primary methods to check the contents of the HangmanPlayers table.

1. The API "Quick View" 
The backend acts as a window into the database. You can see the raw JSON data for all players by visiting the following URL directly in your web browser:

👉 http://localhost:3000/players

When to use: Quick checks to see if a new user was created or if a win was recorded.

What it shows: A JSON object containing the total player count and an array of all players.

2. Postman 
For a more structured view and to test specific player updates, use Postman.

A. View All Players
Open Postman and create a new tab.

Set the method to GET.

Enter the URL: http://localhost:3000/players

Click Send.

B. Check a Specific Player
Set the method to GET.

Enter the URL: http://localhost:3000/player/Santiago (replace "Santiago" with any username).

Click Send.

C. Manually Update a Score
Set the method to PUT.

Enter the URL: http://localhost:3000/player/Santiago

Click the Body tab, select raw, and set the type to JSON.

Paste the following JSON:

JSON
{
  "result": "win"
}
Click Send. You should see the wins count increment in the response.