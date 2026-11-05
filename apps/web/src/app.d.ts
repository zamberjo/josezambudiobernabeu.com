// See https://svelte.dev/docs/kit/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Slug of the post open in the reader dialog (shallow routing). */
			reader?: string;
		}
		// interface Platform {}
	}
}

export {};
