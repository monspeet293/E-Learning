import React from 'react';
import Footer from "../Components/Footer";
import Header from "../Components/Header";

const Layout = (props) => {
    return (
        <React.Fragment>
            <Header />
            {props.children}
            <Footer />
        </React.Fragment>
    );
};

export default Layout;