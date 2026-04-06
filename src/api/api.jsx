const BASE_URL = "http://localhost:3000";

/**
 * GET /player/:name
 * Logic: Returns { player: { username, wins, losses, winPercentage }, isNew: boolean }
 */
export const fetchPlayer = async (playerName) => {
    try {
        const response = await fetch(`${BASE_URL}/player/${playerName}`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Failed to fetch player:", error);
        return null;
    }
};

/**
 * PUT /player/:name
 * Logic: Updates stats and returns the FULL updated player object.
 */
export const updatePlayerRecord = async (playerName, gameResult) => {
    try {
        const response = await fetch(`${BASE_URL}/player/${playerName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ result: gameResult }), 
        });

        if (!response.ok) {
            throw new Error("Failed to update record on server");
        }

        const updatedPlayer = await response.json();
        
        /**
         * CRITICAL FIX: 
         * We wrap the response in a 'player' key so it matches the 
         * structure your App.jsx expects in setPlayerData().
         */
        return { player: updatedPlayer }; 
    } catch (error) {
        console.error("Update error:", error);
        return null;
    }
};