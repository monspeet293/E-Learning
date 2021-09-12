import React from 'react';
import BannerCarousel from '../Components/BannerCarousel'
import CourseList from '../Components/CourseList';
import StudentReaction from '../Components/StudentReaction';

const HomePage = () => {
    return (
        <React.Fragment>
            <BannerCarousel />
            <CourseList />
            <StudentReaction />
        </React.Fragment>
    );
};

export default HomePage;