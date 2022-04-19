import { hasSize } from '$lib/utils';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { Redis } from '@upstash/redis';

const gameSizeKey = 'GameSize';

export async function get({ platform }: RequestEvent) {
	const redis = new Redis({ url: platform.env.UPSTASH_URL, token: platform.env.UPSTASH_TOKEN });

	const size = Number(await redis.get(gameSizeKey));
	return {
		body: { size }
	};
}

export async function post({ request, platform }: RequestEvent) {
	const redis = new Redis({ url: platform.env.UPSTASH_URL, token: platform.env.UPSTASH_TOKEN });

	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));

	const data: unknown = JSON.parse(JSON.stringify(object));
	console.log({ data });
	hasSize(data);

	// console.log('Current Game Size: ', platform.env.RPS.get(gameSizeKey));

	await redis.set(gameSizeKey, JSON.stringify(data.size));

	// console.log('New Game Size: ', data.size);
	return { status: 201 };
}
