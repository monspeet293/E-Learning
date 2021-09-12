import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'formik';
import React from 'react';
import { withRouter } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const Admin = (props) => {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const role = !!user ? user.maLoaiNguoiDung : -1


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const goToRoute = (index) => {
        switch (index) {
            case 0:
                props.history.push('/');
                break;
            case 1:
                props.history.push('/admin/courselist');
                break;
            case 2:
                props.history.push('/admin/studentlist');
                break;
            case 3:
                props.history.push('/admin/teacherlist');
                break;
            case 4:
                props.history.push('/admin/unapprovedlist ');
                break;
            case 5:
                props.history.push('/admin/statistic');
                break;
            default:
                break;
        }
    }

    const goToRouteGV = (index) => {
        switch (index) {
            case 0:
                props.history.push('/');
                break;
            case 1:
                props.history.push('/admin/addcourse');
                break;
            case 2:
                props.history.push('/admin/mycourselist');
                break;
            default:
                break;
        }
    }

    console.log(role);
    console.log(!(role === 'GV'));
    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <List>
                <h4>ADMIN</h4>
                {['TRANG CHỦ', 'DANH SÁCH KHOÁ HỌC', 'DANH SÁCH HỌC VIÊN', 'DANH SÁCH GIẢNG VIÊN', 'KHÓA HỌC CHƯA DUYỆT', 'THỐNG KÊ'].map((text, index) => (
                    <ListItem button index={index} key={index} disabled={(role === 'GV')} onClick={() => { goToRoute(index) }}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const drawerGV = (
        <div>
            <div className={classes.toolbar} />
            <List>
                <h4 >GIẢNG VIÊN</h4>
                {['TRANG CHỦ', 'THÊM KHOÁ HỌC', 'KHÓA HỌC CỦA TÔI'].map((text, index) => (
                    <ListItem button index={index} key={index} disabled={(role === 'AD')} onClick={() => { goToRouteGV(index) }}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        E-Learning TTTN
                        {
                            (role === 'AD') ? " - ADMIN" : ((role === 'GV') ? " - Giảng viên: " + user.hoTen : null)
                        }
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {
                            (role === 'AD') ? drawer : ((role === 'GV') ? drawerGV : -1)
                        }

                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {
                            (role === 'AD') ? drawer : ((role === 'GV') ? drawerGV : null)
                        }
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
        </div>
    );
};



export default (withRouter(Admin));