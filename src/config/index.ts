import "dotenv/config";

export const config = {
    jwtToken: process.env.jwtToken,
    PORT: process.env.PORT ?? 3008,
    // Meta
    numberId: process.env.numberId,
    verifyToken: process.env.verifyToken,
    version: "v20.0",
    // AI
    Model: process.env.Model,
    ApiKey: process.env.ApiKey,
    // Sheets
    spreadsheetId: process.env.spreadsheetId,
    privateKey: process.env.privateKey,
    clientEmail: process.env.clientEmail,
    // Chatwoot
    CHATWOOT_ENDPOINT: process.env.CHATWOOT_ENDPOINT,
    INBOX_NAME: process.env.INBOX_NAME,
    CHATWOOT_ACCOUNT_ID: process.env.CHATWOOT_ACCOUNT_ID,
    CHATWOOT_TOKEN: process.env.CHATWOOT_TOKEN,
    BOT_URL: process.env.BOT_URL,
};