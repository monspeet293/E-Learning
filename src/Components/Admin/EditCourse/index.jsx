import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Swal from "sweetalert2";
import apiCourse from '../../../API/courses';
import { connect } from 'react-redux';
import { getCourseDetail } from '../../../Redux/Actions/courses';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import EditLesson from './EditLesson';


const EditCourse = (props) => {
    useEffect(() => {
        props.getCourseDetail(props.match.params._id);
    }, [])

    const courseSchema = yup.object().shape({
        tenKhoaHoc: yup.string().required('* Không được bỏ trống!'),
        moTa: yup.string().required('* Không được bỏ trống!'),
        hinhAnh: yup.string().required('* Không được bỏ trống!'),
        taiKhoanNguoiTao: yup.string().required('* Không được bỏ trống!'),
        maDanhMuc: yup.string(),
        giaTien: yup.string().required('* Không được bỏ trống!').matches(/([0-9])\b/, '* Số tiền không đúng định dạng!'),
    })

    //Moi them
    const getSteps = () => {
        return ['Sửa khoá học', 'Sửa bài học'];
    }

    const [activeStep, setActiveStep] = React.useState(0);
    const [lessonInput, setLessonInput] = React.useState([{ tieuDe: '', linkVideo: '' }]);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

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
                }).then(() => { props.history.push('/admin') })
            })
    }

    const removeLessonInput = (i) => {
        let lessonInputCopy = [...lessonInput];
        lessonInputCopy.splice(i, 1);
        setLessonInput(lessonInputCopy);
    }

    //

    return (
        <div className="addCourse_wrapper container">
            {/* <Typography className="text-center" variant="h4" id="tableTitle" component="div">
                Sửa khoá học
            </Typography> */}
            <Stepper className="mb-3" activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 ? (
                <Formik
                    enableReinitialize
                    initialValues={{
                        tenKhoaHoc: props.courseDetail && props.courseDetail.tenKhoaHoc,
                        moTa: props.courseDetail && props.courseDetail.moTa,
                        hinhAnh: props.courseDetail && props.courseDetail.hinhAnh,
                        taiKhoanNguoiTao: props.courseDetail && props.courseDetail.taiKhoanNguoiTao,
                        maDanhMuc: props.courseDetail && props.courseDetail.maDanhMuc,
                        giaTien: props.courseDetail && props.courseDetail.giaTien,
                    }}
                    validationSchema={courseSchema}
                    onSubmit={values => {
                        apiCourse
                            .put(`SuaKhoaHoc?_id=${props.courseDetail._id}`, values)
                            .then(() => {
                                Swal.fire({
                                    title: 'Hoàn thành!',
                                    icon: 'success',
                                    confirmButtonColor: '#e74c3c',
                                    confirmButtonText: 'Ok',
                                })
                                    //.then(() => props.history.push('/admin'))
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
                        return <Form>
                            <div className="form-group">
                                <label htmlFor="id">ID: </label>
                                <Field id="id" type="text" className="form-control" name="id" readOnly value={props.courseDetail._id} />
                                <ErrorMessage name="id">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
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
                                <label htmlFor="taiKhoanNguoiTao">Giảng viên: </label>
                                <Field id="taiKhoanNguoiTao" type="text" className="form-control" name="taiKhoanNguoiTao" readOnly onChange={formikProps.handleChange} />
                                <ErrorMessage name="taiKhoanNguoiTao">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label htmlFor="maDanhMuc">Mã danh mục: </label>
                                <Field as="select" name="maDanhMuc" className="form-control" placeholder={props.courseDetail && props.courseDetail.maDanhMuc} onChange={formikProps.handleChange}>
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
                                <label htmlFor="moTa">Giá tiền: </label>
                                <Field id="giaTien" type="text" className="form-control" name="giaTien" onChange={formikProps.handleChange} />
                                <ErrorMessage name="giaTien">
                                    {(msg) => <div className="alert alert-danger">{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <div className="text-center">
                                <Button variant="contained" color="primary" type="submit" disabled={!(formikProps.isValid)}>HOÀN THÀNH</Button>
                            </div>
                        </Form>
                    }} />
            ) : (
                <div className="addLesson_wrapper">
                    <button className="btn btn-success text-center btnAddLesson mb-4" onClick={addLessonInput}>THÊM BÀI HỌC</button>
                    {lessonInput.map((item, index) => {
                        return (
                            <div key={index} index={index} className="addLesson_content_wrapper">
                                <EditLesson id={index} idCourse={props.courseDetail && props.courseDetail._id} item={item} />
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
            dispatch(getCourseDetail(_id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCourse);