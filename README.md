# HangmanCS418
🪓 Hangman: Vite + Docker Edition
A modern, containerized Hangman game built with React, Vite, and Docker. This setup ensures a consistent development environment across any machine without needing to install Node.js locally.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine using Docker.

1. Prerequisites
Ensure you have the following installed:

Git: Download Git

Docker Desktop: Download Docker

2. Clone the Repository
Open your terminal or command prompt and run:
Bash
git clone https://github.com/your-username/hangman-game.git
cd hangman-game
3. Launch the App with Docker
You do not need to run npm install on your host machine. Docker will handle all dependencies inside the container.

Run the following command:
Bash
docker-compose up --build
4. Access the Game
Once the container is running and the terminal displays the Vite dev server confirmation, open your browser to:
👉 http://localhost:5173
