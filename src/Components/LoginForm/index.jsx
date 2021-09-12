import React from 'react';
import { connect } from "react-redux";
import { toggleLogin } from '../../Redux/Actions/dialog';
import { login } from '../../Redux/Actions/user';
import apiUser from '../../API/user';
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from "@material-ui/core";

const LoginForm = (props) => {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const loginSchema = yup.object().shape({
        taiKhoan: yup.string().required('* Không được bỏ trống!'),
        matKhau: yup.string().required('* Không được bỏ trống!'),
    })

    return (
        <React.Fragment>
            <button className="btn mr-1 btn--white" type="submit" onClick={props.toggleLogin}>Đăng nhập</button>
            <Dialog open={props.toggle.toggleLogin} onClose={props.toggle.toggleLogin} aria-labelledby="form-dialog-title" fullWidth={fullWidth} maxWidth={maxWidth}>
                <DialogTitle id="form-dialog-title">ĐĂNG NHẬP</DialogTitle>
                <DialogContent>
                    <Formik
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
                                })
                                .then(() => {
                                    Swal.fire({
                                        title: 'Bạn đã đăng nhập thành công',
                                        icon: 'success',
                                        confirmButtonColor: '#feda6a',
                                        confirmButtonText: 'Ok'
                                    })
                                })
                                .catch((err) => {
                                    if (err.response.status === 400) {
                                        Swal.fire({
                                            title: 'Tài khoản hoặc mật khẩu không đúng!',
                                            icon: 'error',
                                            confirmButtonColor: '#e74c3c',
                                            confirmButtonText: 'Ok'
                                        }).then(() => props.toggleLogin())
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
                                    <button type="submit" onClick={props.toggleLogin} disabled={!(formikProps.isValid && formikProps.dirty)} className="btn btn-danger m-2">ĐĂNG NHẬP</button>
                                    <Button onClick={props.toggleLogin}>Huỷ</Button>
                                </div>

                            </Form>
                        }} />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        toggle: state.dialogReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLogin: () => {
            dispatch(toggleLogin())
        },
        login: (user) => {
            dispatch(login(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);