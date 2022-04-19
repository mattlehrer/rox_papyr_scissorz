import { hasState } from '$lib/utils';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { Redis } from '@upstash/redis';

const gameStateKey = 'GameState';

export async function get({ platform }: RequestEvent) {
	const redis = new Redis({ url: platform.env.UPSTASH_URL, token: platform.env.UPSTASH_TOKEN });

	// const state = JSON.parse(await platform.env.RPS.get(gameStateKey, { cacheTtl: 1 }));
	const state = JSON.parse(await redis.get(gameStateKey));
	return {
		body: { state }
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

	// await platform.env.RPS.put(
	// 	gameStateKey,
	// 	JSON.stringify({
	// 		p1: [Number(data.p1xcurrent), Number(data.p1ycurrent), Number(data.p1zcurrent)],
	// 		p2: [Number(data.p2xcurrent), Number(data.p2ycurrent), Number(data.p2zcurrent)]
	// 	})
	// );
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
