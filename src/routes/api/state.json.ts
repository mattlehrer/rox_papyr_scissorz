import { hasState } from '$lib/utils';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { Redis } from '@upstash/redis';

const gameStateKey = 'GameState';

export async function get({ platform }: RequestEvent) {
	const redis = new Redis({ url: platform.env.UPSTASH_URL, token: platform.env.UPSTASH_TOKEN });

	const state = (await redis.get(gameStateKey)) as string;
	return {
		body: { state },
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate'
		}
	};
}

export async function post({ request, platform }: RequestEvent) {
	const redis = new Redis({ url: platform.env.UPSTASH_URL, token: platform.env.UPSTASH_TOKEN });

	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));

	const data: unknown = JSON.parse(JSON.stringify(object));
	console.log({ data });
	hasState(data);

	// console.log('Current Game State: ', platform.env.RPS.get(gameStateKey));

	await redis.set(
		gameStateKey,
		JSON.stringify({
			p1: [Number(data.p1xcurrent), Number(data.p1ycurrent), Number(data.p1zcurrent)],
			p2: [Number(data.p2xcurrent), Number(data.p2ycurrent), Number(data.p2zcurrent)]
		})
	);

	// console.log('New Game State: ', JSON.stringify(data, null, 2));
	return { status: 201 };
}
