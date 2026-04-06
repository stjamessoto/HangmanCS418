import express from 'express';
import cors from 'cors';
import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { 
    DynamoDBDocumentClient, 
    GetCommand, 
    PutCommand, 
    UpdateCommand,
    ScanCommand, 
    DeleteCommand 
} from "@aws-sdk/lib-dynamodb";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * 1. Initialize the DynamoDB Client
 * FIX: Using 'dynamodb-local' as the default host for Docker networking consistency.
 */
const dynamoEndpoint = process.env.DYNAMO_ENDPOINT || "http://localhost:8000";

const client = new DynamoDBClient({
    region: "local",
    endpoint: dynamoEndpoint, 
    credentials: {
        accessKeyId: "fakeMyKeyId", // FIXED: Changed from accessKey_id
        secretAccessKey: "fakeSecretAccessKey"
    }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "HangmanPlayers";

/**
 * AUTO-INITIALIZATION LOGIC
 */
const initTable = async (retries = 5) => {
    while (retries > 0) {
        try {
            const createTableCommand = new CreateTableCommand({
                TableName: TABLE_NAME,
                AttributeDefinitions: [{ AttributeName: "username", AttributeType: "S" }],
                KeySchema: [{ AttributeName: "username", KeyType: "HASH" }],
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
            });
            await client.send(createTableCommand);
            console.log(`✅ Table "${TABLE_NAME}" created successfully.`);
            break;
        } catch (error) {
            if (error.name === 'ResourceInUseException') {
                console.log(`ℹ️ Table "${TABLE_NAME}" already exists.`);
                break;
            } else {
                retries -= 1;
                console.error(`⚠️ Connection failed to ${dynamoEndpoint}. Retries left: ${retries}`);
                await new Promise(res => setTimeout(res, 2000));
            }
        }
    }
};

initTable();

/**
 * GET /players
 */
app.get('/players', async (req, res) => {
    try {
        const { Items } = await docClient.send(new ScanCommand({
            TableName: TABLE_NAME
        }));
        res.json({ count: Items.length, players: Items });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch player list" });
    }
});

/**
 * GET /player/:name
 */
app.get('/player/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const { Item } = await docClient.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { username: name }
        }));

        if (Item) {
            return res.json({ player: Item, isNew: false });
        } else {
            const newPlayer = {
                username: name,
                wins: 0,
                losses: 0,
                winPercentage: "0.00"
            };
            await docClient.send(new PutCommand({
                TableName: TABLE_NAME,
                Item: newPlayer
            }));
            return res.status(201).json({ player: newPlayer, isNew: true });
        }
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve or create player" });
    }
});

/**
 * PUT /player/:name
 * Logic: Atomic increment and persistent calculation.
 */
app.put('/player/:name', async (req, res) => {
    const { name } = req.params;
    const { result } = req.body; 

    if (result !== 'win' && result !== 'loss') {
        return res.status(400).json({ error: "Result must be 'win' or 'loss'" });
    }

    const updateAttr = result === "win" ? "wins" : "losses";

    try {
        // 1. Increment the count
        const { Attributes } = await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { username: name },
            UpdateExpression: `ADD ${updateAttr} :inc`,
            ExpressionAttributeValues: { ":inc": 1 },
            ReturnValues: "ALL_NEW"
        }));
        
        // 2. Calculate percentage
        const totalGames = Attributes.wins + Attributes.losses;
        const winPercent = totalGames > 0 
            ? ((Attributes.wins / totalGames) * 100).toFixed(2) 
            : "0.00";

        // 3. Update the calculated field
        const finalUpdate = await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { username: name },
            UpdateExpression: `SET winPercentage = :wp`,
            ExpressionAttributeValues: { ":wp": winPercent },
            ReturnValues: "ALL_NEW"
        }));

        res.json(finalUpdate.Attributes);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: "Could not update player stats" });
    }
});

/**
 * DELETE /player/:name
 */
app.delete('/player/:name', async (req, res) => {
    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { username: req.params.name }
        }));
        res.json({ message: "Player deleted" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});

app.get('/', (req, res) => {
    res.send('🚀 Hangman API is running!');
});

app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

export default app;