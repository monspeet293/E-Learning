import React from 'react';
import { connect } from "react-redux";
import Slider from "react-slick";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import MyCourseItem from './MyCourseItem';
import { useState } from 'react';
import { useEffect } from 'react';
import courseApi from '../../API/courseApi';

const NextArrow = ({ className, style, onClick }) => {
    return (
        <ArrowForwardIosIcon
            className={className}
            style={{ ...style }}
            onClick={onClick}
        />
    );
};

const PrevArrow = ({ className, style, onClick }) => {
    return (
        <ArrowBackIosIcon
            className={className}
            style={{ ...style }}
            onClick={onClick}
        />
    );
};

const MyCourseList = (props) => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [coursesList, setCoursesList] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                console.log(user._id)
                const rs = await courseApi.getCourseByID({ _id: user._id });
                console.log(rs)
                setCoursesList(rs.data);
            } catch (error) {
                console.log('false to fetch  list transfer :', error);
            }
            setLoading(false);
        })();
    }, [user._id]);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        draggable: true,
        rows: 2,
        slidesPerRow: 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };


    console.log(coursesList)

    const renderCourseList = () => {
        return coursesList.map((course, index) => {
            return (
                <div
                    key={index}
                    className="col-md-3 col-sm-6 col-xs-12 w-25 d-inline-block course-item_container"
                >
                    <MyCourseItem course={course} />
                </div>
            );
        });
    }

    return (
        <div>
            <div className='coursedetail container-fluid'>
                <div className='coursedetail_title'>
                    <h1>Khóa học của tôi</h1>
                </div>
            </div>
            <div className="mt-4 all-courses-list w-75 container-fluid">
                <Slider {...settings} className="courses-list container-fluid">
                    {renderCourseList()}
                </Slider>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        coursesList: state.coursesReducer,
    }
}

export default connect(mapStateToProps, null)(MyCourseList);