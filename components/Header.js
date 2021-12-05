import React, { Component } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="./">
                <span className="text-white text-4xl font-black cursor-pointer">
                    BOTS
                </span>
            </Link>

            {/* <Link href="./users/login">
                <span className="text-white text-xl transition-all hover:underline cursor-pointer">
                    Login/Register
                </span>
            </Link> */}
        </header>
    );
}
