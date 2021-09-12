import axios from 'axios';

const apiUser = axios.create({
    // baseURL: 'https://courseserver.herokuapp.com/api/QuanlyNguoiDung/'
    baseURL: 'http://localhost:3005/api/QuanlyNguoiDung/'
})

export default apiUser;