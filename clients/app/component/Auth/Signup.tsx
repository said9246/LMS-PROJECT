"use client";

import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";

type Props = {
  setRoute: (route: string) => void;
};

const Schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

const Signup: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false);
  
  const [register, { isError, data, isSuccess, error }] = useRegisterMutation();

  
   useEffect(() => {
     if (isSuccess) {

       const message = data?.message || "Registration successful";
       toast.success(message);
       setRoute("Verification");
     }
    if (isError) {
      const message = (error as any)?.data?.message || "Registration failed";
      toast.error(message);
    }
  }, [isSuccess, data, error, setRoute]);




  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Schema,
 onSubmit: async ({ name, email, password }) => {
   const data = { name, email, password };
   await register(data);
},

  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="w-full p-4"> 
      <h1 className="text-2xl font-bold text-center">Join ELearning</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="John Doe"
            className={`w-full border p-2 rounded ${errors.name && touched.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && touched.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="example@gmail.com"
            className={`w-full border p-2 rounded ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && touched.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="********"
            className={`w-full border p-2 rounded ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}`}
          />
          {show ? (
            <AiOutlineEye className="absolute right-2 top-9 cursor-pointer" size={20} onClick={() => setShow(false)} />
          ) : (
            <AiOutlineEyeInvisible className="absolute right-2 top-9 cursor-pointer" size={20} onClick={() => setShow(true)} />
          )}
          {errors.password && touched.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>

        {/* Submit */}
        <div className="mb-4">
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer">Sign Up</button>
        </div>

        {/* Social */}
        <div className="text-center mb-4"> 
          <p>Or join with</p>
          <div className="flex justify-center gap-4 mt-2">
            <FcGoogle size={30} className="cursor-pointer" />
            <AiFillGithub size={30} className="cursor-pointer" />
          </div>
        </div>

        {/* Switch to Login */}
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer underline" onClick={() => setRoute("Login")}>
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
