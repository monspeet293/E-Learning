import React, { useEffect } from 'react';
import { getCourseDetail } from "../../Redux/Actions/courses";
import { connect } from 'react-redux';
import { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

const CourseLearn = (props) => {
    const [loading, setLoading] = useState(true);
    const match = useRouteMatch()
    useEffect(() => {
        props.getCourseDetail(props.match.params._id);
        setLoading(false);
    }, [])

    if (loading || !props.courseDetail.enrolledId) {
        return <>Loading</>
    }


    const user = JSON.parse(localStorage.getItem("user"))

    const idTemp = !!user ? user._id : -1;

    console.log(props.courseDetail)
    if (props.courseDetail.enrolledId.findIndex(item => item === idTemp) === -1) {
        console.log("TOIDAVAODAY");
        props.history.push(`/check-out/${props.courseDetail._id}`)
    }




    const goToLesson = (idLesson) => {
        props.history.push(`/course-learn/${props.courseDetail._id}/lesson/${idLesson}`);

    }


    const renderLessonList = () => {
        return props.courseDetail.mucLuc && props.courseDetail.mucLuc.map((item, index) => {
            return <div key={index} className="lesson_list_item row mb-2">
                <div className="lesson_list_item_title col-xs-6 col-sm-8 pl-5"><span className="mr-2">Bài {index + 1}.</span>{item.tieuDe}</div>
                <div className="lesson_list_item_button col-xs-6 col-sm-4">
                    <button type="button" className="btn" onClick={() => goToLesson(item._id)}>Xem</button>
                </div>
            </div>
        })
    }

    return (
        <div className="course_learn_container container-fluid">
            <h3 className="text-center">{props.courseDetail.tenKhoaHoc}</h3>
            <div className="course_learn_description text-center">
                <p>{props.courseDetail.moTa}</p>
            </div>

            <div className="lesson_list">
                <div className="card container">
                    <div className="card-body">
                        {renderLessonList()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        courseDetail: state.courseDetailReducer,
    }
}

export default connect(mapStateToProps, { getCourseDetail })(CourseLearn);