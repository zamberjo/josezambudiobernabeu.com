import type { EncodedImage, ImageOptimizer, MediaStore } from '@jzb/application';
import { IMAGE_WIDTHS, err, ok } from '@jzb/domain';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

/** Visually lossless for photos and screenshots at a fraction of PNG/JPEG size. */
const QUALITY = 80;

/**
 * libvips through sharp: honours EXIF rotation, drops metadata (camera, GPS),
 * never upscales. A source narrower than a target width is encoded at its own
 * width under that name, so every variant always exists.
 */
export const sharpImageOptimizer: ImageOptimizer = async (source) => {
	try {
		const image = sharp(source, { failOn: 'error' }).rotate();
		await image.metadata(); // rejects anything that is not a decodable image
		const variants: EncodedImage[] = await Promise.all(
			IMAGE_WIDTHS.map(async (width) => ({
				width,
				data: new Uint8Array(
					await image
						.clone()
						.resize({ width, withoutEnlargement: true })
						.webp({ quality: QUALITY, effort: 5 })
						.toBuffer()
				)
			}))
		);
		return ok(variants);
	} catch (cause) {
		return err({ kind: 'invalid-image', message: `Not a usable image: ${String(cause)}` });
	}
};

/**
 * A MediaStore on the local filesystem, for images committed to the repo:
 * `root` is the web's static/ directory and paths are site-relative.
 */
export const fsMediaStore = (root: string): MediaStore => ({
	put: async (path, data) => {
		try {
			const target = join(root, path);
			await mkdir(dirname(target), { recursive: true });
			await writeFile(target, data);
			return ok(path.startsWith('/') ? path : `/${path}`);
		} catch (cause) {
			return err({ kind: 'unavailable', message: String(cause) });
		}
	}
});
