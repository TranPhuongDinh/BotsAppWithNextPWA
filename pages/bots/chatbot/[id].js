import { React, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { Fieldset } from "primereact/fieldset";
import ActionProvider from "../../../bot/ActionProvider.js";
import Chatbot from "react-chatbot-kit";
import { createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { BreadCrumb } from "primereact/breadcrumb";
import { Toast } from "primereact/toast";

import HeaderMenu from "../../../components/HeaderMenu";

export default function Bot() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        register: updateRegister,
        handleSubmit: updateHandleSubmit,
        formState: { errors: updateErrors },
    } = useForm();

    const toast = useRef(null);
    const router = useRouter();
    const { id } = router.query;
    const [chatBot, setChatBot] = useState([]);
    const [updateIndex, setUpdateIndex] = useState([]);
    const [showChatbot, setShowChatbot] = useState(true);

    useEffect(() => {
        if (router.isReady) {
            getChatBot();
        }
    }, [router.isReady]);

    const getChatBot = async () => {
        const res = await axios.get(`/api/chatbot/${id}`);
        if (res.status === 200) {
            setChatBot(res.data);
        } else if (res.status === 404) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Load chatbot failed!",
            });
            setChatBot([]);
        }
    };

    class MessageParser {
        constructor(actionProvider, state) {
            this.actionProvider = actionProvider;
            this.state = state;
        }

        async getDataMessage() {
            const res = await axios.get(`/api/chatbot/${id}`);
            return res.data;
        }

        removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        async parse(message) {
            const res = await this.getDataMessage();
            message = this.removeAccents(message);

            for (let i = 0; i < res.keywords.length; i++) {
                if (
                    message.includes(
                        this.removeAccents(res.keywords[i]).toLowerCase()
                    )
                ) {
                    this.actionProvider.handleResponse(res.responses[i]);
                    return;
                }
            }

            this.actionProvider.handleResponse(
                this.removeAccents("Sorry, I don't understand")
            );
        }
    }

    const config = (name) => {
        return {
            initialMessages: [createChatBotMessage(`Hi! How can I help you?`)],
            botName: name,
            customStyles: {
                botMessageBox: {
                    backgroundColor: "#0cba69",
                },
                chatButton: {
                    backgroundColor: "#0cba69",
                },
            },
        };
    };

    const items = [{ label: "Chatbot", url: "/bots" }, { label: chatBot.name }];

    const home = { icon: "pi pi-home", url: "/" };

    const [displayDialog, setDisplayDialog] = useState(false);
    const [displayUpdateDialog, setDisplayUpdateDialog] = useState(false);

    const dialogFuncMap = {
        displayDialog: setDisplayDialog,
        displayUpdateDialog: setDisplayUpdateDialog,
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

    const removeConservation = async (index, chatBotId) => {
        const res = await axios.delete(
            `/api/chatbot/message/${index}?botId=${chatBotId}`
        );
        if (res.status == 200) {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Conservation has been removed",
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error while removing conservation",
            });
        }
        await getChatBot();
    };

    const onSubmit = async (data) => {
        const keyword = data.keyword;
        const response = data.response;
        const newConversation = {
            name: chatBot.name,
            keywords:
                chatBot.keywords.length == 0
                    ? [keyword]
                    : [...chatBot.keywords, keyword],
            responses:
                chatBot.responses.length == 0
                    ? [response]
                    : [...chatBot.responses, response],
        };
        const res = await axios.put(`/api/chatbot/${id}`, {
            ...newConversation,
        });
        if (res.status == 200) {
            if (res.data.message === "EXISTED")
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Keyword is existed!",
                });
            else {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Conversation has been added",
                });
            }
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error while adding conversation",
            });
        }
        onHide("displayDialog");
        await getChatBot();
    };

    const onSubmitUpdate = async (data) => {
        const keyword = data.keyword;
        const response = data.response;
        const newConversation = {
            keyword: keyword,
            response: response,
        };
        const res = await axios.put(
            `/api/chatbot/message/${updateIndex}?botId=${id}`,
            {
                ...newConversation,
            }
        );
        if (res.status == 200) {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Conservation has been updated",
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error while updating conservation",
            });
        }
        onHide("displayUpdateDialog");
        await getChatBot();
    };

    return (
        <div>
            <Toast ref={toast} />
            <Dialog
                header="Add new conversation"
                visible={displayDialog}
                className="w-full lg:w-1/2 mx-2"
                onHide={() => onHide("displayDialog")}
            >
                <div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col justify-center items-end"
                    >
                        <input
                            defaultValue=""
                            {...register("keyword", {
                                required: true,
                            })}
                            placeholder="Your keyword"
                            className="border-2 border-solid border-gray-300 rounded-lg p-2 w-full mb-2"
                        />
                        {errors.keyword && (
                            <span className="text-red-500 text-right">
                                Keyword is required
                            </span>
                        )}

                        <input
                            defaultValue=""
                            {...register("response", {
                                required: true,
                            })}
                            placeholder="Bot's response"
                            className="border-2 border-solid border-gray-300 rounded-lg p-2 w-full my-2"
                        />
                        {errors.response && (
                            <span className="text-red-500 text-right">
                                Response is required
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
            <Dialog
                header="Update conversation"
                visible={displayUpdateDialog}
                className="w-full lg:w-1/2 mx-2"
                onHide={() => onHide("displayUpdateDialog")}
            >
                <div>
                    <form
                        onSubmit={updateHandleSubmit(onSubmitUpdate)}
                        className="flex flex-col justify-center items-end"
                    >
                        <input
                            defaultValue=""
                            {...updateRegister("keyword", {
                                required: true,
                            })}
                            placeholder="Your new keyword"
                            className="border-2 border-solid border-gray-300 rounded-lg p-2 w-full mb-2"
                        />
                        {updateErrors.keyword && (
                            <span className="text-red-500 text-right">
                                Keyword is required
                            </span>
                        )}

                        <input
                            defaultValue=""
                            {...updateRegister("response", {
                                required: true,
                            })}
                            placeholder="Bot's new response"
                            className="border-2 border-solid border-gray-300 rounded-lg p-2 w-full my-2"
                        />
                        {updateErrors.response && (
                            <span className="text-red-500 text-right">
                                Response is required
                            </span>
                        )}

                        <div className="mt-6">
                            <Button
                                type="button"
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => onHide("displayUpdateDialog")}
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
            ;
            <HeaderMenu />
            <BreadCrumb home={home} model={items}></BreadCrumb>
            <div className="w-full flex justify-center flex-wrap">
                <div className="w-full flex justify-end p-4">
                    <Button
                        label="Add conversation"
                        icon="pi pi-plus"
                        onClick={() => {
                            setUpdateIndex(-1);
                            onClick("displayDialog");
                        }}
                    />
                </div>
                <div className="w-full flex justify-around flex-wrap">
                    <div className="w-full p-4 flex justify-start items-start flex-wrap border-solid">
                        {chatBot.keywords ? (
                            chatBot.keywords.map((keyword, index) => {
                                return (
                                    <Fieldset
                                        className="m-2"
                                        key={index}
                                        legend={keyword}
                                        toggleable
                                        collapsed={true}
                                    >
                                        <p>{chatBot.responses[index]}</p>

                                        <div className="ml-auto mt-4">
                                            <Button
                                                label="Edit"
                                                icon="pi pi-plus"
                                                className="p-button-primary"
                                                style={{ marginRight: ".25em" }}
                                                onClick={() => {
                                                    setUpdateIndex(index);

                                                    onClick(
                                                        "displayUpdateDialog"
                                                    );
                                                }}
                                            />

                                            <Button
                                                label="Remove"
                                                icon="pi pi-times"
                                                className="p-button-danger"
                                                style={{ marginRight: ".25em" }}
                                                onClick={() => {
                                                    removeConservation(
                                                        index,
                                                        chatBot.id
                                                    );
                                                }}
                                            />
                                        </div>
                                    </Fieldset>
                                );
                            })
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
            </div>
            <div className="justify-center items-center">
                <div
                    className={
                        showChatbot
                            ? "absolute shadow-lg bottom-32 right-16"
                            : "hidden"
                    }
                >
                    <Chatbot
                        config={config(chatBot.name)}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </div>

                <button
                    onClick={() => {
                        setShowChatbot(!showChatbot);
                    }}
                    className="w-14 h-14 absolute bottom-16 right-16 rounded-full bg-purple-400 text-white shadow-lg"
                >
                    B
                </button>
            </div>
        </div>
    );
}
