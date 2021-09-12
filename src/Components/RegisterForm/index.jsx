import React from 'react';
import { connect } from 'react-redux';
import apiUser from '../../API/user';
import Swal from "sweetalert2";
import { register } from '../../Redux/Actions/user';
import { toggleRegister } from '../../Redux/Actions/dialog';
import { Formik, Form, Field, ErrorMessage, FieldArray, FastField } from 'formik';
import * as yup from 'yup';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from "@material-ui/core";

const RegisterForm = (props) => {
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const registerSchema = yup.object().shape({
        hoTen: yup.string().required('* Không được bỏ trống!'),
        taiKhoan: yup.string().required('* Không được bỏ trống!'),
        matKhau: yup.string().required('* Không được bỏ trống!'),
        soDienThoai: yup.string().required('* Không được bỏ trống!').matches(/(09|01|02|03|04|05|06|07|08[2|6|8|9])+([0-9]{8})\b/, '* Số điện thoại không đúng định dạng!').length(10, '* Số điện thoại có tối đa 10 số!'),
        email: yup.string().required('* Không được bỏ trống!').email('* Sai định dạng Email!'),
        maLoaiNguoiDung: yup.string().ensure().required('* Không được bỏ trống!'),
    })

    return (
        <React.Fragment>
            <button className="btn btn--red" type="submit" onClick={props.toggleRegister}>Đăng ký</button>
            <Dialog open={props.toggle.toggleRegister} onClose={props.toggle.toggleRegister} aria-labelledby="form-dialog-title" fullWidth={fullWidth} maxWidth={maxWidth}>
                <DialogTitle id="form-dialog-title">ĐĂNG KÝ</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            hoTen: '',
                            taiKhoan: '',
                            matKhau: '',
                            soDienThoai: '',
                            email: '',
                            maLoaiNguoiDung: '',
                        }}
                        validationSchema={registerSchema}
                        onSubmit={values => {
                            apiUser
                                .post("DangKy", values)
                                .then((result) => {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Đăng ký thành công",
                                        confirmButtonColor: '#feda6a',
                                        confirmButtonText: 'Ok'
                                    })
                                })
                                .catch((err) => {
                                    if (err.response.status === 401)
                                        Swal.fire({
                                            title: err.response.data.message,
                                            icon: 'error',
                                            confirmButtonColor: '#e74c3c',
                                            confirmButtonText: 'Ok'
                                        }).then(() => props.toggleRegister())
                                })
                        }}
                        render={(formikProps) => {
                            return <Form >
                                <div className="form-group">
                                    <label htmlFor="hoTen">Họ tên: </label>
                                    <Field id="hoTen" type="text" className="form-control" name="hoTen" onChange={formikProps.handleChange} />
                                    <ErrorMessage name="hoTen">
                                        {(msg) => <div className="alert alert-danger">{msg}</div>}
                                    </ErrorMessage>
                                </div>
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
                                <div className="form-group">
                                    <label htmlFor="soDienThoai">Số điện thoại: </label>
                                    <Field id="soDienThoai" type="text" className="form-control" name="soDienThoai" onChange={formikProps.handleChange} />
                                    <ErrorMessage name="soDienThoai">
                                        {(msg) => <div className="alert alert-danger">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email: </label>
                                    <Field id="email" type="email" className="form-control" name="email" onChange={formikProps.handleChange} />
                                    <ErrorMessage name="email">
                                        {(msg) => <div className="alert alert-danger">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="maLoaiNguoiDung">Vai trò: </label>
                                    {/* <Field id="maLoaiNguoiDung" type="email" className="form-control" name="maLoaiNguoiDung" onChange={formikProps.handleChange} /> */}
                                    <Field as="select" name="maLoaiNguoiDung" className="form-control">
                                        <option value="">Người dùng là...</option>
                                        <option value="HV">Học Viên</option>
                                        <option value="GV">Giảng Viên</option>
                                    </Field>
                                    <ErrorMessage name="maLoaiNguoiDung">
                                        {(msg) => <div className="alert alert-danger">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className="text-center">
                                    <button type="submit" onClick={props.toggleRegister} disabled={!(formikProps.isValid && formikProps.dirty)} className="btn btn-danger m-2">ĐĂNG KÝ</button>
                                    <Button onClick={props.toggleRegister}>Huỷ</Button>
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
        toggleRegister: () => {
            dispatch(toggleRegister());
        },
        register: (user) => {
            dispatch(register(user));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);