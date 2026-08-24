import { fail } from '../utils/api.js';
export const validateBody=schema=>(req,res,next)=>{const r=schema.safeParse(req.body);if(!r.success)return fail(res,'Validation failed',422,r.error.flatten());req.body=r.data;next();};
