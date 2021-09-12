import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React, { useEffect } from 'react';
import { useState } from "react";
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getCourseDetail } from '../../Redux/Actions/courses';
import { toggleLogin } from "../../Redux/Actions/dialog";
import { formatPrice } from "../../utils/formatMoney";
import CourseItem from '../CourseList/CourseItem';

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

const CourseDetail = (props) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        props.getCourseDetail(props.match.params._id);
        setLoading(false)
    }, [])

    if (loading || !props.courseDetail.enrolledId) {
        return <>loading...</>
    }

    const idTemp = !!user ? user._id : -1
    const renderRelatedCourses = (catalog) => {
        let coursesListByCatalog = props.coursesList.filter((course) => {
            return course.maDanhMuc === catalog;
        })



        return coursesListByCatalog.map((course, index) => {
            return <div key={index} className="col-md-3 col-sm-6 col-xs-12 w-25 d-inline-block course-item_container">
                <CourseItem course={course} />
            </div>
        })
    }



    const renderCoursesContent = () => {
        return props.courseDetail.mucLuc && props.courseDetail.mucLuc.map((course, index) => {
            return <li key={index} className="coursedetail_content_item d-flex justify-content-between">
                <p className="coursedetail_content_item_title">{course.tieuDe}</p>
                {/* <p className="coursedetail_content_item_time">2 phút</p> */}
            </li>
        })
    }

    const goToCourseLearn = () => {
        props.history.push(`/course-learn/${props.courseDetail._id}`);
    }

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
    console.log(props.courseDetail.enrolledId)
    const isOwner = props.courseDetail.enrolledId.findIndex(item => item === idTemp) > -1

    let price;
    isOwner ? (price = 'VÀO HỌC') : (price = formatPrice(props.courseDetail.giaTien))
    const follower = (props.courseDetail.enrolledId).length - 1;
    //console.log(follower);


    return (
        <div className='coursedetail container-fluid'>

            <div className='coursedetail_title'>
                <h1>{props.courseDetail.tenKhoaHoc} - {props.courseDetail.taiKhoanNguoiTao}</h1>
            </div>

            <div className='row'>
                <div className='col-md-8 coursedetail_content'>
                    <h3 className="mb-0">Mô tả khóa học</h3>
                    <p className='coursedetail_detail'>
                        {props.courseDetail.moTa} <br />
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing <br />
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>

                    <ul className="coursedetail_content pl-0">
                        {/* <h3 className="mb-4">Nội dung khoá học</h3> */}
                        {
                            !isOwner ? (
                                <h3 className="mb-4">Chưa mua khoá học. Hãy mua khóa học này để học</h3>
                            ) :
                                <div></div>
                        }

                        <div>
                            <h3 className="mb-4">Nội dung khoá học</h3>
                            <div className="coursedetail_content_item_container">
                                {renderCoursesContent()}
                            </div>
                        </div>
                        {/* <div className="coursedetail_content_item_container">
                            {renderCoursesContent()}
                        </div> */}
                    </ul>
                </div>

                <div className='mt-4 col-md-4'>
                    <div className="card coursedetail_card text-center" style={{ width: '22rem' }}>
                        <img src={props.courseDetail.hinhAnh} className="card-img-top" alt="hinhkhoahoc" />
                        <div className="card-body">
                            <h5 className="coursedetail_card_title">
                                {props.courseDetail.tenKhoaHoc}
                            </h5>
                            <div className="rating_stars my-2">
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star"></i>
                                <i className="fa fa-star-half-o"></i>
                            </div>

                            {/* <p className="coursedetail_card_price">{props.courseDetail.gia}</p> */}
                            <button onClick={goToCourseLearn} className="btn btn--red_big coursedetail_card_btn">{price}</button>
                        </div>
                    </div>
                </div>

                <div className='related_course text-center container-fluid w-75'>
                    <h4 className="related_course_title">Các khóa học cùng lĩnh vực có thể bạn quan tâm</h4>
                    <Slider {...settings} className="courses-list container-fluid">
                        {renderRelatedCourses(props.courseDetail.maDanhMuc)}
                    </Slider>

                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        courseDetail: state.courseDetailReducer,
        coursesList: state.coursesReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLogin: () => {
            dispatch(toggleLogin());
        },
        getCourseDetail: (_id) => {
            dispatch(getCourseDetail(_id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);