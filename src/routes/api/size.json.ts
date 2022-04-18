import { gameSize } from '$lib/stores';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { get } from 'svelte/store';

export async function post({ request }: RequestEvent) {
	const formData = await request.formData();
	const object = {};
	formData.forEach((value, key) => (object[key] = value));
	const data: any = JSON.parse(JSON.stringify(object));
	console.log({ data });
	console.log('Current Game Size: ', get(gameSize));
	gameSize.set(data.size);
	console.log('New Game Size: ', get(gameSize));
	return { status: 201 };
}
