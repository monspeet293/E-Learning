import * as Types from '../Constants';

const initialState = [];

const coursesReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_COURSES_LIST: {
            return action.payload;
        }
        default:
            return state;
    }
};

export default coursesReducer;