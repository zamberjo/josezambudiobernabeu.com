import { describe } from 'vitest';
import { contentStoreContract, seedPortfolio } from '../contract.ts';
import { createMemoryStore } from './index.ts';

describe('memory store', () => {
	contentStoreContract(async () => createMemoryStore(seedPortfolio()));
});
