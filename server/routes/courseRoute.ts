
import express from "express";
const CourseRoute = express.Router();
import { addAnswerToQuestion, addQuestionInCourse, addReplyToReview, addReview, deleteCourse, editCourse, generateVideoUrl, getAllcources, getAllCoursesByAdmin, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/courseController";
import { authorizeRole, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/userController";

CourseRoute.route("/create-course").post(
  isAuthenticated,
  authorizeRole("admin"),
  uploadCourse
);

CourseRoute.route("/edit-course/:id").put(
  isAuthenticated,
  authorizeRole("admin"),
  editCourse
);



CourseRoute.get("/get-course/:id", getSingleCourse);
CourseRoute.get("/get-courses", getAllcources);
CourseRoute.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAuthenticated,
  getCourseByUser
);
CourseRoute.put(
  "/add-question",
  // updateAccessToken,
  isAuthenticated,
  addQuestionInCourse
);
CourseRoute.put(
  "/add-answer",
  // updateAccessToken,
  isAuthenticated,
  addAnswerToQuestion
);
CourseRoute.put(
  "/add-review/:id",
//   updateAccessToken,
  isAuthenticated,
  addReview
);
CourseRoute.put(
  "/reply-review",
  updateAccessToken,
  isAuthenticated,
  authorizeRole("admin"),
      addReplyToReview
    );
  CourseRoute.get(
    "/get-all-courses",
    updateAccessToken,
    isAuthenticated,
    authorizeRole("admin"),
    getAllCoursesByAdmin
  );
  CourseRoute.post("/getVdoCipherOtp", generateVideoUrl);
  CourseRoute.delete(
    "/delete-course/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRole("admin"),
    deleteCourse
  );







export default CourseRoute;
