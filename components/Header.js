"use client"; // Ensure it runs on the client side
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOCAuth } from "@opencampus/ocid-connect-js"; // Import authentication
import styles from "../styles/header.module.css";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for mobile menu

const Header = () => {
    const pathname = usePathname();
    const { authState, ocAuth } = useOCAuth(); // Get authentication state
    const [user, setUser] = useState({ ocId: "", ethAddress: "" });
    const [isClient, setIsClient] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu

    useEffect(() => {
        setIsClient(true);
        if (authState) {
            setUser({
                ocId: authState.OCId || "No ID Available",
                ethAddress: authState.ethAddress || "No Wallet Address",
            });
        }
    }, [authState]);

    // Logout function
    const handleLogout = async () => {
        try {
            await ocAuth.logout();
            document.cookie = "ocid_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.clear();
            sessionStorage.clear();
            window.open("https://auth.staging.opencampus.xyz/login?new_session=true", "_blank");
            window.location.href = "/";
        } catch (error) {
            console.error("❌ Logout Error:", error);
        }
    };

    return (
        <header className={styles.header}>
            {/* Left side: Logo and user info */}
            <div className={styles.leftContainer}>
                <div className={styles.logo}>
                    <Link href="/dashboard">
                        <img src="/iemusic_logo_light.png" alt="Logo" />
                    </Link>
                </div>
                {isClient && authState && (
                    <div className={styles.userInfo}>
                        <div className="p2">
                            <strong>Logged in as:</strong>{" "}
                            <span className={styles.ocid}>{user.ocId}</span>
                        </div>
                        <div className={styles.dropdown}>
                            <div className="p2"><strong>ETH Address:</strong> {user.ethAddress}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div className={styles.mobileMenuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
            </div>

            {/* Center: Navigation */}
            <nav className={`${styles.nav} ${menuOpen ? styles.mobileNavOpen : ""}`}>
                <ul>
                    <li className={pathname === "/dashboard" ? styles.active : ""}>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li className={pathname === "/contact" ? styles.active : ""}>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>

            {/* Right: Logout button */}
            <button className={styles.logout} onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
};

export default Header;

