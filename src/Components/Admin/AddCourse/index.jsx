import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import apiCourse from '../../../API/courses';
import { connect } from 'react-redux';
import { getCourseDetail } from '../../../Redux/Actions/courses';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import InputAddLesson from './InputAddLesson';

const getSteps = () => {
    return ['Thêm khoá học', 'Thêm bài học'];
}

const AddCourse = (props) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [lessonInput, setLessonInput] = React.useState([{ tieuDe: '', linkVideo: '' }]);
    const steps = getSteps();

    useEffect(() => {
        props.getCourseDetail(JSON.parse(localStorage.getItem('idCourse')))
    }, [])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    const userLocalStorage = localStorage.getItem("user");
    const userLocalStorageParse = JSON.parse(userLocalStorage);

    const AddCourseSchema = yup.object().shape({
        tenKhoaHoc: yup.string().required('* Không được bỏ trống!'),
        moTa: yup.string().required('* Không được bỏ trống!'),
        hinhAnh: yup.string().required('* Không được bỏ trống!'),
        taiKhoanNguoiTao: yup.string(),
        maDanhMuc: yup.string().ensure().required('* Không được bỏ trống!'),
        giaTien: yup.string().required('* Không được bỏ trống!').matches(/([0-9])\b/, '* Số tiền không đúng định dạng!'),
    })

    const addLessonInput = () => {
        setLessonInput([...lessonInput, { tieuDe: '', linkVideo: '' }])
    }

    const doneAddCourse = () => {
        apiCourse
            .post(`ThemBaiHocVaoMucLuc?_id=${props.courseDetail._id}`)
            .then(() => {
                Swal.fire({
                    title: 'Đã hoàn thành cập nhật mục lục!',
                    icon: 'success',
                    confirmButtonColor: '#e74c3c',
                    confirmButtonText: 'Ok',
                }).then(() => { props.history.push('/admin/mycourselist') })
            })
    }

    const removeLessonInput = (i) => {
        let lessonInputCopy = [...lessonInput];
        lessonInputCopy.splice(i, 1);
        setLessonInput(lessonInputCopy);
    }

    return (
        <div className="addCourse_wrapper container">
            <Stepper className="mb-3" activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 ? (
                <Formik
                    initialValues={{
                        tenKhoaHoc: '',
                        moTa: '',
                        hinhAnh: '',
                        taiKhoanNguoiTao: userLocalStorageParse.hoTen,
                        maDanhMuc: '',
                        giaTien: '',
                        ownerId: userLocalStorageParse._id,
                        status: 'CD',
                        enrolledId: [],
                    }}
                    validationSchema={AddCourseSchema}
                    onSubmit={values => {
                        console.log(values.enrolledId.length);
                        if (values.enrolledId.length < 1) {
                            values.enrolledId.push(userLocalStorageParse._id)
                        }
                        console.log(values);
                        apiCourse
                            .post("ThemKhoaHoc", values)
                            .then((result) => {
                                Swal.fire({
                                    icon: "success",
                                    title: "Thêm khoá học thành công",
                                    confirmButtonColor: '#e74c3c',
                                    confirmButtonText: 'Ok'
                                })
                                    .then(() => localStorage.setItem('idCourse', JSON.stringify(result.data.data._id)))
                                    .then(() => props.getCourseDetail(JSON.parse(localStorage.getItem('idCourse'))))
                                    .then(() => handleNext())
                            })
                            .catch((err) => {
                                Swal.fire({
                                    title: err.response.data.message,
                                    icon: 'error',
                                    confirmButtonColor: '#e74c3c',
                                    confirmButtonText: 'Ok'
                                })
                            })
                    }}
                    render={(formikProps) => {
                        return <Form >
                            <div className="form-group">
                                <label htmlFor="tenKhoaHoc">Tên khoá học: </label>
                                <Field id="tenKhoaHoc" type="text" className="form-control" name="tenKhoaHoc" onChange={formikProps.handleChange} />
                                <ErrorMessage name="tenKhoaHoc">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label htmlFor="moTa">Mô tả: </label>
                                <Field id="moTa" type="text" className="form-control" name="moTa" onChange={formikProps.handleChange} />
                                <ErrorMessage name="moTa">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label htmlFor="hinhAnh">Hình ảnh: </label>
                                <Field id="hinhAnh" type="text" className="form-control" name="hinhAnh" onChange={formikProps.handleChange} />
                                <ErrorMessage name="hinhAnh">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label htmlFor="taiKhoanNguoiTao">Họ tên người tạo: </label>
                                <Field id="taiKhoanNguoiTao" type="text" className="form-control" name="taiKhoanNguoiTao" readOnly value={userLocalStorageParse.hoTen} />
                                <ErrorMessage name="taiKhoanNguoiTao">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label htmlFor="maDanhMuc">Mã danh mục: </label>
                                {/* <Field id="maDanhMuc" type="text" className="form-control" name="maDanhMuc" onChange={formikProps.handleChange} /> */}
                                <Field as="select" name="maDanhMuc" className="form-control">
                                    <option value="">Chọn mã danh mục...</option>
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Design">Design</option>
                                </Field>
                                <ErrorMessage name="maDanhMuc">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label htmlFor="giaTien">Giá tiền: </label>
                                <Field id="giaTien" type="text" className="form-control" name="giaTien" onChange={formikProps.handleChange} />
                                <ErrorMessage name="giaTien">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="text-center">
                                <button type="submit" disabled={!(formikProps.isValid && formikProps.dirty)} className="btn btn-danger m-2">THÊM KHOÁ HỌC</button>
                                <Button onClick={formikProps.handleReset}>ĐẶT LẠI</Button>
                            </div>
                        </Form>
                    }} />
            ) : (
                <div className="addLesson_wrapper">
                    <button className="btn btn-success text-center btnAddLesson mb-4" onClick={addLessonInput}>THÊM BÀI HỌC</button>
                    {lessonInput.map((item, index) => {
                        return (
                            <div key={index} index={index} className="addLesson_content_wrapper">
                                <InputAddLesson id={index} idCourse={props.courseDetail && props.courseDetail._id} item={item} />
                                <div className="addLesson_btnCancel">
                                    <button className="btn btn-danger btnRemoveLessonInput" onClick={() => removeLessonInput(index)}>HUỶ</button>
                                </div>
                            </div>
                        )
                    })}
                    <button className="btn btn-danger text-center btnComplete mt-4" onClick={doneAddCourse}>HOÀN THÀNH</button>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        courseDetail: state.courseDetailReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCourseDetail: (_id) => {
            dispatch(getCourseDetail(_id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCourse);