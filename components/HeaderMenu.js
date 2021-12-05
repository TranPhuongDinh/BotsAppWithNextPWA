import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import router from "next/router";
import Link from "next/link";

export default function HeaderMenu() {
    const menu = useRef(null);
    const items = [
        {
            label: "Log out",
            icon: "pi pi-sign-out",
            command: () => {
                router.push("/users/login");
            },
        },
    ];

    return (
        <div>
            <div className="w-full flex bg-gray-200 justify-between items-center py-2 px-4">
                <Link href="./bots">
                    <span className="text-black text-4xl font-black cursor-pointer">
                        BOTS
                    </span>
                </Link>

                <Menu model={items} popup ref={menu} id="popup_menu" />
                <Button
                    icon="pi pi-bars"
                    onClick={(event) => menu.current.toggle(event)}
                    aria-controls="popup_menu"
                    aria-haspopup
                />
            </div>
        </div>
    );
}
