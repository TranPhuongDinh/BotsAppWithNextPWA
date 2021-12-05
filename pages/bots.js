import { React, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import HeaderMenu from "../components/HeaderMenu";

import { BreadCrumb } from "primereact/breadcrumb";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

import Link from "next/link";

export default function Bots() {
    const [chatBots, setChatBots] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const toast = useRef(null);

    const onSubmit = async (data) => {
        const res = await addChatBot(data.botName);
        if (res.status == 200) {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Chatbot has been added!",
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Chatbot has not been added!",
            });
        }
        onHide("displayDialog");
        await getChatBots();
    };

    const addChatBot = async (name) => {
        const res = await axios.post("/api/chatbot", { name: name });
        return res;
    };

    const getChatBots = async () => {
        const res = await axios.get("/api/chatbot");
        if (res.status === 200) {
            setChatBots(res.data);
        } else if (res.status === 404) {
            alert("Get chatBots failed!");
            setChatBots([]);
        }
    };

    const removeChatBot = async (botId) => {
        const res = await axios.delete(`/api/chatbot/${botId}`);
        if (res.status == 200) {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Chatbot has been deleted!",
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error while deleting chatbot!",
            });
        }
        await getChatBots();
    };

    useState(getChatBots);

    const home = { icon: "pi pi-home", url: "/" };

    const [displayDialog, setDisplayDialog] = useState(false);

    const dialogFuncMap = {
        displayDialog: setDisplayDialog,
    };

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    };

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    };

    return (
        <div>
            <Toast ref={toast} />
            <HeaderMenu />
            <BreadCrumb home={home}></BreadCrumb>

            <Dialog
                header="Add new bot"
                visible={displayDialog}
                style={{ width: "50vw" }}
                onHide={() => onHide("displayDialog")}
            >
                <div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col justify-center items-end"
                    >
                        <input
                            {...register("botName", {
                                required: true,
                            })}
                            placeholder="Your bot's name"
                            className="border-2 border-solid border-gray-300 rounded-lg p-2 w-full"
                        />
                        {errors.botName && (
                            <span className="text-red-500 text-right">
                                Bot&apos;s name is required
                            </span>
                        )}

                        <div className="mt-6">
                            <Button
                                type="button"
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => onHide("displayDialog")}
                            />
                            <Button
                                type="submit"
                                label="OK"
                                icon="pi pi-check"
                                autoFocus
                            />
                        </div>
                    </form>
                </div>
            </Dialog>

            <div className="flex justify-end items-center px-4 py-4">
                <Button
                    label="Add new bot"
                    icon="pi pi-plus"
                    onClick={() => onClick("displayDialog")}
                />
            </div>

            <div className="flex justify-start flex-wrap px-4 py-4">
                {chatBots.map((bot) => {
                    return (
                        <div key={bot.id}>
                            <Card subTitle={"ID: " + bot.id} className="m-2">
                                <Link
                                    href={`/bots/chatbot/${encodeURIComponent(
                                        bot.id
                                    )}`}
                                >
                                    <h2 className="text-3xl font-black mb-4 cursor-pointer hover:text-purple-600">
                                        {bot.name}
                                    </h2>
                                </Link>
                                <Button
                                    type="button"
                                    icon="pi pi-times"
                                    className="p-button-danger"
                                    onClick={() => {
                                        removeChatBot(bot.id);
                                    }}
                                />
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
