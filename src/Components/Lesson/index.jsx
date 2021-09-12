import React, { useState, useEffect } from 'react';
import { getCourseDetail } from '../../Redux/Actions/courses';
import { connect } from 'react-redux';

const Lesson = (props) => {
    const [lesson, setLesson] = useState({})
    useEffect(() => {
        props.getCourseDetail(props.match.params._id);
    }, [])

    useEffect(() => {
        const indexLesson = props.courseDetail.mucLuc && props.courseDetail.mucLuc.findIndex(item => item._id === props.match.params._idLesson)
        if (indexLesson > -1) {
            setLesson(props.courseDetail.mucLuc[indexLesson]);
        }
    }, [props.courseDetail])

    const goToCourseLearn = () => {
        props.history.push(`/course-learn/${props.courseDetail._id}`);
    }

    return (
        <div className="lesson_container container text-center">
            <h3 className="lesson_courseName display-4 m-4">{props.courseDetail.tenKhoaHoc}</h3>
            <h3 className="lesson_title mb-4">{lesson.tieuDe}</h3>
            <iframe src={lesson.linkVideo} frameBorder="0" allowFullScreen></iframe>
            <div className="lesson_btn">
                <button onClick={goToCourseLearn} className="btn btn--red_big lesson_btnCourseLearn">Mục lục</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        courseDetail: state.courseDetailReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCourseDetail: (_id) => {
            dispatch(getCourseDetail(_id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);