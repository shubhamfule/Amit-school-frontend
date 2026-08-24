import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},passwordHash:{type:String,required:true},role:{type:String,required:true,enum:['admin','library','accountant-main','accountant-non-teaching','accountant-student','accountant-teaching','student'],index:true},active:{type:Boolean,default:true},studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',default:null}},{timestamps:true});
schema.set('toJSON',{transform:(_d,r)=>{delete r.passwordHash;return r;}});
export default mongoose.model('User',schema);
