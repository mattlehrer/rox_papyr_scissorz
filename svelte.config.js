import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					process: 'process/browser',
					stream: 'stream-browserify',
					util: 'util',
					https: 'agent-base',
					zlib: 'browserify-zlib'
				}
			}
		}
	}
};

export default config;
