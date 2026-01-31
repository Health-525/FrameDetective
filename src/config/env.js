import 'dotenv/config';

const requiredEnvVars = [
  // 'REPLICATE_API_TOKEN' // Optional if using LLM only? No, core feature.
];

// Warn but don't crash if missing, unless strict mode.
// For now, we just export them.

export const config = {
  port: process.env.PORT || 3000,
  replicateApiToken: process.env.REPLICATE_API_TOKEN,
  llm: {
    apiKey: process.env.LLM_API_KEY,
    baseUrl: process.env.LLM_BASE_URL,
    modelName: process.env.LLM_MODEL_NAME,
  },
  models: {
    sam3Video: "lucataco/sam3-video:8cbab4c2a3133e679b5b863b80527f6b5c751ec7b33681b7e0b7c79c749df961",
    personFeature: process.env.PERSON_FEATURE_MODEL_VERSION,
  }
};

export const checkConfig = () => {
  const missing = [];
  if (!config.replicateApiToken) missing.push('REPLICATE_API_TOKEN');
  
  if (missing.length > 0) {
    console.warn(`WARNING: Missing environment variables: ${missing.join(', ')}`);
  }
};
