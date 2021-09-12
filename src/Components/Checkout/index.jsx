import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React, { useEffect } from 'react';
import { useState } from "react";
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getCourseDetail } from '../../Redux/Actions/courses';
import { toggleLogin } from "../../Redux/Actions/dialog";
import CourseItem from '../CourseList/CourseItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Modal } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import apiCourse from '../../API/courses';
import { formatPrice } from "../../utils/formatMoney";
import courseApi from "../../API/courseApi";
import paypal from "../../Assets/img/paypal.png";
import Paypal from "../Paypal"




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



const Checkout = (props) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(true)
    const [checkout, setCheckout] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



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


    const ConfirmForm = () => {
        //setCheckout(true);

        // console.log(props.courseDetail._id);
        // console.log(idTemp);

        Swal.fire({
            title: 'Bạn muốn mua khóa học?',
            confirmButtonColor: '#e74c3c',
            confirmButtonText: 'Ok',
            showCancelButton: true
        }).then(async (result) => {
            if (result.value) {
                try {
                    const result = await courseApi.payment({ _idCourse: props.courseDetail._id, _idStudent: idTemp })
                    //console.log({ _idCourse: props.courseDetail._id, _idStudent: idTemp });
                    console.log(result);
                    if (result.success) {
                        Swal.fire({
                            title: 'Đã mua khoá học thành công!',
                            icon: 'success',
                            confirmButtonColor: '#e74c3c',
                            confirmButtonText: 'Ok',
                        }).then(() => props.history.push(`/my-courses/${idTemp}`))
                    } else {
                        Swal.fire({
                            title: 'Mua khoá học thất bại!',
                            icon: 'warning',
                            confirmButtonColor: '#e74c3c',
                            confirmButtonText: 'Ok',
                        })
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                return;
            }
        })
    }

    const onSuccess = async (value) => {
        if (value) {
            try {
                const result = await courseApi.payment({ _idCourse: props.courseDetail._id, _idStudent: idTemp })
                //console.log({ _idCourse: props.courseDetail._id, _idStudent: idTemp });
                console.log(result);
                if (result.success) {
                    setOpen(false)
                    Swal.fire({
                        title: 'Đã mua khoá học thành công!',
                        icon: 'success',
                        confirmButtonColor: '#e74c3c',
                        confirmButtonText: 'Ok',
                    }).then(() => props.history.push(`/my-courses/${idTemp}`))
                } else {
                    Swal.fire({
                        title: 'Mua khoá học thất bại!',
                        icon: 'warning',
                        confirmButtonColor: '#e74c3c',
                        confirmButtonText: 'Ok',
                    })
                }
            } catch (error) {
                console.log(error);
            }
        }
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


    return (
        <div className="checkout">
            <div className="checkout_title">
                <h1>Thanh Toán</h1>
            </div>

            <div className='row'>
                <div className="col-md-7 checkout-form">
                    <h3>THÔNG TIN KHÓA HỌC</h3>
                    <li className="separator"></li>
                    <div className='checkout-detail'>
                        <li className="checkout-text">
                            <div>Danh Mục </div>
                            <div>{props.courseDetail.maDanhMuc}</div>
                        </li>
                        <li className="checkout-text">
                            <div>Tên Khóa Học </div>
                            <div>{props.courseDetail.tenKhoaHoc}</div>
                        </li>
                        <li className="checkout-text">
                            <div>Giảng viên </div>
                            <div>{props.courseDetail.taiKhoanNguoiTao}</div>
                        </li>

                    </div>
                </div>


                <div className="mt-4 col-md-4">
                    <h3 className="mb-0">TỔNG</h3>
                    <div className="card container-fluid">
                        <li className="form-group">
                            <div>Giá gốc</div>
                            <div>{formatPrice(props.courseDetail.giaTien)}</div>
                        </li>
                        <li className="separator"></li>
                        {/* <li className="form-group">
                            <div>Giảm giá</div>
                            <div>0 đ</div>
                        </li>
                        <li className="separator"></li> */}
                        <li className="form-group">
                            <div>VAT</div>
                            <div>10 %</div>
                        </li>
                        <li className="separator"></li>
                        <li className="form-group">
                            <div>Tổng giá trị</div>
                            <div>{formatPrice(props.courseDetail.giaTien * 1.1)}</div>
                        </li>
                        <li className="separator"></li>
                        <li className="form-group">
                            <div>Phương thức thanh toán</div>
                            <div>
                                <a target="_blank" rel="noopener noreferrer" href="https://www.sandbox.paypal.com/" className="mr-4">
                                    <img className="iconPartner" src={paypal} alt="" />
                                </a>
                                Paypal
                            </div>
                        </li>
                        <button onClick={handleOpen} className="btn btn--red_big coursedetail_card_btn">MUA</button>
                    </div>
                </div>
                <div className='related_course text-center container-fluid w-75'>
                    <h4 className="related_course_title">Các khóa học cùng lĩnh vực có thể bạn quan tâm</h4>
                    <Slider {...settings} className="courses-list container-fluid">
                        {renderRelatedCourses(props.courseDetail.maDanhMuc)}
                    </Slider>

                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Paypal onSuccess={onSuccess} informationPayment={props.courseDetail} />
            </Modal>

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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);