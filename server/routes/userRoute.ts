import express from 'express';
const UserRoute=express.Router();
import { testController,
     registerUser, 
     activateUser,
     loginUser,
     logoutUser,
     updateAccessToken,  
     getUserInfo,
     socialAuth
    } from './../controllers/userController';
import { isAuthenticated } from '../middleware/auth';


UserRoute.route('/test').get(testController);
UserRoute.route('/registration').post(registerUser);
UserRoute.route('/activate-user').post(activateUser);
UserRoute.route('/login').post(loginUser); 
UserRoute.route('/logout').post(isAuthenticated,logoutUser)  
UserRoute.route('/refresh-token').get(updateAccessToken)
UserRoute.route('/me').get(isAuthenticated,getUserInfo)
UserRoute.route('/social-auth').post(socialAuth)

export default UserRoute;