import cohere from 'cohere-ai';

const apiKey = process.env.COHERE_API_KEY;

cohere.init(apiKey);

/** @type {import('./$types').Actions} */

export const actions = {
	default: async ({ request }) => {
		try {
			const data = await request.formData();
			const originalText = data.get('originalText');

			const translated = await cohere.generate({
				model: 'command-xlarge-20221108',
				prompt: `Translate to english the text: ${originalText}`,
				max_tokens: 250,
				temperature: 0.9,
				k: 0,
				p: 0.75,
				frequency_penalty: 0,
				presence_penalty: 0,
				stop_sequences: ['--'],
				return_likelihoods: 'NONE'
			});

			const translatedText = translated.body.generations[0]?.text?.replace(/\n/g, '');

			console.log({ translatedText });

			if (translatedText) {
				const spinned = await cohere.generate({
					model: 'command-xlarge-20221108',
					prompt: `Write a text using other words that means the same as the next text: ${translatedText}`,
					max_tokens: 200,
					temperature: 0.9,
					k: 0,
					p: 0.75,
					frequency_penalty: 0,
					presence_penalty: 0,
					stop_sequences: ['--'],
					return_likelihoods: 'NONE'
				});

				const spinnedText = spinned.body.generations[0]?.text?.replace(/\n/g, '');

				console.log({ spinnedText });

				if (spinnedText) {
					const result = await cohere.generate({
						model: 'command-xlarge-20221108',
						prompt: `Translate to spanish the text: ${spinnedText}`,
						max_tokens: 200,
						temperature: 0.9,
						k: 0,
						p: 0.75,
						frequency_penalty: 0,
						presence_penalty: 0,
						stop_sequences: ['--'],
						return_likelihoods: 'NONE'
					});

					const resultText = result.body.generations[0]?.text?.replace(/\n/g, '');

					console.log({ resultText });

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
