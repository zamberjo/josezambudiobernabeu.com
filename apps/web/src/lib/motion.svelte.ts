import type { Action } from 'svelte/action';

/**
 * Cursor- and velocity-driven motion for the whole page.
 *
 * The scroll *reveals* are plain CSS scroll-driven animations (see app.css).
 * What lives here is the part CSS can't express: offsets that depend on the
 * pointer position, and a skew driven by scroll *velocity* rather than scroll
 * position. One shared rAF loop writes custom properties that the elements
 * consume in their own `transform`, so a node can combine parallax, magnetism
 * and a CSS reveal without any of them fighting over `transform`.
 *
 * Everything degrades to "no offsets", which is the finished layout: if the
 * loop never starts (reduced motion, no JS) the page is simply static.
 */

const MAGNET_RADIUS = 240;
const PARALLAX_TRAVEL = 170;

type Registered = { node: HTMLElement; amount: number };

const parallaxNodes = new Set<Registered>();
const magneticNodes = new Set<Registered>();

let root: HTMLElement | null = null;
let frame = 0;
let pointerX = -9999;
let pointerY = -9999;
let lastScrollY = 0;
let velocity = 0;

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function onPointerMove(event: PointerEvent) {
	pointerX = event.clientX;
	pointerY = event.clientY;
}

function onPointerLeave() {
	pointerX = -9999;
	pointerY = -9999;
}

function tick() {
	const viewportHeight = window.innerHeight;

	const delta = window.scrollY - lastScrollY;
	lastScrollY = window.scrollY;
	velocity += (delta - velocity) * 0.12;

	if (root) {
		const skew = Math.max(-6, Math.min(6, velocity * 0.07));
		root.style.setProperty('--skew', `${skew.toFixed(3)}deg`);
		root.style.setProperty(
			'--squash',
			(1 - Math.min(0.07, Math.abs(velocity) * 0.0012)).toFixed(4)
		);
	}

	for (const { node, amount } of parallaxNodes) {
		const rect = node.getBoundingClientRect();
		if (rect.bottom < -200 || rect.top > viewportHeight + 200) continue;
		const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
		node.style.setProperty('--py', `${(-progress * amount * PARALLAX_TRAVEL).toFixed(2)}px`);
	}

	const pointerActive = pointerX > -9000;
	for (const { node, amount } of magneticNodes) {
		let x = 0;
		let y = 0;
		if (pointerActive) {
			const rect = node.getBoundingClientRect();
			if (rect.bottom > -100 && rect.top < viewportHeight + 100) {
				const dx = pointerX - (rect.left + rect.width / 2);
				const dy = pointerY - (rect.top + rect.height / 2);
				const distance = Math.hypot(dx, dy);
				if (distance < MAGNET_RADIUS) {
					const pull = (1 - distance / MAGNET_RADIUS) * (amount / 10);
					x = dx * 0.16 * pull;
					y = dy * 0.16 * pull;
				}
			}
		}
		node.style.setProperty('--mx', `${x.toFixed(2)}px`);
		node.style.setProperty('--my', `${y.toFixed(2)}px`);
	}

	frame = requestAnimationFrame(tick);
}

function start() {
	if (frame || prefersReducedMotion()) return;
	lastScrollY = window.scrollY;
	window.addEventListener('pointermove', onPointerMove, { passive: true });
	window.addEventListener('pointerleave', onPointerLeave);
	frame = requestAnimationFrame(tick);
}

function stopIfIdle() {
	if (!frame || root || parallaxNodes.size || magneticNodes.size) return;
	cancelAnimationFrame(frame);
	frame = 0;
	window.removeEventListener('pointermove', onPointerMove);
	window.removeEventListener('pointerleave', onPointerLeave);
}

/** Marks the element that carries the page-wide `--skew` / `--squash` values. */
export const motionRoot: Action<HTMLElement> = (node) => {
	root = node;
	start();
	return {
		destroy() {
			if (root === node) root = null;
			stopIfIdle();
		}
	};
};

function register(set: Set<Registered>, node: HTMLElement, amount: number) {
	const entry: Registered = { node, amount };
	set.add(entry);
	start();
	return {
		update(next: number) {
			entry.amount = next;
		},
		destroy() {
			set.delete(entry);
			stopIfIdle();
		}
	};
}

/** Offsets the element against the scroll; `speed` is a fraction of the travel. */
export const parallax: Action<HTMLElement, number> = (node, speed = 0.2) =>
	register(parallaxNodes, node, speed);

/** Pulls the element toward a nearby cursor; `strength` matches the design's data-mag. */
export const magnetic: Action<HTMLElement, number> = (node, strength = 10) =>
	register(magneticNodes, node, strength);
