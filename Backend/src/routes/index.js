import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/api.js';
import { requireAuth,requireRole } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { login,session,logout } from '../controllers/auth.js';
import { issueBook,returnBook } from '../controllers/library.js';
import { summary } from '../controllers/dashboard.js';
import { makeCrud } from '../controllers/crud.js';
import {Student,Staff,Attendance,Fee,Salary,Expense,Notice,Event,LeaveApplication,Book,LibraryMember,BookIssue,BookReturn,Fine,LibraryClearance,Admission,Exam,Result,Certificate,ParentInfo,CalendarEvent,Transaction,Settings} from '../models/index.js';
const r=Router();
const roles={admin:['admin'],library:['library','admin'],main:['accountant-main','admin'],nonTeaching:['accountant-non-teaching','admin'],studentAccountant:['accountant-student','admin'],teaching:['accountant-teaching','admin'],student:['student']};
const authRole=role=>[requireAuth,requireRole(roles[role])];
const rolePath={admin:'admin',student:'student','accountant-student':'accountant-student',library:'library','accountant-main':'accountant-main','accountant-non-teaching':'accountant-non-teaching','accountant-teaching':'accountant-teaching'};
for(const [role,path] of Object.entries(rolePath)){r.post(`/auth/${path}/login`,(req,res,next)=>{req.body={...req.body,role};next();},validateBody(z.object({email:z.string().email(),password:z.string().min(1),role:z.string().optional()})),asyncHandler(login));r.get(`/auth/${path}/session`,...authRole(role==='admin'?'admin':role==='student'?'student':role==='library'?'library':role==='accountant-main'?'main':role==='accountant-non-teaching'?'nonTeaching':role==='accountant-student'?'studentAccountant':'teaching'),asyncHandler(session));r.post(`/auth/${path}/logout`,asyncHandler(logout));}
// Correct the public login validation without dynamic imports at runtime.
r.post('/auth/_health-login',asyncHandler((req,res)=>res.json({success:true})));
const resources=[['students','Student',Student,'admin'],['staff','Staff',Staff,'admin'],['attendance','Attendance',Attendance,'admin'],['fees','Fee',Fee,'main'],['salary','Salary',Salary,'main'],['expenses','Expense',Expense,'main'],['notices','Notice',Notice,'admin'],['events','Event',Event,'admin'],['leave-applications','LeaveApplication',LeaveApplication,'admin'],['books','Book',Book,'library'],['library-members','LibraryMember',LibraryMember,'library'],['book-issues','BookIssue',BookIssue,'library'],['book-returns','BookReturn',BookReturn,'library'],['fines','Fine',Fine,'library'],['library-clearance','LibraryClearance',LibraryClearance,'library'],['admissions','Admission',Admission,'main'],['exams','Exam',Exam,'admin'],['results','Result',Result,'admin'],['certificates','Certificate',Certificate,'admin'],['parent-info','ParentInfo',ParentInfo,'student'],['calendar-events','CalendarEvent',CalendarEvent,'admin'],['transactions','Transaction',Transaction,'main'],['settings','Settings',Settings,'admin']];
for(const [path,name,Model,role] of resources){const c=makeCrud(Model);r.get(`/${path}`,...authRole(role==='student'?'student':role),asyncHandler(c.list));r.get(`/${path}/:id`,...authRole(role==='student'?'student':role),asyncHandler(c.get));r.post(`/${path}`,...authRole(role==='student'?'student':role),asyncHandler(c.create));r.put(`/${path}/:id`,...authRole(role==='student'?'student':role),asyncHandler(c.update));r.patch(`/${path}/:id`,...authRole(role==='student'?'student':role),asyncHandler(c.patch));r.delete(`/${path}/:id`,...authRole(role==='student'?'student':role),asyncHandler(c.remove));}
r.post('/library/issue',...authRole('library'),asyncHandler(issueBook));r.post('/library/return/:id',...authRole('library'),asyncHandler(returnBook));r.get('/dashboard/summary',...authRole('admin'),asyncHandler(summary));
export default r;
