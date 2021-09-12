import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import apiCourse from '../../../API/courses';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCoursesList } from '../../../Redux/Actions/courses';
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import courseApi from '../../../API/courseApi';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: '_id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'tenKhoaHoc', numeric: false, disablePadding: false, label: 'Tên khoá học' },
    { id: 'taiKhoanNguoiTao', numeric: false, disablePadding: false, label: 'Giảng viên' },
    { id: 'maDanhMuc', numeric: false, disablePadding: false, label: 'Mã danh mục' },
    { id: 'ngayTao', numeric: false, disablePadding: false, label: 'Ngày tạo' },
    { id: 'status', numeric: false, disablePadding: false, label: 'Trạng thái' },
    { id: 'xoaKhoaHoc', numeric: false, disablePadding: false, label: '' },
    { id: 'suaKhoaHoc', numeric: false, disablePadding: false, label: '' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    //const user = JSON.parse(localStorage.getItem("user"));
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Danh sách khoá học của tôi
            </Typography>
            <Link to='/admin/addcourse'><Button className="addCourseBtn" size="small" variant="contained" color="primary" startIcon={<CloudUploadIcon />} style={{ width: '150px', height: '42px', marginTop: '15px', marginRight: '8px', fontSize: '12px' }}>THÊM KHOÁ HỌC</Button></Link>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const TeacherCourseList = (props) => {
    //const rows = props.courseList;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const user = JSON.parse(localStorage.getItem("user"));
    const [coursesList, setCoursesList] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    //console.log(user._id);


    // useEffect(() => {
    //     props.getCoursesList();
    // }, [])

    useEffect(() => {
        (async () => {
            try {
                //console.log(user._id)
                const rs = await courseApi.getCourseByOwnerId({ _id: user._id });
                console.log(rs)
                setCoursesList(rs.data);
            } catch (error) {
                console.log('false to fetch  list transfer :', error);
            }
            setLoading(false);
        })();
    }, [user._id]);

    console.log(coursesList);
    const rows = coursesList;

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getDayMonthYear = (time) => {
        const d = new Date(time);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        return [day, month, year].join('/');
    }


    const deleteCourse = (_id, enrolledId) => {
        console.log(_id);
        console.log(enrolledId.length);
        Swal.fire({
            title: 'Bạn có chắc muốn xoá?',
            icon: 'warning',
            confirmButtonColor: '#e74c3c',
            confirmButtonText: 'Ok',
            showCancelButton: true
        }).then((result) => {
            if (result.value) {
                if (enrolledId.length === 1) {
                    apiCourse
                        .delete(`XoaKhoaHoc?_id=${_id}`)
                        .then(() => {
                            Swal.fire({
                                title: 'Đã xoá khoá học thành công!',
                                icon: 'success',
                                confirmButtonColor: '#e74c3c',
                                confirmButtonText: 'Ok',
                            })
                                .then(() => props.getCoursesList())
                                .then(() => { props.history.push('/admin/mycourselist') })
                        })
                }
                else {
                    Swal.fire({
                        title: 'Môn học này đã có người mua!',
                        icon: 'warning',
                        confirmButtonColor: '#e74c3c',
                        confirmButtonText: 'Ok',
                    }).then(() => { props.history.push('/admin/mycourselist') })
                }
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                return;
            }
        })
    }

    const editCourse = (_id) => {
        props.history.push(`/admin/editcourse/${_id}`)
    }
    const editLesson = (_id) => {
        props.history.push(`/admin/editlesson/${_id}`)
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root, "mt-5"}>
            <Paper className={classes.paper, "container"}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell align="left">{row._id}</TableCell>
                                            <TableCell align="left">{row.tenKhoaHoc}</TableCell>
                                            <TableCell align="left">{row.taiKhoanNguoiTao}</TableCell>
                                            <TableCell align="left">{row.maDanhMuc}</TableCell>
                                            <TableCell align="left">{getDayMonthYear(row.ngayTao)}</TableCell>
                                            <TableCell align="left">{row.status}</TableCell>
                                            <TableCell align="left"><Button size="small" variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => { deleteCourse(row._id, (row.enrolledId)) }}>Xoá</Button></TableCell>
                                            <TableCell align="left"><Button size="small" variant="contained" color="default" startIcon={<SaveIcon />} onClick={() => { editCourse(row._id) }}>Sửa</Button></TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    labelRowsPerPage="Số khoá học mỗi trang"
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        courseList: state.coursesReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCoursesList: () => {
            dispatch(getCoursesList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeacherCourseList);