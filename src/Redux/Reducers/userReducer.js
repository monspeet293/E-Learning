import * as types from "../Constants/user";

const initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN: {
            localStorage.setItem("token", JSON.stringify(action.user.token));
            localStorage.setItem("user", JSON.stringify(action.user));
            return action.user;
        }
        case types.LOGOUT: {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return {};
        }
        case types.UPLOAD_AVATAR: {
            localStorage.setItem("user", JSON.stringify(action.payload));
        }
        default:
            return state;
    }
};
export default userReducer;