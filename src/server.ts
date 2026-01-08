
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/index";

dotenv.config();

const PORT: number | string = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error: any) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();