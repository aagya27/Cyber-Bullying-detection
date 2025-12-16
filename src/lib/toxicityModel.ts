import * as toxicity from '@tensorflow-models/toxicity';

// Standard threshold for toxicity detection
// Lowered to 0.6 to be "stricter" (catch more potential toxicity)
const THRESHOLD = 0.6;

export interface SimplifiedAnalysis {
    isToxic: boolean;
    categories: string[];
    confidence: number;
    probabilities: Record<string, number>;
}

class ToxicityService {
    private model: toxicity.ToxicityClassifier | null = null;
    private isLoading: boolean = false;
    private loadingPromise: Promise<toxicity.ToxicityClassifier> | null = null;

    async loadModel() {
        if (this.model) return this.model;

        if (this.loadingPromise) return this.loadingPromise;

        this.isLoading = true;
        console.log("Loading TensorFlow.js toxicity model...");

        try {
            this.loadingPromise = toxicity.load(THRESHOLD, []);
            this.model = await this.loadingPromise;
            console.log("Model loaded successfully");
            return this.model;
        } catch (error) {
            console.error("Failed to load toxicity model:", error);
            throw error;
        } finally {
            this.isLoading = false;
            this.loadingPromise = null;
        }
    }

    async analyze(text: string): Promise<SimplifiedAnalysis> {
        const model = await this.loadModel();

        const predictions = await model.classify([text]);

        const categories: string[] = [];
        let maxConfidence = 0;
        const probabilityMap: Record<string, number> = {};

        predictions.forEach(prediction => {
            // toxicity.classify returns an array of predictions
            // We look at the first result since we passed a single string
            const result = prediction.results[0];
            const probability = result.probabilities[1]; // Index 1 is the probability of being true (toxic)

            probabilityMap[prediction.label] = probability;

            // Check if it matches or if probability is high enough (redundancy check)
            if (result.match || probability >= THRESHOLD) {
                categories.push(prediction.label);
                maxConfidence = Math.max(maxConfidence, probability);
            }
        });

        const isToxic = categories.length > 0;

        return {
            isToxic,
            categories: categories,
            confidence: isToxic ? Math.round(maxConfidence * 100) : Math.round((1 - (probabilityMap['toxicity'] || 0)) * 100),
            probabilities: probabilityMap
        };
    }
}

export const toxicityService = new ToxicityService();
