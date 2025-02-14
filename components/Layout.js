import Header from './Header';
import Footer from './Footer';
import './../app/styles/global.css';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <div className='main-container'>
                <div className='main-card'>
                    <main>{children}</main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Layout;