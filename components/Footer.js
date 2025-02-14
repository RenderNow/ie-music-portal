import styles from '../styles/footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} My Website. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;