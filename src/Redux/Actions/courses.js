import * as Types from '../Constants';
import api from '../../API/courses';

export const getCoursesList = () => {
    return (dispatch) => {
        api
            .get('LayDanhSachKhoaHoc')
            .then((result) => {
                return dispatch({
                    type: Types.GET_COURSES_LIST,
                    payload: result.data.courses
                })
            });
    };
};

export const getCourseDetail = (_id) => {
    return (dispatch) => {
        api
            .get('LayThongTinKhoaHoc', {
                params: { _id }
            })
            .then((result) => {
                return dispatch({
                    type: Types.GET_COURSE_DETAIL,
                    payload: result.data.courseDetail
                })
            });
    }
}

export const addCourse = (course) => {
    return {
        type: Types.ADD_COURSE,
        payload: course,
    }
}