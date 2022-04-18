import { hasState } from '$lib/utils';
import type { RequestEvent } from '@sveltejs/kit/types/private';

const gameStateKey = 'GameState';

export async function get({ platform }: RequestEvent) {
	const state = await platform.env.RPS.get(gameStateKey);
	return {
		body: { state }
	};
}

export async function post({ request, platform }: RequestEvent) {
	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));

	// const data: unknown = JSON.parse(JSON.stringify(object));
	const data: unknown = JSON.parse(object);
	console.log({ data });
	hasState(data);

	console.log('Current Game State: ', platform.env.RPS.get(gameStateKey));

	await platform.env.RPS.put(
		gameStateKey,
		JSON.stringify({
			p1: [data.p1xcurrent, data.p1ycurrent, data.p1zcurrent],
			p2: [data.p2xcurrent, data.p2ycurrent, data.p2zcurrent]
		})
	);

	console.log('New Game State: ', JSON.stringify(data, null, 2));
	return { status: 201 };
}
