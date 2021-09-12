import * as Types from '../Constants/dialog';

export const toggleLogin = () => {
    return {
        type: Types.TOGGLE_LOGIN
    };
};

export const toggleRegister = () => {
    return {
        type: Types.TOGGLE_REGISTER
    }
}

export const toggleForgotPassword = () => {
    return {
        type: Types.TOGGLE_FORGOTPASSWORD
    }
}