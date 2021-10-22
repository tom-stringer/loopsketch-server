import dotenv from "dotenv";
import path from "path";

const nodeEnv = process.env.NODE_ENV;

if (nodeEnv !== "dev" && nodeEnv !== "prod") {
    const message = `Unknown environment '${nodeEnv}'`;
    throw new Error(message);
}

const parsed = dotenv.config({ path: path.join(__dirname, `.env.${nodeEnv}`) }).parsed;
if (!parsed) {
    const message = `Couldn't parse .env.${nodeEnv}`;
    throw new Error(message);
}

const env = {
    NODE_ENV: parsed.NODE_ENV,
    PORT: parsed.PORT,
    DB: {
        DATABASE: parsed.DB_DATABASE,
        DIALECT: parsed.DB_DIALECT,
        USERNAME: parsed.DB_USERNAME,
        PASSWORD: parsed.DB_PASSWORD,
    },
    LOG: {
        LEVEL: parsed.LOG_LEVEL,
    },
};

export default env;
