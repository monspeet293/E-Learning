import * as Types from '../Constants/user';

const initialState = [];

const studentReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_STUDENT_LIST: {
            return action.payload;
        }
        default:
            return state;
    }
};

export default studentReducer;