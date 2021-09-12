import React from 'react';
import { connect } from "react-redux";
import { toggleForgotPassword } from '../../Redux/Actions/dialog';
import { forgotpassword } from '../../Redux/Actions/user';
import apiUser from '../../API/user';
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from "@material-ui/core";

const ForgotPasswordForm = (props) => {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const emailSchema = yup.object().shape({
        email: yup.string().required('* Không được bỏ trống!').email('* Sai định dạng Email!'),
    })

    return (
        <React.Fragment>
            <button className="btn mr-1 btn--white" type="submit" onClick={props.toggleForgotPassword}>Quên mật khẩu</button>
            <Dialog open={props.toggle.toggleForgotPassword} onClose={props.toggle.toggleForgotPassword} aria-labelledby="form-dialog-title" fullWidth={fullWidth} maxWidth={maxWidth}>
                <DialogTitle id="form-dialog-title">QUÊN MẬT KHẨU</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={emailSchema}
                        onSubmit={values => {
                            console.log('Hello');
                            apiUser
                                .put("LayLaiMatKhau", values)
                                .then((result) => {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Mật khẩu mới đã gửi tới mail của bạn!",
                                        confirmButtonColor: '#e74c3c',
                                        confirmButtonText: 'Ok'
                                    })
                                    // .then(() => props.history.push('/'))
                                })
                                .catch((err) => {
                                    if (err.response.status === 401) {
                                        Swal.fire({
                                            title: err.response.data.message,
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
                                    <label htmlFor="email">Email: </label>
                                    <Field id="email" type="text" className="form-control" name="email" onChange={formikProps.handleChange} />
                                    <ErrorMessage name="email">
                                        {(msg) => <div className="alert alert-danger">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className="text-center">
                                    <button type="submit" onClick={props.toggleForgotPassword} disabled={!(formikProps.isValid && formikProps.dirty)} className="btn btn-danger m-2">XÁC NHẬN</button>
                                    <Button onClick={props.toggleForgotPassword}>Huỷ</Button>
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
        toggleForgotPassword: () => {
            dispatch(toggleForgotPassword())
        },
        forgotpassword: (user) => {
            dispatch(forgotpassword(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);