import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  MONGO_URI: string;
  PORT: number;
  NODE_ENV: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  REDIS_URL: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  CLIENT_URL: string;
}

const requiredEnvVars: (keyof EnvVariables)[] = [
  "MONGO_URI",
  "PORT",
  "NODE_ENV",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const optionalEnvVars: Partial<Record<keyof EnvVariables, string>> = {
  REDIS_URL: "redis://127.0.0.1:6379",
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: "587",
  CLIENT_URL: "http://localhost:3000",
};

/**
 * Validates all required environment variables on startup.
 * Exits the process (code 1) if any are missing or invalid.
 */
const validateEnv = (): void => {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];

  requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];

    if (value === undefined || value === "") {
      missingVars.push(varName);
      return;
    }

    if (varName === "PORT") {
      const port = parseInt(value, 10);
      if (isNaN(port) || port <= 0 || port > 65535) {
        invalidVars.push(
          `${varName}: must be a valid port (1–65535), got: ${value}`,
        );
      }
    }

    if (varName === "MONGO_URI") {
      if (!value.startsWith("mongodb")) {
        invalidVars.push(
          `${varName}: must start with 'mongodb', got: ${value}`,
        );
      }
    }

    if (varName === "NODE_ENV") {
      const valid = ["development", "production", "test"];
      if (!valid.includes(value)) {
        invalidVars.push(
          `${varName}: must be one of [${valid.join(", ")}], got: ${value}`,
        );
      }
    }

    if (varName === "JWT_ACCESS_SECRET" || varName === "JWT_REFRESH_SECRET") {
      if (value.length < 32) {
        invalidVars.push(
          `${varName}: must be at least 32 characters long for security`,
        );
      }
    }
  });

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((v) => console.error(`   - ${v}`));
  }

  if (invalidVars.length > 0) {
    console.error("❌ Invalid environment variables:");
    invalidVars.forEach((e) => console.error(`   - ${e}`));
  }

  if (missingVars.length > 0 || invalidVars.length > 0) {
    console.error(
      "\n⚠️  Please check your .env file and fix the above issues.",
    );
    process.exit(1);
  }

  console.log("✅ All environment variables are valid");
};

const getEnv = (
  key: keyof EnvVariables | string,
  defaultValue?: string | number,
): string | number => {
  const value = process.env[key];
  if (value === undefined || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export { validateEnv, getEnv, EnvVariables };
