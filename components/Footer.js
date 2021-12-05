import React from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Link href="./">
                <span className="cursor-pointer">
                    2021 | Designed by Tran Phuong Dinh
                </span>
            </Link>
        </footer>
    );
}
