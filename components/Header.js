"use client"; // Ensure it runs on the client side
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOCAuth } from "@opencampus/ocid-connect-js"; // Import authentication
import styles from "../styles/header.module.css";

const Header = () => {
    const pathname = usePathname();
    const { authState, ocAuth } = useOCAuth(); // Get authentication state
    const [user, setUser] = useState({ ocId: "", ethAddress: "" });
    const [isClient, setIsClient] = useState(false);

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
            <div className={styles.logo}>
                <Link href="/dashboard">
                    <img
                        src="/iemusic_logo.png"
                        alt="Logo"
                    />
                </Link>
            </div>

            <nav className={styles.nav}>
                <ul>
                    <li className={pathname === "/dashboard" ? styles.active : ""}>
                        <Link href="/dashboard">Dashboard</Link>
                    </li>
                    <li className={pathname === "/contact" ? styles.active : ""}>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>

            {/* User Info Display */}
            {isClient && authState && (
                <div className={styles.userInfo}>
                    <p><strong>Logged in as:</strong> {user.ocId}</p>
                </div>
            )}

            <button className={styles.logout} onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
};

export default Header;
