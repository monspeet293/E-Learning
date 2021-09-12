import React, { useEffect } from 'react';
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
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import apiUser from '../../../API/user';
import { getStudentList } from '../../../Redux/Actions/user';
import Swal from "sweetalert2";
import { useState } from "react";

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
    { id: 'hoTen', numeric: false, disablePadding: false, label: 'Họ tên' },
    { id: 'taiKhoan', numeric: false, disablePadding: false, label: 'Tài khoản' },
    { id: 'soDienThoai', numeric: false, disablePadding: false, label: 'Số điện thoại' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'ngayTao', numeric: false, disablePadding: false, label: 'Ngày tạo' },
    { id: 'hanhDong', numeric: false, disablePadding: false, label: '' },
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




// const onChange = (e) => {
//     setKeyWord(e.target.value);
//     onSearchCourse(keyWord);
// }


const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const [keyWord, setKeyWord] = useState("");

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Danh sách học viên
                {/* <hr></hr>
                <form className="input-group ">
                    <input name="keyWord" id="keyWord" value={keyWord} type="text" className="form-control" placeholder="Tìm kiếm..." onChange={props.handleChange} />
                    <div className="input-group-append">
                        <span className="btn input-group-text"><i className="fa fa-search" /></span>
                    </div>
                    {renderSearchList()}
                </form> */}
            </Typography>
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

const StudentList = (props) => {
    const rows = props.studentList;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    useEffect(() => {
        props.getStudentList();
    }, [])

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

    const deleteStudent = (_id) => {
        Swal.fire({
            title: 'Bạn có chắc muốn xoá?',
            icon: 'warning',
            confirmButtonColor: '#e74c3c',
            confirmButtonText: 'Ok',
            showCancelButton: true
        }).then((result) => {
            if (result.value) {
                apiUser
                    .delete(`XoaHocVien?_id=${_id}`)
                    .then(() => {
                        Swal.fire({
                            title: 'Đã xoá học viên thành công!',
                            icon: 'success',
                            confirmButtonColor: '#e74c3c',
                            confirmButtonText: 'Ok',
                        }).then(() => props.getStudentList())
                    })
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
                return;
            }
        })
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    console.log('Alo', rows.length);

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
                                            <TableCell align="left">{row.hoTen}</TableCell>
                                            <TableCell align="left">{row.taiKhoan}</TableCell>
                                            <TableCell align="left">{row.soDienThoai}</TableCell>
                                            <TableCell align="left">{row.email}</TableCell>
                                            <TableCell align="left">{getDayMonthYear(row.ngayTao)}</TableCell>
                                            <TableCell align="left"><Button size="small" variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => { deleteStudent(row._id) }}>Xoá</Button></TableCell>
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
                    labelRowsPerPage="Số học viên mỗi trang"
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
        studentList: state.studentReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStudentList: () => {
            dispatch(getStudentList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList);