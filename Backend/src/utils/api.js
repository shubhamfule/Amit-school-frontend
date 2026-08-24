export const ok=(res,data,message='Success',status=200,meta={})=>res.status(status).json({success:true,message,data,...meta});
export const fail=(res,message,status=400,details)=>res.status(status).json({success:false,message,...(details?{details}: {})});
export function asyncHandler(fn){return (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);}
