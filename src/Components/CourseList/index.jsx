import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CourseItem from './CourseItem';
import { connect } from "react-redux";
import _ from "lodash";



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

const CourseList = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!_.isEmpty(props.coursesList)) {
            let delay = _.debounce(() => setIsLoading(false), 1000);
            delay();
        }
    }, [props.coursesList]);

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

    // const renderCourseList = () => {
    //     return props.coursesList.map((course, index) => {
    //         return (
    //             <div
    //                 key={index}
    //                 className="col-md-3 col-sm-6 col-xs-12 w-25 d-inline-block course-item_container"
    //             >
    //                 <CourseItem course={course} />
    //             </div>
    //         );
    //     });
    // }

    const renderCoursesListByCatalog = (catalog) => {
        let courseListByCatalog = props.coursesList.filter((course) => {
            return course.maDanhMuc === catalog
        })

        return courseListByCatalog.map((course, index) => {
            return (
                <div
                    key={index}
                    className="col-md-3 col-sm-6 col-xs-12 w-25 d-inline-block course-item_container"
                >
                    <CourseItem course={course} />
                </div>
            );
        });
    };

    return (
        <div className="mt-4 course-list">
            <ul className="nav nav-pills mb-3 container  text-center justify-content-center mb-5">
                <li className="nav-item frontend_container">
                    <a
                        className="frontendCourses nav-link active"
                        data-toggle="pill"
                        href="#pills-frontendCourses"
                    >
                        Frontend
                    </a>
                </li>
                <li className="nav-item backend_container">
                    <a
                        className="backendCourses nav-link"
                        data-toggle="pill"
                        href="#pills-backendCourses"
                    >
                        Backend
                    </a>
                </li>
                <li className="nav-item mobile_container">
                    <a
                        className="mobileCourses nav-link"
                        data-toggle="pill"
                        href="#pills-mobileCourses"
                    >
                        Mobile
                    </a>
                </li>
                <li className="nav-item design_container">
                    <a
                        className="designCourses nav-link"
                        data-toggle="pill"
                        href="#pills-designCourses"
                    >
                        Design
                    </a>
                </li>
            </ul>

            <div className="tab-content container-fluid w-75">
                <div className="tab-pane fade show active" id="pills-frontendCourses">
                    <Slider {...settings} className="courses-list container-fluid">
                        {isLoading
                            ? Array.from({ length: 4 }).map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="col-md-3 col-sm-6 col-xs-12 w-25 d-inline-block course-item_container"
                                    >
                                        <CourseItem course={null} />
                                    </div>
                                );
                            })
                            : renderCoursesListByCatalog("Frontend")}
                    </Slider>
                </div>
                <div className="tab-pane fade" id="pills-backendCourses" role="tabpanel">
                    <Slider {...settings} className="courses-list container-fluid">
                        {renderCoursesListByCatalog("Backend")}
                    </Slider>
                </div>
                <div className="tab-pane fade" id="pills-mobileCourses" role="tabpanel">
                    <Slider {...settings} className="courses-list container-fluid">
                        {renderCoursesListByCatalog("Mobile")}
                    </Slider>
                </div>
                <div className="tab-pane fade" id="pills-designCourses" role="tabpanel">
                    <Slider {...settings} className="courses-list container-fluid">
                        {renderCoursesListByCatalog("Design")}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        coursesList: state.coursesReducer,
    }
}

export default connect(mapStateToProps, null)(CourseList);