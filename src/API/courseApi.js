import axiosClient from "./axiosClient";


const courseApi = {
    async getCourseByID(data) {
        const url = '/QuanlyKhoaHoc/DanhSachKhoaHocTheoSV';

        return await axiosClient.get(url, { params: data });
    },
    async getCourseByOwnerId(data) {
        const url = '/QuanlyKhoaHoc/DanhSachKhoaHocTheoGV';

        return await axiosClient.get(url, { params: data });
    },
    async getCourseUnapproved(data) {
        const url = '/QuanlyKhoaHoc/DanhSachKhoaHocChuaDuyet';

        return await axiosClient.get(url, { params: data });
    },
    async payment(data) {
        const url = '/QuanlyKhoaHoc/MuaKhoaHoc';

        return await axiosClient.post(url, data)
    },
    async getNumStudentCategory(data) {
        const url = `/QuanlyKhoaHoc/ThongKeTheoDanhMuc?maDanhMuc=${data.maDanhMuc}`;

        return await axiosClient.get(url)
    },
    async getNumStudentCategoryDetail(data) {
        const url = `/QuanlyKhoaHoc/ThongKeTungKhoaHocTheoDanhMuc?maDanhMuc=${data.maDanhMuc}`;

        return await axiosClient.get(url)
    }
}

export default courseApi