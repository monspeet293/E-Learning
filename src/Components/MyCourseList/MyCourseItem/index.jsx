import React, { useState } from 'react';
import _ from "lodash";
import Skeleton from "react-loading-skeleton";
import Rating from "@material-ui/lab/Rating";
import { withRouter } from "react-router-dom";
import { getCourseDetail } from "../../../Redux/Actions/courses";
import { connect } from "react-redux";

const MyCourseItem = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    const goToCourseDetail = async () => {
        console.log("My", props.course.tenKhoaHoc)
        await props.getCourseDetail(props.course._id);
        await props.history.push(`/course-learn/${props.course._id}`);
        //props.getCourseDetail(props.course._id);
    }

    return (
        <div className="course-item_container mb-4">
            <div className="course-item mb-2">
                {props.course && (
                    <img
                        src={props.course.hinhAnh}
                        alt=""
                        onLoad={() => {
                            let delay = _.debounce(() => setIsLoading(false), 5);
                            delay();
                        }}
                    />
                )}
                {
                    <div className="point">
                        {isLoading ? (
                            <div className="loading">
                                <Skeleton />
                            </div>
                        ) : (
                            <>
                                <p>{(props.course.enrolledId).length - 1} ♥</p>
                                <Rating readOnly value={8.5} precision={0.5} />
                            </>
                        )}
                    </div>
                }
                {isLoading && (
                    <div className="loading">
                        <Skeleton width="100%" height="100%" />
                    </div>
                )}
            </div>
            <div className="course-item_detail">
                <p className="courseName text-center">
                    {isLoading ? <Skeleton /> : props.course.tenKhoaHoc + " - " + props.course.taiKhoanNguoiTao}
                </p>
                <div className="btn_viewDetail">
                    {isLoading ? (
                        <div className="btn loading">
                            <Skeleton width="100%" height="41px" />
                        </div>
                    ) : (
                        <button onClick={goToCourseDetail} className="btn w-100">
                            VÀO HỌC
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default connect(null, { getCourseDetail })(withRouter(MyCourseItem));