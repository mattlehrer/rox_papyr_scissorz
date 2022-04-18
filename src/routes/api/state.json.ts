import type { RequestEvent } from '@sveltejs/kit/types/private';

const gameStateKey = 'GameSize';

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

	const data: unknown = JSON.parse(JSON.stringify(object));
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

function hasState(obj: any): asserts obj is RPSPosition {
	if (
		!obj.p1xcurrent ||
		!obj.p2xcurrent ||
		!obj.p1ycurrent ||
		!obj.p2ycurrent ||
		!obj.p1zcurrent ||
		!obj.p2zcurrent
	) {
		throw new Error('Missing position property');
	}
}

type RPSPosition = {
	p1xcurrent: number;
	p1ycurrent: number;
	p1zcurrent: number;
	p2xcurrent: number;
	p2ycurrent: number;
	p2zcurrent: number;
};
