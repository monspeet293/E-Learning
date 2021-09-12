import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import apiCourse from '../../../../API/courses';
import { connect } from 'react-redux';
import Swal from "sweetalert2";

const InputAddLesson = (props) => {
    const addLessonSchema = yup.object().shape({
        tieuDe: yup.string().required('* Không được bỏ trống!'),
        linkVideo: yup.string().required('* Không được bỏ trống!'),
    })
    let success = false;
    return (
        <Formik
            enableReinitialize
            initialValues={{
                tieuDe: '',
                linkVideo: '',
            }}
            validationSchema={addLessonSchema}
            onSubmit={values => {
                apiCourse
                    .post("ThemBaiHoc", values, {
                        params: { _id: props.courseDetail._id }
                    })
                    .then(() => { success = true })
                    .then(() => {
                        //success = true;
                        Swal.fire({
                            title: 'Thêm thành công! Muốn thêm bài học tiếp hãy chọn nút THÊM BÀI HỌC, muốn hoàn thành cập nhật mục lục chọn nút HOÀN THÀNH',
                            icon: 'success',
                            confirmButtonColor: '#e74c3c',
                            confirmButtonText: 'Ok',
                        })
                        // .then(() => { success = true })
                    })
            }}
            render={(formikProps) => {
                return <Form>
                    <div className="form-group addLesson_title">
                        <label htmlFor="tieuDe">Tiêu đề: </label>
                        <Field id="tieuDe" type="text" className="form-control" name="tieuDe" onChange={formikProps.handleChange} />
                        <ErrorMessage name="tieuDe">
                            {(msg) => <div className="alert alert-danger">{msg}</div>}
                        </ErrorMessage>
                    </div>
                    <div className="form-group addLesson_linkVideo">
                        <label htmlFor="linkVideo">Link video: </label>
                        <Field id="linkVideo" type="text" className="form-control" name="linkVideo" onChange={formikProps.handleChange} />
                        <ErrorMessage name="linkVideo">
                            {(msg) => <div className="alert alert-danger">{msg}</div>}
                        </ErrorMessage>
                    </div>
                    <div className="addLesson_btnDone">
                        <button type="submit" disabled={!(formikProps.isValid && formikProps.dirty) || (success)} className="btn btn-success mt-3 ml-3 mr-2">XONG</button>
                    </div>
                </Form>
            }} />
    );
};

const mapStateToProps = (state) => {
    return {
        courseDetail: state.courseDetailReducer,
    }
}

export default connect(mapStateToProps, null)(InputAddLesson);