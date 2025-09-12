import { IUser } from './../models/userModel';
require('dotenv').config({ path: './config/config.env' });
import path from 'path';
import { Request, Response,NextFunction } from 'express';

import userModel from '../models/userModel';
import Errorhanddler from '../utils/ErrorHandler';
import sendEmail from '../utils/sendEmail';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import ejs from 'ejs';
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import { accessTokenOptions, refreshTokenOptions, sendToken } from '../utils/jwt';
import { redis } from '../utils/redis';
import { getUserById } from '../services/userServices';
import cloudinary from "../utils/cloudinary";  // path apne project ka
import ErrorHandler from '../utils/ErrorHandler';









//test controller
export const testController=catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:'This route is working fine'
    });
}); 

//register user
interface IRegisterBody {   

    name:string;
    email:string;
    password:string;
    avatar?:{
        public_id:string;
        url:string;
        }

}

export const registerUser=catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name,email,password}=req.body;
        const isemailexist=await userModel.findOne({email });
        if(isemailexist){
            return next(new Errorhanddler('User already exist',409));
        }
        const user: IRegisterBody={
            name,
            email,
            password,
          }
          const activationToken =createActivationToken(user);

          const activationCode=activationToken.activationCode;
          const data={ user:{name:user.name},activationCode};
            
            const html= await ejs.renderFile(path.join(__dirname,'../mails/activationMail.ejs'),{data});

            try {
                   await sendEmail({
  email: user.email,
  subject: "Activate your account",
  template: "activationMail.ejs", // 👈 correct
  data,
});

                res.status(201).json({
                    success:true,
                    message:`Email sent to ${user.email} successfully`,
                    activationToken:activationToken.Token 
                });
            } catch (error) {
  
  return next(new Errorhanddler('Error while sending mail',500));
}
                
    } catch (error) {
        return next(new Errorhanddler('Error while registering user',500));

        
    }  
});


//create activation token
interface IactivationToken{
    Token:string;
    activationCode:string;
}

export const createActivationToken = (user: any): IactivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const Token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET_KEY as Secret,
        { expiresIn: '1h' }
    );



    return { Token, activationCode };
};


// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } = req.body as IActivationRequest;

      if (!activation_token || !activation_code) {
        return next(new Errorhanddler("Please provide activation token and code", 400));
      }

     


      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET_KEY as string
        
      ) as { user: IUser; activationCode: string };


      if (newUser.activationCode !== activation_code) {
        return next(new Errorhanddler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new Errorhanddler("User already exist", 409));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        message: "User activated successfully",
        user,
      });
    }

     catch (error) {
  
  return next(new Errorhanddler("Token verification failed", 400));
}

  }
);


// Login User
interface ILoginRequest {
  email: string;
  password: string;
}

        

export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new Errorhanddler("Please provide email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new Errorhanddler("User not found", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new Errorhanddler("Invalid password", 400));
      }

      // ✅ Redis me user save karo
      await redis.set(user.id.toString(), JSON.stringify(user));

  

      // ✅ Token generate aur response bhejna
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new Errorhanddler(error.message, 400));
    }
  }
);


// Logout User
export const logoutUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      
      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Successfully logged out",
      });
    } catch (error: any) {
      return next(new Errorhanddler(error.message, 400));
    }
  }
);

// update access token
export const updateAccessToken = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try { 
      const refresh_token = req.cookies.refresh_token;
      const decoded =jwt.verify(refresh_token as string, process.env.REFRESH_TOKEN as string) as JwtPayload
      const message= 'could not refresh access token';
      if(!decoded){
        return next(new Errorhanddler(message,400));
      }
      const session=await redis.get(decoded.id as string);
      if(!session){
        return next(new Errorhanddler(message,400));
      }
      const user=JSON.parse(session) ;

      const access_token=jwt.sign({id:user._id}, process.env.ACCESS_TOKEN as string,{
        expiresIn:'3d'
      });

      const refreshToken=jwt.sign({id:user._id}, process.env.REFRESH_TOKEN as string,{
        expiresIn:'3d'
      });

      res.cookie("access_token", access_token, accessTokenOptions)
      res.cookie("refresh_token", refreshToken, refreshTokenOptions)

      res.status(200).json({
        success:true,
        access_token
      })    
    } catch (error) {
      return next(new Errorhanddler('could not refresh access token',400));
    }
  });



  //get user info
  export const getUserInfo=catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const userId=req.user?._id;
        getUserById(userId as string,res);
    } catch (error) {
        return next(new Errorhanddler('Error while getting user info',500));
    }
  }); 

  // social auth

  interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
  }
  export const socialAuth=catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {email,name,avatar}=req.body as ISocialAuthBody;
        const user=await userModel.findOne({email});
        if(!user){
            const newUser=await userModel.create({ email,name,avatar, password:email+process.env.JWT_SECRET_KEY });
            sendToken(newUser,201,res);
        } 
        else{
            sendToken(user,200,res);
        } 
    } catch (error) {
        return next(new Errorhanddler('Error while login/signup with social account',500));
    } 
  });





  
  
  // Update user information
  interface IUpdateUserInfo {
    name?: string;
  }
  
  export const updateUserInfo = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name } = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
        if (name && user) {
          user.name = name;
        }
  
        await user?.save();
        await redis.set(userId, JSON.stringify(user));
  
        res.status(201).json({
          success: true,
          user: user,
        });
      } catch (error: any) {}
    }
  );
  
  // Update user password
  interface IPasswordUpdate {
    oldPassword: string;
    newPassword: string;
  }
  
  export const updatePassword = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { oldPassword, newPassword } = req.body as IPasswordUpdate;
        if (!oldPassword || !newPassword) {
          return next(
            new Errorhanddler("Please provide old password and new password", 400)
          );
        }
  
        const userId = req.user?._id;
        const user = await userModel.findById(userId).select("+password");
        if (user?.password === undefined) {
          return next(new Errorhanddler("Invalid User", 400));
        }
  
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if (!isPasswordMatch) {
          return next(new Errorhanddler("Invalid old password", 400));
        }
  
        user.password = newPassword;
        await user.save();
        await redis.set(userId, JSON.stringify(user));
  
        res.status(201).json({
          success: true,
          user: user,
        });
      } catch (error: any) {
        return next(new Errorhanddler(error.message, 400));
      }
    }
  );
  
 // Update avatar
interface IUpdateAvatar {
  avatar: string;
}
export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ avatar ko safe tarike se pick karna
    const avatar =
      typeof req.body.avatar === "string"
        ? req.body.avatar
        : req.body.avatar?.avatar;

    if (!avatar) {
      return next(new ErrorHandler("Invalid avatar format", 400));
    }

    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler("Invalid User", 400));
    }

    if (avatar && user) {
      // Delete previous avatar from Cloudinary
      if (user?.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      // ✅ Remove base64 prefix
      const base64Data = avatar.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // ✅ Upload using upload_stream
      const uploadFromBuffer = () =>
        new Promise<{ public_id: string; secure_url: string }>(
          (resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "avatars", width: 150 },
              (error, result) => {
                if (error) return reject(error);
                resolve({
                  public_id: result!.public_id,
                  secure_url: result!.secure_url,
                });
              }
            );
            stream.end(buffer);
          }
        );

      const myCloud = await uploadFromBuffer();

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await user.save();
    await redis.set(userId.toString(), JSON.stringify(user));

    res.status(201).json({
      success: true,
      message: "Avatar saved successfully",
      user,
    });
  } catch (error: any) {
    console.log("🔥 updateAvatar Error:", error);
    return next(new ErrorHandler(error.message, 400));
  }
};


  // get all users -- admin
  export const getAllUsersByAdmin = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        getAllUsersService(res);
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );
  
  // update user role -- admin
  export const updateUserRole = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, role } = req.body;
        const user = await userModel.findOne({email});
        if (user) {
          const id = user._id
          updateUserRoleService(id, role, res, next);
        } else {
          return next(new Errorhanddler("User not found", 400));
        }
  
      } catch (error: any) {
        return next(new Errorhanddler(error.message, 400));
      }
    }
  );
  
  // delete user -- admin
  export const deleteUser = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
          return next(new Errorhanddler("User not found", 400));
        }
  
        await user.deleteOne({ id });
        await redis.del(id);
  
        res.status(201).json({
          success: true,
          message: "User deleted successfully",
        });
      } catch (error: any) {
        return next(new Errorhanddler(error.message, 400));
      }
    }
  );
  