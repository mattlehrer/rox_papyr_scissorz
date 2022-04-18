import type { RequestEvent } from '@sveltejs/kit/types/private';

const gameSizeKey = 'GameSize';

export async function post({ request, platform }: RequestEvent) {
	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));

	const data: unknown = JSON.parse(JSON.stringify(object));
	console.log({ data });
	hasSize(data);

	console.log('Current Game Size: ', platform.env.RPS.get(gameSizeKey));

	await platform.env.RPS.put(gameSizeKey, JSON.stringify(data.size));

	console.log('New Game Size: ', data.size);
	return { status: 201 };
}

function hasSize(obj: any): asserts obj is RPSSize {
	if (!obj.size) {
		throw new Error('Missing size property');
	}
}

type RPSSize = { size: number };
