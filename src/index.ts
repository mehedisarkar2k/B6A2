import express from 'express';
import { ENV } from './config';
import { startServer } from './app';
import { Logger } from './core';

const app = express();

// Setup routes BEFORE listening (critical for Vercel)
startServer(app);

const PORT = ENV.PORT;
app.listen(PORT, (error) => {
    if (error) {
        console.error('Error starting the server:', error);

        process.exit(1);
    }

    Logger.info(`Server is running on  ${ENV.NODE_ENV === 'development' ? `🚀 http://localhost:${PORT}` : `port ${PORT}`}`);
});

// Export the app for Vercel serverless functions
export default app;
