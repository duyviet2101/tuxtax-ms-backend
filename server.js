import dotenv from 'dotenv';
import config from "./config.js";
import process from 'process';
import app from "./src/app.js";

dotenv.config();

const server = app.listen(config.PORT, () => {
    console.log(`Server is running on port http://localhost:${config.PORT}`);
});

process.on('SIGINT', () => {
    server.close();
    console.log('Server is closed');
    process.exit();
});