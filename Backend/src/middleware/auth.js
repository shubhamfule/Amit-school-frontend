import { fail } from '../utils/api.js';
export function requireAuth(req,res,next){if(!req.session.user)return fail(res,'Authentication required',401);next();}
export function requireRole(roles){const allowed=Array.isArray(roles)?roles:[roles];return (req,res,next)=>{if(!req.session.user)return fail(res,'Authentication required',401);if(!allowed.includes(req.session.user.role))return fail(res,'Forbidden',403);next();};}
