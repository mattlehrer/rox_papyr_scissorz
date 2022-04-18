import { gameState } from '$lib/stores';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { get } from 'svelte/store';

export async function post({ request }: RequestEvent) {
	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));
	const data: any = JSON.parse(JSON.stringify(object));
	console.log({ data });
	console.log({ data }, data.p1xcurrent);
	console.log('Current Game State: ', get(gameState));
	gameState.set({
		p1: [data.p1xcurrent, data.p1ycurrent, data.p1zcurrent],
		p2: [data.p2xcurrent, data.p2ycurrent, data.p2zcurrent]
	});
	console.log('New Game State: ', get(gameState));
	return { status: 201 };
}
