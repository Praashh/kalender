import { treaty } from '@elysiajs/eden';
import type { App } from '../../../apps/backend/src/index';
import { getBaseUrl } from './base-url';

// Create the Eden Treaty client
export const api = treaty<App>(getBaseUrl()).api;