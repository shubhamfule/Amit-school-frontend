import { createApp } from './app.js';
import { connectDB,disconnectDB } from './config/db.js';
import { env } from './config/env.js';
let server;
async function start(){try{await connectDB();const app=createApp();server=app.listen(env.PORT,()=>console.log(`Amit School API listening on http://localhost:${env.PORT}`));}catch(err){console.error('Startup failed:',err.message);process.exit(1);}}
async function shutdown(signal){console.log(`${signal}: shutting down`);if(server)await new Promise(r=>server.close(r));await disconnectDB();process.exit(0);}
process.on('SIGINT',()=>shutdown('SIGINT'));process.on('SIGTERM',()=>shutdown('SIGTERM'));start();
