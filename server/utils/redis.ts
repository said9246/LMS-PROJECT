import {Redis} from 'ioredis';
require('dotenv').config( { path: './../config/config.env' } );

const redisClient = ()=>{  
    if(process.env.REDIS_URL){
        console.log("Redis connected");  
        return new Redis(process.env.REDIS_URL);
        
    }else{
        throw new Error("Redis URL not found");
    }
};
// export const redis=new Redis(redisClient())
export const redis = redisClient(); 
