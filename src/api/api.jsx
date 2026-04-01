// The URL of your Node.js API (running on port 3000 in Docker)
const BASE_URL = "http://localhost:3000";

/**
 * Requirement: Login / Add New Player
 * When the player enters their name, check if they're in DB with a GET request.
 * If he's new, the backend adds him; if found, it logs him in.
 */
export const fetchPlayer = async (playerName) => {
    try {
        const response = await fetch(`${BASE_URL}/player/${playerName}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        // Returns { player: { username, wins, losses }, isNew: boolean }
        return data; 
    } catch (error) {
        console.error("Failed to fetch player:", error);
        return null;
    }
};

/**
 * Requirement: Update Record (Win or Loss)
 * When game is over, update the player stats with a PUT request.
 */
export const updatePlayerRecord = async (playerName, gameResult) => {
    try {
        const response = await fetch(`${BASE_URL}/player/${playerName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // Logic: Send "win" or "loss" to the API
            body: JSON.stringify({ result: gameResult }), 
        });

        if (!response.ok) {
            throw new Error("Failed to update record on server");
        }

        const updatedData = await response.json();
        // Returns the updated player object from DynamoDB
        return updatedData; 
    } catch (error) {
        console.error("Update error:", error);
        return null;
    }
};