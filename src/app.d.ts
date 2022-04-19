/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	interface Platform {
		env: {
			RPS: KVNamespace;
			UPSTASH_TOKEN: string;
			UPSTASH_URL: string;
		};
		context: {
			waitUntil(promise: Promise<any>): void;
		};
	}
	// interface Session {}
	// interface Stuff {}
}
