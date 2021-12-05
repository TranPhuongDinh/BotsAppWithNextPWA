import React, { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios";

import announcerBot from "../public/img/announcerBot.png";

export default function App() {
    const toast = useRef(null);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { subject, text } = data;
        const sendData = {
            subject: subject,
            text: text,
        };
        const res = await axios.post("/api/notification", sendData);
        if (res.status === 200 && res.data.message === "done") {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Successfully sent to server!",
            });
        } else {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Something went wrong!",
            });
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Toast ref={toast} />
            <div className="mt-10">
                <Image src={announcerBot} width="200" height="200"></Image>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="block mx-auto md:w-1/2 w-5/6 p-6 bg-white shadow-xl rounded-lg mt-4 "
            >
                <div className="p-field p-col-12 p-md-4 mb-8">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope"></i>
                        </span>
                        <span className="p-float-label">
                            <InputText
                                id="subject"
                                type="text"
                                {...register("subject", { required: true })}
                            />

                            <label htmlFor="subject">Subject</label>
                        </span>
                    </div>
                    {errors.subject && (
                        <span className="text-red-500 text-right text-xs">
                            Subject is required
                        </span>
                    )}
                </div>

                <div className="p-field p-col-12 p-md-4 mb-8">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-envelope"></i>
                        </span>
                        <span className="p-float-label">
                            <InputText
                                id="text"
                                type="text"
                                {...register("text", { required: true })}
                            />

                            <label htmlFor="text">Text content</label>
                        </span>
                    </div>
                    {errors.text && (
                        <span className="text-red-500 text-right text-xs">
                            Text is required
                        </span>
                    )}
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <button className="p-button block" type="submit">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
