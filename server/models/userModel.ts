require('dotenv').config({path:'./config/config.env'});
import jwt from 'jsonwebtoken';
import mongoose,{Document,Model,Schema} from 'mongoose';
import bycript from 'bcryptjs';

//email ka pattren correct btata hai
const emailregexPattern:RegExp= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;



export interface IUser extends Document {
    _id: string;
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter you email"],
      validate: {
        validator: function (value: string) {
          return emailregexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be atleast 8 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);
//hash password before saving
userSchema.pre<IUser>('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password=await bycript.hash(this.password,10);
    next();
});

//compare password

userSchema.methods.comparePassword=async function(candidatePassword:string):Promise<boolean>{
    return await bycript.compare(candidatePassword,this.password);
}

// Sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "7d",
  });
};

const userModel:Model<IUser>=mongoose.model<IUser>('User',userSchema);
export default userModel;