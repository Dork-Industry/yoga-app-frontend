import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { RoutesData } from "../routes";

// pages
import DashboardOverview from "./dashboard/DashboardOverview";
import Settings from "./Settings";
import Signin from "./Signin";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import NotFoundPage from "./NotFound";
import ServerError from "./ServerError";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

import Categories from './authenticate/Categories';
import AddCategoryExercise from './authenticate/AddCategoryExercise';
import Exercise from './authenticate/Exercise';
import AddExercise from './authenticate/AddExercise';
import Challenges from './authenticate/Challenges';
import Weeks from "./authenticate/Weeks";
import AddWeek from './authenticate/AddWeek';
import WeekDays from "./authenticate/WeekDays";
import AddWeekDays from './authenticate/AddWeekDays';
import ChallengesExercise from  "./authenticate/ChallengesExercise";
import AddChallengesExercise from "./authenticate/AddChallengesExercise";
import CategoryExercise from "./authenticate/CategoryExercise";
import Discover from './authenticate/Discover';
import DiscoverExercise from "./authenticate/DiscoverExercise";
import AddDiscoverExercise from './authenticate/AddDiscoverExercise';
import QuickWorkout from './authenticate/QuickWorkout';
import QuickWorkOutExercise from "./authenticate/QuickWorkOutExercise";
import AddQuickWorkOutExercise from './authenticate/AddQuickWorkOutExercise';
import Stretches from './authenticate/Stretches';
import StretchesExercise from './authenticate/StretchesExercise';
import AddStretchesExercise from './authenticate/AddStretchesExercise';
import AddChallenge from './authenticate/AddChallenge';
import AddCategory from './authenticate/AddCategory';
import AddDiscover from './authenticate/AddDiscover';
import AddWorkout from './authenticate/AddWorkout';
import AddStretches from './authenticate/AddStreches';
import Users from './authenticate/User';
import Plan from './authenticate/Plan';
import AddPlan from './authenticate/AddPlan';

const RouteWithLoader = ({ component: Component, isAuth, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      {/* {isAuth ? ( */}
      <React.Fragment>
        <Preloader show={loaded ? false : true} />
        <Component {...rest} />
      </React.Fragment>
      {/* // ) : "dkdkd"} */}
    </React.Fragment>
  );
};

const RouteWithSidebar = ({ component: Component, isAuth, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <React.Fragment>
      {/* {isAuth ? ( */}
      <React.Fragment>
        <Preloader show={loaded ? false : true} />
        <Sidebar />
        <main className="content">
          <Navbar />
          <Component {...rest} />
          {/* <Footer toggleSettings={toggleSettings} showSettings={showSettings} /> */}
        </main>
      </React.Fragment>
      {/* ) : <Navigate to={'/sign-in'}/>}  */}
    </React.Fragment>
  );
};

export default () => {
  const token = localStorage.getItem('token');
  let isAuth = token ? true : false;

  return (
    <Routes>
      <Route path={RoutesData.Signin.path} element={<RouteWithLoader component={Signin} isAuth={isAuth} />} />
      <Route path={RoutesData.Signup.path} element={<RouteWithLoader component={Signup} isAuth={isAuth} />} />
      <Route path={RoutesData.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword} isAuth={isAuth} />} />
      <Route path={RoutesData.NotFound.path} element={<RouteWithLoader component={NotFoundPage} isAuth={isAuth} />} />
      <Route path={RoutesData.ServerError.path} element={<RouteWithLoader component={ServerError} isAuth={isAuth} />} />

      <Route path={RoutesData.ChangePassword.path} element={<RouteWithLoader component={ChangePassword} isAuth={isAuth} />} />
      <Route path={RoutesData.Categories.path} element={<RouteWithSidebar component={Categories} />} />
      <Route path={RoutesData.Plan.path} element={<RouteWithSidebar component={Plan} />} />
      <Route path={RoutesData.AddPlan.path} element={<RouteWithSidebar component={AddPlan} />} />
      <Route path={RoutesData.CategoryExercise.path} element={<RouteWithSidebar component={CategoryExercise} />} />
      <Route path={RoutesData.AddCategoryExercise.path} element={<RouteWithSidebar component={AddCategoryExercise} />} />
      <Route path={RoutesData.Exercise.path} element={<RouteWithSidebar component={Exercise} />} />
      <Route path={RoutesData.Challenges.path} element={<RouteWithSidebar component={Challenges} />} />
      <Route path={RoutesData.Weeks.path} element={<RouteWithSidebar component={Weeks} />} />
      <Route path={RoutesData.AddWeek.path} element={<RouteWithSidebar component={AddWeek} />} />
      <Route path={RoutesData.WeekDays.path} element={<RouteWithSidebar component={WeekDays} />} />
      <Route path={RoutesData.AddWeekDays.path} element={<RouteWithSidebar component={AddWeekDays} />} />
      <Route path={RoutesData.ChallengesExercise.path} element={<RouteWithSidebar component={ChallengesExercise} />} />
      <Route path={RoutesData.AddChallengesExercise.path} element={<RouteWithSidebar component={AddChallengesExercise} />} />
      <Route path={RoutesData.Discover.path} element={<RouteWithSidebar component={Discover} />} />
      <Route path={RoutesData.DiscoverExercise.path} element={<RouteWithSidebar component={DiscoverExercise} />} />
      <Route path={RoutesData.AddDiscoverExercise.path} element={<RouteWithSidebar component={AddDiscoverExercise} />} />
      <Route path={RoutesData.QuickWorkout.path} element={<RouteWithSidebar component={QuickWorkout} />} />
      <Route path={RoutesData.QuickWorkOutExercise.path} element={<RouteWithSidebar component={QuickWorkOutExercise} />} />
      <Route path={RoutesData.AddQuickWorkOutExercise.path} element={<RouteWithSidebar component={AddQuickWorkOutExercise} />} />
      <Route path={RoutesData.Stretches.path} element={<RouteWithSidebar component={Stretches} />} />
      <Route path={RoutesData.StretchesExercise.path} element={<RouteWithSidebar component={StretchesExercise} />} />
      <Route path={RoutesData.AddStretchesExercise.path} element={<RouteWithSidebar component={AddStretchesExercise} />} />
      <Route path={RoutesData.AddExercise.path} element={<RouteWithSidebar component={AddExercise} />} />
      <Route path={RoutesData.AddChallenge.path} element={<RouteWithSidebar component={AddChallenge} />} />
      <Route path={RoutesData.AddCategory.path} element={<RouteWithSidebar component={AddCategory} />} />
      <Route path={RoutesData.AddDiscover.path} element={<RouteWithSidebar component={AddDiscover} />} />
      <Route path={RoutesData.AddQuickWorkout.path} element={<RouteWithSidebar component={AddWorkout} />} />
      <Route path={RoutesData.AddStretches.path} element={<RouteWithSidebar component={AddStretches} />} />
      
      <Route path={RoutesData.DashboardOverview.path} element={<RouteWithSidebar component={DashboardOverview} isAuth={isAuth} />} />
      <Route path={RoutesData.Settings.path} element={<RouteWithSidebar component={Settings} isAuth={isAuth} />} />
      <Route path={RoutesData.Users.path} element={<RouteWithSidebar component={Users} isAuth={isAuth} />} />    
      {/* <Navigate to={RoutesData.NotFound.path}/> */}
    </Routes>
  )
}