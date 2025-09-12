import express from 'express';
const UserRoute=express.Router();
import { testController,
     registerUser, 
     activateUser,
     loginUser,
     logoutUser,
     updateAccessToken,  
     getUserInfo,
     socialAuth,
     updateUserInfo,
     updatePassword,
     updateAvatar,
     getAllUsersByAdmin,
     updateUserRole,
     deleteUser
    } from './../controllers/userController';
import { authorizeRole, isAuthenticated } from '../middleware/auth';


UserRoute.route('/test').get(testController);
UserRoute.route('/registration').post(registerUser);
UserRoute.route('/activate-user').post(activateUser);
UserRoute.route('/login').post(loginUser); 
UserRoute.route('/logout').post(isAuthenticated,logoutUser)  
UserRoute.route('/refresh-token').get(updateAccessToken)
UserRoute.route('/me').get(isAuthenticated,getUserInfo)
UserRoute.route('/social-auth').post(socialAuth)


UserRoute.put(
  "/update-user",
  updateAccessToken,
  isAuthenticated,
  updateUserInfo
);
UserRoute.put(
  "/update-password",
  updateAccessToken,
  isAuthenticated,
  updatePassword
);
UserRoute.put(
  "/update-avatar",
//   updateAccessToken,
  isAuthenticated,
  updateAvatar
);
UserRoute.get(
  "/get-all-users",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  getAllUsersByAdmin
);
UserRoute.put(
  "/update-user-role",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  updateUserRole
);
UserRoute.delete(
  "/delete-user/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
  deleteUser       
);

export default UserRoute;