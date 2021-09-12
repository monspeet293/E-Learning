import * as Types from '../Constants/user';

const initialState = [];

const teacherReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_TEACHER_LIST: {
            return action.payload;
        }
        default:
            return state;
    }
};

export default teacherReducer;