import { COHERE_API_KEY } from '$env/static/private';
import { CohereClientV2 } from 'cohere-ai';

const cohere = new CohereClientV2({
	token: COHERE_API_KEY
});

const MODEL = 'command-r-plus';

/** @type {import('./$types').Actions} */

export const actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();
			const originalText = data.get('originalText');

			if (!originalText) return { result: null };

			const { generations } = await cohere.generate({
				model: MODEL,
				prompt: `Translate to english the text: ${originalText}`,
				maxTokens: 200,
				temperature: 0.9,
				k: 0,
				p: 0.75,
				frequencyPenalty: 0,
				presencePenalty: 0,
				stopSequences: [],
				returnLikelihoods: 'NONE'
			});

			const translatedText = generations[0]?.text?.replace(/\n/g, '');

			if (translatedText) {
				const { generations } = await cohere.generate({
					model: MODEL,
					prompt: `Write a text using other words that means the same as the next text: ${translatedText}`,
					maxTokens: 200,
					temperature: 0.2,
					k: 0,
					p: 0.75,
					frequencyPenalty: 0,
					presencePenalty: 0,
					stopSequences: [],
					returnLikelihoods: 'NONE'
				});

				const spinnedText = generations[0]?.text?.replace(/\n/g, '');

				if (spinnedText) {
					const { generations } = await cohere.generate({
						model: MODEL,
						prompt: `Translate to spanish the text: ${spinnedText}. Deliver only the translation without context.`,
						maxTokens: 200,
						temperature: 0.7,
						k: 0,
						p: 0.75,
						frequencyPenalty: 0,
						presencePenalty: 0,
						stopSequences: [],
						returnLikelihoods: 'NONE'
					});

					const resultText = generations[0]?.text?.replace(/\n/g, '');

					return { result: resultText, originalText };
				}
			}
			return { result: null };
		} catch (error) {
			console.error(error);
			throw new Error(error);
		}
	}
};
