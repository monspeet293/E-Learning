import { Field, Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import apiUser from '../../API/user';
import Swal from "sweetalert2";
import { uploadAvatar, logout } from '../../Redux/Actions/user';

const Profile = (props) => {
    const [avatar, setAvatar] = useState(props.user.avatar);

    const userLocalStorage = localStorage.getItem("user");
    const userLocalStorageParse = JSON.parse(userLocalStorage);

    useEffect(() => {
        if (userLocalStorage)
            setAvatar(userLocalStorageParse.avatar)
    }, [])

    // const profileSchema = yup.object().shape({
    //     matKhau: yup.string().required(),
    // })   

    const getDayMonthYear = (time) => {
        const d = new Date(time);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        return [day, month, year].join('/');
    }

    const handleChangeImage = (event) => {
        setAvatar(URL.createObjectURL(event.target.files[0]));
        const formData = new FormData();
        formData.append("avatar", event.target.files[0]);
        props.uploadAvatar(props.user._id, formData)
    }

    return (
        <div className="profile_container">
            <div className="card_wrap container">
                <div className="card container-fluid">
                    <div className="card-body">
                        <Formik
                            initialValues={{
                                matKhau: '',
                            }}
                            // validationSchema={profileSchema}
                            onSubmit={values => {
                                apiUser
                                    .put(`DoiMatKhau?_id=${props.user._id}`, values)
                                    .then((result) => {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Bạn đã đổi mật khẩu thành công",
                                            confirmButtonColor: '#e74c3c',
                                            confirmButtonText: 'Ok'
                                        }).then(() => props.logout())
                                            .then(() => props.history.push('/'))
                                    })
                                    .catch((err) => {
                                        if (err.response.status === 400) {
                                            Swal.fire({
                                                title: 'Bạn đã đổi mật khẩu thất bại',
                                                icon: 'error',
                                                confirmButtonColor: '#e74c3c',
                                                confirmButtonText: 'Ok'
                                            })
                                        }
                                    })
                            }}
                            render={(formikProps) => {
                                return <Form >
                                    <div className="profile_avatar">
                                        <label className="profile_avatar_label" style={{ backgroundImage: `url(${avatar})`, width: "90px", height: "90px" }}>
                                            <input name="avatar" id="avatar" type="file" className="profile_avatar_input" onChange={(event) => handleChangeImage(event)} />
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="hoTen">Họ tên: </label>
                                        <Field id="hoTen" type="text" className="form-control" name="hoTen" readOnly value={props.user.hoTen} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="taiKhoan">Tài khoản: </label>
                                        <Field id="taiKhoan" type="text" className="form-control" name="taiKhoan" readOnly value={props.user.taiKhoan} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="soDienThoai">Số điện thoại: </label>
                                        <Field id="soDienThoai" type="text" className="form-control" name="soDT" readOnly value={props.user.soDienThoai} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email: </label>
                                        <Field id="email" type="email" className="form-control" name="email" readOnly value={props.user.email} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="maLoaiNguoiDung">Mã loại người dùng: </label>
                                        <Field id="maLoaiNguoiDung" type="text" className="form-control" name="maLoaiNguoiDung" readOnly value={props.user.maLoaiNguoiDung} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ngayTao">Ngày tham gia: </label>
                                        <Field id="ngayTao" type="text" className="form-control" name="ngayTao" readOnly value={getDayMonthYear(props.user.ngayTao)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="matKhau">Mật khẩu: </label>
                                        <Field id="matKhau" type="password" className="form-control matKhau" name="matKhau" placeholder="Mật khẩu mới" onChange={formikProps.handleChange} />
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            // disabled={!(formikProps.isValid && formikProps.dirty)}
                                            className="btn btn-primary m-2"
                                        >
                                            LƯU
                                            </button>
                                    </div>
                                </Form>
                            }} />
                    </div>
                </div>
            </div>
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
        uploadAvatar: (_id, formData) => {
            dispatch(uploadAvatar(_id, formData))
        },
        logout: () => {
            dispatch(logout());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);