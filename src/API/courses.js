import axios from 'axios';

const api = axios.create({
    // baseURL: "https://courseserver.herokuapp.com/api/QuanlyKhoaHoc/"
    baseURL: 'http://localhost:3005/api/QuanlyKhoaHoc/'
});

export default api;