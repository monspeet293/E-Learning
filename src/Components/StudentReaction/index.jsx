import React from 'react';
import Slider from "react-slick";

const StudentReaction = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return (
        <div className="student_reaction">
            <div className="student_reaction_container container">
                <h3 className="text-center">Cảm nghĩ của học viên</h3>
                <Slider {...settings}>
                    <div className="student_reaction_item">
                        <div className="student_reaction_person">
                            <div className="student_reaction_avatar">
                                <span>H</span>
                            </div>
                            <p className="student_reaction_name">Duy Udy</p>
                        </div>
                        <p className="student_reaction_comment">
                            Khóa học rất bổ ích và phù hợp!
                        </p>
                    </div>

                    <div className="student_reaction_item">
                        <div className="student_reaction_person">
                            <div className="student_reaction_avatar ava1">
                                <img src="./img/person1.jpg" alt="" />
                            </div>
                            <p className="student_reaction_name">Tửu Lượng</p>
                        </div>
                        <p className="student_reaction_comment">
                            Thầy cô dạy dễ hiểu!
                        </p>
                    </div>

                    <div className="student_reaction_item">
                        <div className="student_reaction_person">
                            <div className="student_reaction_avatar ava2">
                                <img src="./img/person2.jpg" alt="" />
                            </div>
                            <p className="student_reaction_name">Du Học Sinh</p>
                        </div>
                        <p className="student_reaction_comment">
                            Rất tốt!
                        </p>
                    </div>

                    <div className="student_reaction_item">
                        <div className="student_reaction_person">
                            <div className="student_reaction_avatar ava3">
                                <img src="./img/person4.jpg" alt="" />
                            </div>
                            <p className="student_reaction_name">Trần Dần</p>
                        </div>
                        <p className="student_reaction_comment">
                            Khóa học hay!
                        </p>
                    </div>

                    <div className="student_reaction_item">
                        <div className="student_reaction_person">
                            <div className="student_reaction_avatar ava4">
                                <img src="./img/person5.jpg" alt="" />
                            </div>
                            <p className="student_reaction_name">Khá Bảnh</p>
                        </div>
                        <p className="student_reaction_comment">
                            Thầy cô xinh quá!
                        </p>
                    </div>

                    <div className="student_reaction_item">
                        <div className="student_reaction_person">
                            <div className="student_reaction_avatar">
                                <span>D</span>
                            </div>
                            <p className="student_reaction_name">Khắc Duy</p>
                        </div>
                        <p className="student_reaction_comment">
                            Wowwwww!
                        </p>
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default StudentReaction;