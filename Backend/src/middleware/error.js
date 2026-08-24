import mongoose from 'mongoose';
import { fail } from '../utils/api.js';
export function notFound(req,res){fail(res,`Route not found: ${req.method} ${req.originalUrl}`,404);}
export function errorHandler(err,req,res,next){
  if(res.headersSent)return next(err);
  if(err instanceof mongoose.Error.ValidationError)return fail(res,'Validation failed',422,Object.fromEntries(Object.entries(err.errors).map(([k,v])=>[k,v.message])));
  if(err?.code===11000)return fail(res,'Duplicate record',409,{fields:Object.keys(err.keyPattern||{})});
  if(err instanceof mongoose.Error.CastError)return fail(res,'Invalid identifier',400);
  console.error(err);
  return fail(res,process.env.NODE_ENV==='production'?'Internal server error':(err.message||'Internal server error'),500);
}
