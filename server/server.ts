import {app} from './app';
import dbconnection from './utils/db';
require('dotenv').config({ path: './config/config.env' });
import cloudinary from 'cloudinary';


const PORT = process.env.PORT || 3000;

     


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
  

   

dbconnection();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});