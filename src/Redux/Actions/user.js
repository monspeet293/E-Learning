import * as Types from '../Constants/user';
import apiUser from '../../API/user';

export const login = (user) => {
    return {
        type: Types.LOGIN,
        user
    };
};

export const logout = () => {
    return {
        type: Types.LOGOUT
    };
};

export const register = (user) => {
    return {
        type: Types.REGISTER,
        user
    }
};
export const forgotpassword = (user) => {
    return {
        type: Types.FORGOTPASSWORD,
        user
    }
};

export const uploadAvatar = (_id, formData) => {
    return (dispatch) => {
        apiUser
            .put('UploadAvatar', formData, {
                params: { _id },
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then((result) => {
                return dispatch({
                    type: Types.UPLOAD_AVATAR,
                    payload: result.data.user,
                })
            })
    }
}

export const getStudentList = () => {
    return (dispatch) => {
        apiUser
            .get('LayDanhSachHocVien')
            .then((result) => {
                return dispatch({
                    type: Types.GET_STUDENT_LIST,
                    payload: result.data.students,
                })
            });
    };
};

export const getTeacherList = () => {
    return (dispatch) => {
        apiUser
            .get('LayDanhSachGV')
            .then((result) => {
                return dispatch({
                    type: Types.GET_TEACHER_LIST,
                    payload: result.data.teachers,
                })
            });
    };
};