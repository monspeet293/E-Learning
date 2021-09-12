import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import apiUser from '../../../API/user';
import { connect } from 'react-redux';
import { login } from '../../../Redux/Actions/user';

const AdminLoginForm = (props) => {
    const loginSchema = yup.object().shape({
        taiKhoan: yup.string().required('* Không được bỏ trống!'),
        matKhau: yup.string().required('* Không được bỏ trống!'),
    })

    return (
        <div className="admin_login_form_wrapper container">
            <Formik
                className="admin_login_form"
                initialValues={{
                    taiKhoan: '',
                    matKhau: '',
                }}
                validationSchema={loginSchema}
                onSubmit={values => {
                    apiUser
                        .post("DangNhap", values)
                        .then(result => {
                            props.login(result.data.user);
                            console.log('Alo ' + props.user.maLoaiNguoiDung)
                        })
                        .then(() => {
                            Swal.fire({
                                title: 'Bạn đã đăng nhập thành công',
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Ok'
                            }).then(() => {
                                if (props.user.maLoaiNguoiDung === 'HV') {
                                    props.history.push('/');
                                }
                                else if (props.user.maLoaiNguoiDung !== 'HV') {
                                    props.history.push('/admin');
                                }
                            })
                        })
                        .catch((err) => {
                            if (err.response.status === 400) {
                                Swal.fire({
                                    title: 'Tài khoản hoặc mật khẩu không đúng!',
                                    icon: 'error',
                                    confirmButtonColor: '#e74c3c',
                                    confirmButtonText: 'Ok'
                                })
                            }
                        })
                }}
                render={(formikProps) => {
                    return <Form>
                        <div className="form-group">
                            <label htmlFor="taiKhoan">Tài khoản: </label>
                            <Field id="taiKhoan" type="text" className="form-control" name="taiKhoan" onChange={formikProps.handleChange} />
                            <ErrorMessage name="taiKhoan">
                                {(msg) => <div className="alert alert-danger">{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <div className="form-group">
                            <label htmlFor="matKhau">Mật khẩu: </label>
                            <Field id="matKhau" type="password" className="form-control" name="matKhau" onChange={formikProps.handleChange} />
                            <ErrorMessage name="matKhau">
                                {(msg) => <div className="alert alert-danger">{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <div className="text-center">
                            <button disabled={!(formikProps.isValid && formikProps.dirty)} className="btn btn-danger m-2">
                                ĐĂNG NHẬP
                            </button>
                        </div>
                    </Form>
                }} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user) => {
            dispatch(login(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLoginForm);