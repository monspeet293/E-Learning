import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminAuth = ({ component: Component, ...props }) => {
    const userLocalStorage = localStorage.getItem("user");
    const userLocalStorageParse = JSON.parse(userLocalStorage);
    return (
        <Route {...props} render={routeProps => {
            if ((userLocalStorage && userLocalStorageParse.maLoaiNguoiDung === "AD") ||
                (userLocalStorage && userLocalStorageParse.maLoaiNguoiDung === "GV")) {
                return <Component {...routeProps} />
            }
            else if (userLocalStorage && userLocalStorageParse.maLoaiNguoiDung === "HV") {
                return <Redirect to='/' />
            }
            else {
                return <Redirect to='/admin/login' />
            }
        }} />
    );
};

export default AdminAuth;