import * as types from "../Constants/dialog";

const initialState = {
    toggleLogin: false,
    toggleRegister: false,
    toggleForgotPassword: false,
};

const dialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.TOGGLE_LOGIN: {
            return { ...state, toggleLogin: !state.toggleLogin }
        }
        case types.TOGGLE_REGISTER: {
            return { ...state, toggleRegister: !state.toggleRegister }
        }
        case types.TOGGLE_FORGOTPASSWORD: {
            return { ...state, toggleForgotPassword: !state.toggleForgotPassword }
        }
        default:
            return state;
    }
};

export default dialogReducer;