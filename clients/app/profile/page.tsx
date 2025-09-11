"use client";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../component/Header";
import Profile from "../component/Profile/Profile";
import Protected from "../hooks/useProtected";
import Headings from "../utils/Heading";

type Props = {};

const page: FC<Props> = (props) => {
  
  const {user} = useSelector((state:any) => state.auth);

  return (
    <div>
      <Protected>
        <Headings
          title={`${user.name} Profile`}
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, MERN, Typescript, Redux"
        />
        
      <Profile user={user} />
      </Protected>
    </div>
  );
};

export default page;
