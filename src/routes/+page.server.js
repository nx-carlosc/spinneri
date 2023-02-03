import cohere from 'cohere-ai';
import { COHERE_API_KEY } from '$env/static/private';

cohere.init(COHERE_API_KEY);

/** @type {import('./$types').Actions} */

export const actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();
			const originalText = data.get('originalText');

			if (!originalText) return { result: null };

			const translated = await cohere.generate({
				model: 'medium',
				prompt: `Translate to english the text: ${originalText}`,
				max_tokens: 200,
				temperature: 0.9,
				k: 0,
				p: 0.75,
				frequency_penalty: 0,
				presence_penalty: 0,
				stop_sequences: [],
				return_likelihoods: 'NONE'
			});

			const translatedText = translated.body?.generations[0]?.text?.replace(/\n/g, '');

			if (translatedText) {
				const spinned = await cohere.generate({
					model: 'medium',
					prompt: `Write a text using other words that means the same as the next text: ${translatedText}`,
					max_tokens: 200,
					temperature: 0.9,
					k: 0,
					p: 0.75,
					frequency_penalty: 0,
					presence_penalty: 0,
					stop_sequences: [],
					return_likelihoods: 'NONE'
				});

				const spinnedText = spinned.body?.generations[0]?.text?.replace(/\n/g, '');

				if (spinnedText) {
					const result = await cohere.generate({
						model: 'medium',
						prompt: `Translate to spanish the text: ${spinnedText}`,
						max_tokens: 200,
						temperature: 0.9,
						k: 0,
						p: 0.75,
						frequency_penalty: 0,
						presence_penalty: 0,
						stop_sequences: [],
						return_likelihoods: 'NONE'
					});

					const resultText = result.body?.generations[0]?.text?.replace(/\n/g, '');

					return { result: resultText };
				}
			}
			return { result: null };
		} catch (error) {
			console.error(error);
			return { result: null };
		}
	}
};
