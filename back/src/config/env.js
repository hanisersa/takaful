import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI || "mongodb+srv://mesterab20_db_user:abdo@cluster0.z1kci3p.mongodb.net/takaful?retryWrites=true&w=majority&appName=Cluster0";
export const JWT_SECRET = process.env.JWT_SECRET || "hackin_expedition_jwt_secret_2026";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";