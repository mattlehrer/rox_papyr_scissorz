import { writable, type Writable } from 'svelte/store';
type Position = [number, number, number];

export const gameState: Writable<{ p1: Position; p2: Position }> = writable({
	p1: [0, 0, 0],
	p2: [0, 0, 0]
});

export const gameSize = writable(10);
