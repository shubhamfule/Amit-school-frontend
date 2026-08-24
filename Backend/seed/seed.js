import bcrypt from 'bcryptjs';
import { connectDB,disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import {Student,Staff,Book,Notice,Event,Expense,Salary} from '../src/models/index.js';
const users=[
 ['Admin','admin@amitschool.edu','Admin@123','admin'],['Library','library@amitschool.edu','Library@123','library'],['Main Accountant','mainaccountant@amitschool.edu','Accountant@123','accountant-main'],['Non Teaching Accountant','nonteachingaccountant@amitschool.edu','Accountant@123','accountant-non-teaching'],['Student Accountant','studentaccountant@amitschool.edu','Accountant@123','accountant-student'],['Teaching Accountant','teachingaccountant@amitschool.edu','Accountant@123','accountant-teaching'],['Student','student@amitschool.edu','Student@123','student']
];
async function run(){await connectDB();const passwordCache=new Map();for(const [name,email,password,role] of users){if(!passwordCache.has(password))passwordCache.set(password,await bcrypt.hash(password,12));await User.updateOne({email},{name,email,role,active:true,passwordHash:passwordCache.get(password)},{upsert:true});}
 const student=await Student.findOneAndUpdate({studentId:'STU-101'},{studentId:'STU-101',firstName:'Anjali',lastName:'Bhil',enteringClass:'9th',session:'2026-2027',gender:'Female',status:'Active',email:'student@amitschool.edu'},{upsert:true,new:true});await User.updateOne({email:'student@amitschool.edu'},{$set:{studentId:student._id}});
 const staff=[['T001','Anjali Deshmukh','Teaching','Mathematics','9th'],['T002','Rohit Kulkarni','Teaching','Science','8th'],['CL002','Meena Sharma','Non-Teaching','Administration','']];for(const [employeeId,name,staffType,subject,classGrade] of staff)await Staff.updateOne({employeeId},{employeeId,name,staffType,subject,classGrade,status:'Active'},{upsert:true});
 const books=[['BK-3001','Science Book','Science'],['BK-3002','English Grammar','English'],['BK-3003','Mathematics','Mathematics'],['BK-3004','Physics Guide','Physics'],['BK-3005','Geography Atlas','Geography']];for(const [bookId,title,category] of books)await Book.updateOne({bookId},{bookId,title,category,totalCopies:1,availableCopies:1,status:'Available'},{upsert:true});
 await Notice.updateOne({title:'Half-yearly exam schedule released'},{$setOnInsert:{title:'Half-yearly exam schedule released',audience:'All Classes',status:'Published',date:new Date('2026-07-21')}},{upsert:true});await Event.updateOne({eventId:'EV-1'},{$setOnInsert:{eventId:'EV-1',title:'Annual Sports Day',date:new Date('2026-07-15'),status:'Scheduled',location:'School Ground'}},{upsert:true});
 console.log('Seed complete. Development accounts:');for(const [name,email,password,role] of users)console.log(`${role}: ${email} / ${password}`);
 await disconnectDB();}
run().catch(async e=>{console.error(e);await disconnectDB();process.exit(1)});
