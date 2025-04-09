const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
const logger = require('./logger');
dotenv.config();

class HuggingFaceService {
    constructor() {
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        this.isApiAvailable = false;
        
        try {
            if (apiKey) {
                this.hf = new HfInference(apiKey);
                this.isApiAvailable = true;
            } else {
                console.log('HUGGINGFACE_API_KEY not set, using fallback analysis');
            }
        } catch (error) {
            console.log('Error initializing Hugging Face service, using fallback analysis');
        }
        
        this.textGenerationModel = "google/flan-t5-base";
        this.embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";
    }

    async generateEmbeddings(text) {
        try {
            const response = await this.hf.featureExtraction({
                model: this.embeddingModel,
                inputs: text,
            });
            return response;
        } catch (error) {
            logger.error('Error generating embeddings:', error);
            throw error;
        }
    }

    async detectActionVerbs(text) {
        if (!this.isApiAvailable) {
            // Fallback: Use regex to detect common action verbs
            const commonVerbs = [
                'developed', 'implemented', 'created', 'managed', 'led',
                'designed', 'built', 'analyzed', 'improved', 'increased',
                'decreased', 'reduced', 'coordinated', 'maintained', 'launched',
                'achieved', 'trained', 'supervised', 'established', 'expanded'
            ];
            
            const foundVerbs = commonVerbs.filter(verb => 
                new RegExp(`\\b${verb}\\b`, 'i').test(text)
            );
            
            return foundVerbs;
        }

        try {
            const prompt = `Extract action verbs from this text that describe professional achievements. Only return the verbs in a comma-separated list: ${text}`;
            
            const response = await this.hf.textGeneration({
                model: this.textGenerationModel,
                inputs: prompt,
                parameters: {
                    max_length: 100,
                    temperature: 0.3
                }
            });

            if (!response || !response.generated_text) {
                console.warn('No response from Hugging Face API, using fallback');
                return this.detectActionVerbs(text); // Recursive call will use fallback
            }

            // Clean and process the response
            const verbs = response.generated_text
                .toLowerCase()
                .split(',')
                .map(verb => verb.trim())
                .filter(verb => verb.length > 0);

            return verbs;

        } catch (error) {
            console.error('Error detecting action verbs:', error);
            // Use fallback method
            return this.detectActionVerbs(text); // Recursive call will use fallback
        }
    }

    async analyzeText(text) {
        if (!this.isApiAvailable) {
            return "Consider adding more quantifiable achievements and using stronger action verbs to describe your experiences.";
        }

        try {
            const prompt = `Analyze this resume text and provide specific suggestions for improvement:\n\n${text}`;
            const response = await this.hf.textGeneration({
                model: this.textGenerationModel,
                inputs: prompt,
                parameters: {
                    max_length: 200,
                    temperature: 0.7,
                }
            });
            return response[0].generated_text;
        } catch (error) {
            logger.error('Error analyzing text:', error);
            return "Consider adding more quantifiable achievements and using stronger action verbs to describe your experiences.";
        }
    }

    async detectMeasurableAchievements(text) {
        if (!this.isApiAvailable) {
            // Fallback: Use regex to detect numbers and percentages
            const metrics = text.match(/\d+%|\d+\s*percent|\$\d+|\d+\s*users|\d+\s*clients/gi) || [];
            return metrics.length > 0 ? metrics : ['No specific metrics found'];
        }

        try {
            const prompt = `Find measurable achievements from this text:\n\n${text}`;
            const response = await this.hf.textGeneration({
                model: this.textGenerationModel,
                inputs: prompt,
                parameters: {
                    max_length: 100,
                    temperature: 0.3,
                }
            });
            return response[0].generated_text.split(',').map(achievement => achievement.trim());
        } catch (error) {
            console.error('Error detecting achievements:', error);
            return ['No specific metrics found'];
        }
    }
}

module.exports = new HuggingFaceService();
