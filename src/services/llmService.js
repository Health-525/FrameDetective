import { config } from '../config/env.js';
import { replicateService } from './replicateService.js';

class LLMService {
  async extractFeatures(imageUrl) {
    const systemPrompt = [
      "You are an assistant that extracts visual identity features from a single person photo.",
      "Describe only stable, identity-related attributes: approximate age range, gender, hair style and color, distinctive clothing colors and types, accessories like glasses or hats.",
      "Do not mention background, emotions, or scene context.",
      "Return a single JSON object with three fields:",
      "prompt (short English phrase suitable for a vision model prompt),",
      "raw_description (longer English description),",
      "risk_level (one of: low, medium, high).",
      "The JSON must be strictly valid and not wrapped in markdown."
    ].join(" ");

    let text;

    if (config.llm.apiKey && config.llm.baseUrl && config.llm.modelName) {
      console.log(`Using LLM (${config.llm.modelName}) for feature extraction...`);
      const apiUrl = `${config.llm.baseUrl.replace(/\/$/, '')}/chat/completions`;

      const llmRes = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.llm.apiKey}`
        },
        body: JSON.stringify({
          model: config.llm.modelName,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: "Please extract the features from this image." },
                { type: "image_url", image_url: { url: imageUrl } }
              ]
            }
          ]
        })
      });

      const llmData = await llmRes.json();
      if (!llmRes.ok) {
        throw new Error(llmData.error?.message || `LLM API failed: ${llmRes.status}`);
      }
      text = llmData.choices[0]?.message?.content || "";
    } else if (config.models.personFeature) {
      const input = { image: imageUrl, prompt: systemPrompt };
      const output = await replicateService.runFeatureExtraction(input);
      
      if (typeof output === 'string') {
        text = output;
      } else if (Array.isArray(output)) {
        text = output.join('\n');
      } else if (output && typeof output.toString === 'function') {
        text = output.toString();
      } else {
        text = JSON.stringify(output);
      }
    } else {
      throw new Error("No feature extraction model configured (Set LLM_API_KEY or PERSON_FEATURE_MODEL_VERSION)");
    }

    return this.parseOutput(text);
  }

  parseOutput(text) {
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(text);
      }
    } catch {
      parsed = {
        prompt: String(text).slice(0, 200).replace(/\n/g, ' '),
        raw_description: String(text)
      };
    }

    const rawDescriptionValue = parsed.raw_description ?? parsed.rawDescription ?? parsed.description;
    const promptValue = parsed.prompt;
    const riskValue = parsed.risk_level ?? parsed.riskLevel;

    const rawDescription = rawDescriptionValue != null ? String(rawDescriptionValue) : '';
    let promptText = promptValue != null ? String(promptValue) : '';
    if (!promptText && rawDescription) {
      promptText = rawDescription.slice(0, 200).replace(/\n/g, ' ');
    }

    let riskLevel = riskValue != null ? String(riskValue).toLowerCase() : 'medium';
    if (riskLevel !== 'low' && riskLevel !== 'medium' && riskLevel !== 'high') {
      riskLevel = 'medium';
    }

    return {
      prompt: promptText,
      raw_description: rawDescription,
      risk_level: riskLevel
    };
  }
}

export const llmService = new LLMService();
