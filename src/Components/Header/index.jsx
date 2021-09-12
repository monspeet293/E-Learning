import { Button, Menu, MenuItem } from "@material-ui/core";
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from "react-router-dom";
import logo from '../../Assets/img/logoelearning.jpg';
import userDefault from '../../Assets/img/user-default.png';
import { getCourseDetail } from '../../Redux/Actions/courses';
import { login, logout } from '../../Redux/Actions/user';
import ForgotPasswordForm from "../ForgotPasswordForm";
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

const Header = (props) => {
    const token = localStorage.getItem("token");
    const userLocalStorage = localStorage.getItem("user");
    const userLocalStorageParse = JSON.parse(userLocalStorage);

    useEffect(() => {
        if (token && userLocalStorage) {
            props.login(userLocalStorageParse);
        }
    }, [token, userLocalStorage])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [keyWord, setKeyWord] = React.useState("");
    const [searchCoursesList, setSearchCoursesList] = React.useState([]);
    const [isSearch, setIsSearch] = React.useState(false);

    const handleClickAnchorElClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseAnchorEl = () => {
        setAnchorEl(null);
    }

    const onSearchCourse = (keyWord) => {
        let searchList = props.coursesList.filter((course) => {
            return course.tenKhoaHoc.toLowerCase().indexOf(keyWord.toLowerCase()) !== -1;
        })
        if (keyWord !== "") {
            setIsSearch(true);
            setSearchCoursesList(searchList);
        }
        else {
            setIsSearch(false);
            setSearchCoursesList([]);
        }
    }

    const onChange = (e) => {
        setKeyWord(e.target.value);
        onSearchCourse(keyWord);
    }

    const gotoCourseDetail = (_id) => {
        props.history.push(`/course-detail/${_id}`);
        props.getCourseDetail(_id);
        setIsSearch(false);
        setKeyWord("");
        setSearchCoursesList([]);
    }

    const goToProfile = (_id) => {
        props.history.push(`/profile/${_id}`);
    }
    const goToMyCourseList = (_id) => {
        props.history.push(`/my-courses/${_id}`);
    }

    const renderSearchList = () => {
        if (searchCoursesList.length !== 0 && isSearch === true && keyWord !== "") {
            return <ul className="course-search-list">
                {searchCoursesList.map((course, index) => {
                    return <li onClick={() => gotoCourseDetail(course._id)} index={index} className="course-search-item">{course.tenKhoaHoc}</li>
                })}
            </ul>
        }
        else {
            return null;
        }
    }

    const renderButtonLoginAndRegister = () => {
        if (token) {
            return <div className="user">
                <Button className="btn-user" onClick={event => { handleClickAnchorElClick(event) }}>
                    <img src={props.user.avatar} alt="user image" />
                    <p>{userLocalStorageParse.hoTen}</p>
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseAnchorEl}
                    className="dropdown-user"
                >
                    <MenuItem onClick={() => { goToProfile(userLocalStorageParse._id); handleCloseAnchorEl() }}>Thông tin cá nhân</MenuItem>
                    <MenuItem onClick={() => { goToMyCourseList(userLocalStorageParse._id); handleCloseAnchorEl() }}>Khóa học của tôi</MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleCloseAnchorEl();
                            props.logout();
                            props.history.push('/');
                        }}
                    >
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </div>
        }
        else {
            return <div className="button d-flex">
                <ForgotPasswordForm />
                <LoginForm />
                <RegisterForm />
            </div>
        }
    }

    return (
        <header className="container-fluid myNavBar">
            <nav className="navbar navbar-expand-md navbar-light">
                <div className="col-xl-8 col-lg-9 col-md-8 col-sm-6">
                    <div className="row">
                        <NavLink className="navbar-brand" to="/">
                            <img src={logo} alt="Logo Udemy" />
                        </NavLink>
                        <NavLink className="myNavBar_categories" to='/all-courses'>
                            <i className="fa fa-th  mx-2" />
                            Tất cả khóa học
                        </NavLink>
                        <div className="myNavBar_search">
                            <form className="input-group ">
                                <input name="keyWord" id="keyWord" value={keyWord} type="text" className="form-control" placeholder="Tìm khóa học bạn quan tâm..." onChange={onChange} />
                                <div className="input-group-append">
                                    <span className="btn input-group-text"><i className="fa fa-search" /></span>
                                </div>
                                {renderSearchList()}
                            </form>
                        </div>
                    </div>
                    {/* END row */}
                </div>
                {/* END col-6 */}
                <div className="col-xl-4 col-lg-3 col-md-4 col-sm-4">
                    <div className="collapse navbar-collapse" id="collapsibleNavId">
                        <ul className="navbar-nav">
                            <li className="nav-item ">
                                {
                                    renderButtonLoginAndRegister()
                                }
                            </li>
                        </ul>
                    </div>
                </div>
                {/* END col-6 */}
                <button className="navbar-toggler d-lg-none col-sm-2" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
            </nav>
        </header>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.userReducer,
        coursesList: state.coursesReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user) => {
            dispatch(login(user));
        },
        logout: () => {
            dispatch(logout());
        },
        getCourseDetail: (_id) => {
            dispatch(getCourseDetail(_id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));