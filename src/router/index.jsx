import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../pages/Layout/Layout";
import Profile from "../pages/Profile";
import Teacher from "../pages/Teacher";
import Student from "../pages/Student";
import News from "../pages/News";
import Course from "../pages/Course";
import Faq from "../pages/Faq";
import ContactUs from "../pages/ContactUs";
import NotFound from "../pages/NotFound";
import { SignInPage } from "../pages/Auth/SignIn";
import TeacherDetails from "../pages/Teacher/teacherDetails";
import StudentDetails from "../pages/Student/studentDetails";
import NewsDetails from "../pages/News/newsDetails";
import CourseDetails from "../pages/Course/CourseDetails";
import FaqDetails from "../pages/Faq/faqDetails";
import ProfileEdit from "../pages/Profile/editProfile";
import Material from "../pages/Material";
import PotentialCl from "../pages/PotentialCl";
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return token && !isTokenExpired(token);
};

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.exp < Date.now() / 1000;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: isAuthenticated() ? <Layout /> : <Navigate to="/sign-in" />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Teacher />,
      },

      {
        path: "/teacher",
        element: <Teacher />,
      },
      {
        path: "/teacherDetails/:id",
        element: <TeacherDetails />,
      },
      {
        path: "/studentDetails/:id",
        element: <StudentDetails />,
      },
      {
        path: "/student",
        element: <Student />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/newsDetails/:id",
        element: <NewsDetails />,
      },
      {
        path: "/course",
        element: <Course />,
      },
      {
        path: "/courseDetails/:id",
        element: <CourseDetails />,
      },

      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/faqDetails/:id",
        element: <FaqDetails />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/users",
        element: <Profile />,
      },
      {
        path: "/edit-profile",
        element: <ProfileEdit />,
      },
      {
        path: "/potential-clients",
        element: <PotentialCl />,
      },
      {
        path: "/material",
        element: <Material />,
      },
    ],
  },

  {
    path: "/sign-in",
    element: <SignInPage />,
  },
]);

export default router;