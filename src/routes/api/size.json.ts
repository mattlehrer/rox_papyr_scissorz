import { hasSize } from '$lib/utils';
import type { RequestEvent } from '@sveltejs/kit/types/private';

const gameSizeKey = 'GameSize';

export async function get({ platform }: RequestEvent) {
	const size = Number(await platform.env.RPS.get(gameSizeKey));
	return {
		body: { size }
	};
}

export async function post({ request, platform }: RequestEvent) {
	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));

	const data: unknown = JSON.parse(object);
	console.log({ data });
	hasSize(data);

	console.log('Current Game Size: ', platform.env.RPS.get(gameSizeKey));

	await platform.env.RPS.put(gameSizeKey, JSON.stringify(data.size));

	console.log('New Game Size: ', data.size);
	return { status: 201 };
}
