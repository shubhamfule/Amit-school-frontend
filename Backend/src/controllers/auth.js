import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ok,fail } from '../utils/api.js';
export const login=async(req,res)=>{const {email,password,role}=req.body;const user=await User.findOne({email:email.toLowerCase(),role,active:true});if(!user||!(await bcrypt.compare(password,user.passwordHash)))return fail(res,'Invalid credentials',401);req.session.user={id:user._id.toString(),name:user.name,email:user.email,role:user.role,studentId:user.studentId?.toString()||null};return ok(res,{user:req.session.user},'Login successful');};
export const session=async(req,res)=>req.session.user?ok(res,{user:req.session.user},'Session valid'):fail(res,'Not authenticated',401);
export const logout=async(req,res)=>{req.session.destroy(err=>{res.clearCookie('connect.sid');if(err)return fail(res,'Logout failed',500);return ok(res,null,'Logged out successfully');});};
