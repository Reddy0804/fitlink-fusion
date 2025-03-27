
// Application configuration settings

// API Keys (these should be provided securely in production)
export const GROQ_API_KEY = "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";

// Database configuration (placeholder for future connection details)
export const DB_CONFIG = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: Number(import.meta.env.DB_PORT) || 5432,
  database: import.meta.env.DB_NAME || 'health_tracking',
  user: import.meta.env.DB_USER || 'postgres',
  password: import.meta.env.DB_PASSWORD || '',
};

// API endpoint for Groq LLama model
export const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Health tracking constants
export const HEALTH_DATA_SIMULATION_INTERVAL = 5; // minutes
export const DEFAULT_ML_MODEL_THRESHOLD = 70; // Threshold for critical alerts (0-100)

// Patient profile default values (for demo purposes)
export const DEFAULT_PATIENT_AGE = 45;
export const DEFAULT_PATIENT_HEIGHT = 175; // cm
export const DEFAULT_PATIENT_WEIGHT = 70; // kg
