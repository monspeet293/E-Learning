import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { getCoursesList } from './Redux/Actions/courses';
import { connect } from 'react-redux';


// IMPORT COMPONENT
import ScrollToTop from './Containers/ScrollToTop';
import Admin from './Components/Admin';
import Layout from './Layout';
import HomePage from './Layout/HomePage';
import AllCourseList from './Components/AllCourseList';
import CourseDetail from './Components/CourseDetail';
import CourseLearn from './Components/CourseLearn';
import Lesson from './Components/Lesson';
import Profile from './Components/Profile';
import UserAuth from './Components/Authentication/userAuth';
import AdminHome from './Components/Admin/AdminHome';
import AdminAuth from './Components/Authentication/adminAuth';
import AdminLoginForm from './Components/Admin/LoginForm';
import AddCourse from './Components/Admin/AddCourse';
import CourseList from './Components/Admin/CourseList';
import StudentList from './Components/Admin/StudentList';
import TeacherCourseList from './Components/Admin/TeacherCourseList';
import EditCourse from './Components/Admin/EditCourse';
import EditLesson from './Components/Admin/EditCourse/EditLesson';
import MyCourseList from './Components/MyCourseList';
import TeacherList from './Components/Admin/TeacherList';
import Checkout from './Components/Checkout';

// IMPORT STYLE
import './Style/main.scss';
import Statistic from './Components/Admin/Statistic';
import UnapprovedList from './Components/Admin/UnapprovedList';



function App(props) {
  useEffect(() => {
    props.getCoursesList();
  }, []);

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Switch>
          <Admin path="/admin">
            <Switch>
              <Route path="/admin/login" exact component={AdminLoginForm} />
              <AdminAuth path='/admin/editcourse/:_id' exact component={EditCourse} />
              <AdminAuth path='/admin/editlesson/:_id' exact component={EditLesson} />
              <AdminAuth path="/admin/studentlist" exact component={StudentList} />
              <AdminAuth path="/admin/teacherlist" exact component={TeacherList} />
              <AdminAuth path="/admin/courselist" exact component={CourseList} />
              <AdminAuth path="/admin/addcourse" exact component={AddCourse} />
              <AdminAuth path="/admin/mycourselist" exact component={TeacherCourseList} />
              <AdminAuth path="/admin/unapprovedlist" exact component={UnapprovedList} />
              <AdminAuth path="/admin/statistic" exact component={Statistic} />
              <AdminAuth path="/admin" exact component={AdminHome} />
            </Switch>
          </Admin>
          <Layout path="/" >
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/all-courses" exact component={AllCourseList} />
              <Route path="/course-detail/:_id" exact component={CourseDetail} />
              <UserAuth path="/check-out/:_id" exact component={Checkout} />
              <UserAuth path="/course-learn/:_id" exact component={CourseLearn} />
              <UserAuth path="/course-learn/:_id/lesson/:_idLesson" exact component={Lesson} />
              <UserAuth path="/my-courses/:_id" exact component={MyCourseList} />
              <UserAuth path="/profile/:_id" exact component={Profile} />
            </Switch>
          </Layout>
        </Switch>
      </Router>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCoursesList: () => dispatch(getCoursesList()),
  }
}

export default connect(null, mapDispatchToProps)(App);
