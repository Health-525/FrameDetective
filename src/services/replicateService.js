import Replicate from 'replicate';
import { config } from '../config/env.js';

class ReplicateService {
  constructor() {
    this.replicate = new Replicate({
      auth: config.replicateApiToken,
    });
  }

  async runSam3(input) {
    if (!config.replicateApiToken) throw new Error("REPLICATE_API_TOKEN is not set");
    console.log("Running SAM3 with input:", input);
    return await this.replicate.run(config.models.sam3Video, { input });
  }

  async runFeatureExtraction(input) {
    if (!config.models.personFeature) throw new Error("PERSON_FEATURE_MODEL_VERSION is not set");
    console.log("Using Replicate for feature extraction...");
    return await this.replicate.run(config.models.personFeature, { input });
  }
}

export const replicateService = new ReplicateService();