import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler,notFound } from './middleware/error.js';
export function createApp(){
 const app=express();
 if(env.TRUST_PROXY)app.set('trust proxy',env.TRUST_PROXY);
 app.disable('x-powered-by');
 app.use(helmet());
 app.use(cors({origin:env.CLIENT_URL,credentials:true,methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Accept','Authorization']}));
 app.use(express.json({limit:'1mb'}));
 app.use(express.urlencoded({extended:false,limit:'1mb'}));
 app.use(session({name:'connect.sid',secret:env.SESSION_SECRET,resave:false,saveUninitialized:false,store:MongoStore.create({mongoUrl:env.MONGODB_URI,ttl:Math.floor(env.SESSION_MAX_AGE_MS/1000)}),cookie:{httpOnly:true,secure:env.COOKIE_SECURE,sameSite:env.COOKIE_SAME_SITE,maxAge:env.SESSION_MAX_AGE_MS}}));
 const loginLimiter=rateLimit({windowMs:15*60*1000,max:20,standardHeaders:true,legacyHeaders:false,message:{success:false,message:'Too many login attempts. Please try again later.'}});
 app.use('/api/auth',loginLimiter);
 app.get('/api/health',(req,res)=>res.json({success:true,message:'Amit School API is healthy'}));
 app.use('/api',routes);
 app.use(notFound);app.use(errorHandler);return app;
}
