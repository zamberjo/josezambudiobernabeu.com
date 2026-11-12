import type {
	CollectionName,
	Entities,
	Portfolio,
	Result,
	Site,
	SiteSection,
	ValidationError
} from '@jzb/domain';

/*
 * Ports are plain function types, not classes or interfaces with `this`: an
 * adapter is any value of the right shape, and use cases receive them by
 * partial application. Reading and writing are separate ports (ISP), so the
 * web is handed a reader and can never write.
 */

export type Unavailable = { readonly kind: 'unavailable'; readonly message: string };
export type NotFound = { readonly kind: 'not-found'; readonly id: string };
export type Conflict = { readonly kind: 'conflict'; readonly message: string };

export type ReadError = Unavailable | ValidationError;
export type StoreError = Unavailable | NotFound | Conflict | ValidationError;
export type PublishError = Unavailable | ValidationError;

/** The web's only port: the whole aggregate, validated, in display order. */
export type PortfolioReader = () => Promise<Result<Portfolio, ReadError>>;

/** An entity as the store holds it: identity and order live outside the domain value. */
export type Stored<K extends CollectionName> = {
	readonly id: string;
	readonly position: number;
	readonly data: Entities[K];
};

/** Backoffice reads, which need identities that the published aggregate does not carry. */
export type ContentQueries = {
	list: <K extends CollectionName>(collection: K) => Promise<Result<Stored<K>[], StoreError>>;
	get: <K extends CollectionName>(
		collection: K,
		id: string
	) => Promise<Result<Stored<K>, StoreError>>;
	section: <S extends SiteSection>(section: S) => Promise<Result<Site[S] | null, StoreError>>;
};

/** Backoffice writes. Values arrive already validated by the use cases. */
export type ContentCommands = {
	/** Creates when `id` is absent (appended last), otherwise replaces the data in place. */
	save: <K extends CollectionName>(
		collection: K,
		entry: { id?: string; data: Entities[K] }
	) => Promise<Result<Stored<K>, StoreError>>;
	remove: (collection: CollectionName, id: string) => Promise<Result<void, StoreError>>;
	/** Rewrites every position to the index of its id in `ids`. */
	reorder: (
		collection: CollectionName,
		ids: readonly string[]
	) => Promise<Result<void, StoreError>>;
	saveSection: <S extends SiteSection>(
		section: S,
		value: Site[S]
	) => Promise<Result<void, StoreError>>;
};

/**
 * Sanitises an article's HTML and indexes its headings. Declared in the
 * domain, next to the read model that takes it; re-exported here with the
 * other ports.
 */
export type { ArticleRenderer } from '@jzb/domain';

/** Draws a post's share card. Declared in the domain, like `ArticleRenderer`. */
export type { ShareCardRenderer } from '@jzb/domain';

/** One encoded variant of an image, at a given width. */
export type EncodedImage = { readonly width: number; readonly data: Uint8Array };

export type InvalidImage = { readonly kind: 'invalid-image'; readonly message: string };

/** Re-encodes any image as the responsive WebP set `IMAGE_WIDTHS` describes. */
export type ImageOptimizer = (source: Uint8Array) => Promise<Result<EncodedImage[], InvalidImage>>;

/** Where images are kept and served from: Supabase Storage, or the repo's static/. */
export type MediaStore = {
	/** Stores `data` under `path` and returns the URL it is served at. */
	put: (
		path: string,
		data: Uint8Array,
		contentType: string
	) => Promise<Result<string, Unavailable>>;
};

/** Starts a rebuild and redeploy of the static site. */
export type PublishTrigger = () => Promise<Result<void, PublishError>>;

/** Where an exported snapshot goes (the repo's content/portfolio.json, in practice). */
export type SnapshotSink = (portfolio: Portfolio) => Promise<Result<void, Unavailable>>;
