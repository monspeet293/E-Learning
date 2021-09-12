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
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getCoursesList } from '../../../Redux/Actions/courses';
import apiCourse from '../../../API/courses';
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import drilldown from 'highcharts/modules/drilldown';
import courseApi from "../../../API/courseApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from '@material-ui/icons/Search';



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
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
                Thống kê số lượng sinh viên đăng ký
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



const Statistic = (props) => {
    const rows = props.courseList;
    const classes = useStyles();
    // const [order, setOrder] = React.useState('asc');
    // const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);
    const [stt, setStt] = React.useState({ Frontend: 0, Backend: 0, Mobile: 0, Design: 0 });
    const [sttDetail, setSttDetail] = React.useState({ Frontend: [], Backend: [], Mobile: [], Design: [] });

    useEffect(() => {
        props.getCoursesList();
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const resultFE = await courseApi.getNumStudentCategory({ maDanhMuc: 'Frontend' });
                const resultBE = await courseApi.getNumStudentCategory({ maDanhMuc: 'Backend' });
                const resultMb = await courseApi.getNumStudentCategory({ maDanhMuc: 'Mobile' });
                const resultDs = await courseApi.getNumStudentCategory({ maDanhMuc: 'Design' });
                let temStt = { ...stt }

                temStt = { ...temStt, Frontend: resultFE.data, Backend: resultBE.data, Mobile: resultMb.data, Design: resultDs.data }
                const resultFEDetail = await courseApi.getNumStudentCategoryDetail({ maDanhMuc: 'Frontend' });
                const resultBEDetail = await courseApi.getNumStudentCategoryDetail({ maDanhMuc: 'Backend' });
                const resultMbDetail = await courseApi.getNumStudentCategoryDetail({ maDanhMuc: 'Mobile' });
                const resultDsDetail = await courseApi.getNumStudentCategoryDetail({ maDanhMuc: 'Design' });
                let temSttDetail = { ...sttDetail }
                temSttDetail = { ...temSttDetail, Frontend: resultFEDetail.data, Backend: resultBEDetail.data, Mobile: resultMbDetail.data, Design: resultDsDetail.data }

                //console.log({ maDanhMuc: 11 })
                console.log(resultFEDetail.data);
                setStt(temStt)
                setSttDetail(temSttDetail)

            } catch (error) {
                console.log(error);
            }
        })
            ()
    }, [])

    // const handleRequestSort = (event, property) => {
    //     const isAsc = orderBy === property && order === 'asc';
    //     setOrder(isAsc ? 'desc' : 'asc');
    //     setOrderBy(property);
    // };

    // const handleSelectAllClick = (event) => {
    //     if (event.target.checked) {
    //         const newSelecteds = rows.map((n) => n.name);
    //         setSelected(newSelecteds);
    //         return;
    //     }
    //     setSelected([]);
    // };

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    const getDayMonthYear = (time) => {
        const d = new Date(time);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        return [day, month, year].join('/');
    }





    // const numStudentOfCategory = async (maDanhMuc) => {
    //     //console.log(maDanhMuc)
    //     try {
    //         const result = await courseApi.getNumStudentCategory({ maDanhMuc: maDanhMuc });
    //         console.log({ maDanhMuc: maDanhMuc })
    //         console.log(result.data);
    //         setStt(result.data)

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const [startDate, setStartDate] = React.useState(new Date());
    // const [endDate, setEndDate] = React.useState(new Date());
    // const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
    //     <button className="example-custom-input" onClick={onClick} ref={ref}>
    //         {value}
    //     </button>

    // ));


    drilldown(Highcharts);
    const option = {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Số học viên đăng ký'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                }
            }
        },
        series: [
            {
                name: 'Browsers',
                colorByPoint: true,
                data: [
                    {
                        name: "Frontend",
                        y: stt.Frontend,
                        drilldown: "Frontend"
                    },
                    {
                        name: "Backend",
                        y: stt.Backend,
                        drilldown: "Backend"
                    },
                    {
                        name: "Mobile",
                        y: stt.Mobile,
                        drilldown: "Mobile"
                    },
                    {
                        name: "Design",
                        y: stt.Design,
                        drilldown: "Design"
                    }
                ]
            }
        ],
        drilldown: {
            series: [
                {
                    name: "Học viên",
                    id: "Frontend",
                    data: sttDetail.Frontend
                },
                {
                    name: "Học viên",
                    id: "Backend",
                    data: sttDetail.Backend
                },
                {
                    name: "Học viên",
                    id: "Mobile",
                    data: sttDetail.Mobile
                },
                {
                    name: "Học viên",
                    id: "Design",
                    data: sttDetail.Design
                }
            ]
        }
    };

    const [dateRange, setDateRange] = React.useState([null, null]);
    const [startDate, endDate] = dateRange;

    return (
        <div className={classes.root, "mt-5"}>
            <Paper className={classes.paper, "container"}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    {/* <p>Chọn ngày
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                setDateRange(update);
                            }}
                            withPortal
                        />
                        {console.log(startDate)}
                        {console.log(endDate)}
                        <Button size="small" variant="contained" color="primary" startIcon={<SearchIcon />} >Duyệt</Button>
                    </p> */}
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <TableBody>
                            <HighchartsReact highcharts={Highcharts} options={option} />
                        </TableBody>
                    </Table>
                </TableContainer>

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

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);