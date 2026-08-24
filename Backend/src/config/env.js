import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({PORT:z.coerce.number().int().positive().default(5000),MONGODB_URI:z.string().min(1),SESSION_SECRET:z.string().min(32),CLIENT_URL:z.string().url(),NODE_ENV:z.enum(['development','test','production']).default('development'),SESSION_MAX_AGE_MS:z.coerce.number().int().positive().default(86400000),COOKIE_SAME_SITE:z.enum(['lax','strict','none']).default('lax'),COOKIE_SECURE:z.string().transform(v=>v==='true').default('false'),TRUST_PROXY:z.coerce.number().int().min(0).default(0)});
export const env=schema.parse(process.env);
