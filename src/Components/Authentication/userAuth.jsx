import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Swal from "sweetalert2";
import { connect } from 'react-redux';
import { toggleLogin } from '../../Redux/Actions/dialog';

const UserAuth = ({ component: Component, ...props }) => {
    return (
        <Route
            {...props}
            render={routeProps => {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    return <Component {...routeProps} />;
                }
                Swal.fire({
                    title: 'Bạn chưa đăng nhập!',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ok'
                }).then(() => props.toggleLogin())

                return <Redirect to={{
                    pathname: `/course-detail/${props.courseDetail._id}`,
                }} />;
            }}
        />
    );
};

const mapStateToProps = (state) => {
    return {
        courseDetail: state.courseDetailReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLogin: () => {
            dispatch(toggleLogin())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAuth);