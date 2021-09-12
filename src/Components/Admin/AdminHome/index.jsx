import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../../../Redux/Actions/user';

const AdminHome = (props) => {
    const userLocalStorage = localStorage.getItem("user");
    const userLocalStorageParse = JSON.parse(userLocalStorage);

    useEffect(() => {
        if (userLocalStorage) {
            props.login(userLocalStorageParse);
        }
    }, [])
    return (
        <div className="d-flex justify-content-center align-items-center">
            <h4 className="text-center">Xin chào! Bạn đã đăng nhập thành công vào trang quản trị.</h4>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user) => {
            dispatch(login(user));
        },
        logout: () => {
            dispatch(logout());
        },
    }
}

export default connect(null, mapDispatchToProps)(AdminHome);