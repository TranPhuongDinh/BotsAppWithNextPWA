import React, { useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import axios from "axios";

import shoppingBot from "../public/img/shoppingBot.png";

// 0938996159
// https://thuocsi.vn/products
// Thang210697
// Dung Dịch Nhỏ Giọt Cân Bằng Hệ Vi Sinh Đường Ruột Probiotic L.Reuteri Drops O.F.I Italy (C/10ml)
// 5

export default function App() {
    const toast = useRef(null);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { phoneNumber, password, productName, quantity } = data;
        const sendData = {
            phoneNumber: phoneNumber,
            password: password,
            productName: productName,
            quantity: quantity,
        };
        const res = await axios.post("/api/shoppingBot", sendData);
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
                <Image src={shoppingBot} width="200" height="200"></Image>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="block mx-auto md:w-1/2 w-5/6 p-4 md:p-10 bg-white shadow-xl rounded-lg mt-4"
            >
                <div className="p-field p-col-12 p-md-4 mb-8 mt-8">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-phone"></i>
                        </span>
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="phoneNumber"
                                {...register("phoneNumber", { required: true })}
                            />

                            <label htmlFor="phoneNumber">Phone number</label>
                        </span>
                    </div>
                    {errors.phoneNumber && (
                        <span className="text-red-500 text-right text-xs">
                            Phone number is required
                        </span>
                    )}
                </div>
                <div className="p-field p-col-12 p-md-4 mb-8">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock"></i>
                        </span>
                        <span className="p-float-label">
                            <InputText
                                type="password"
                                id="phoneNumber"
                                {...register("password", { required: true })}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    {errors.password && (
                        <span className="text-red-500 text-right text-xs">
                            Password is required
                        </span>
                    )}
                </div>

                <div className="p-field p-col-12 p-md-4 mb-8">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-shopping-cart"></i>
                        </span>
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="productName"
                                {...register("productName", { required: true })}
                            />

                            <label htmlFor="productName">Product Name</label>
                        </span>
                    </div>
                    {errors.productName && (
                        <span className="text-red-500 text-right text-xs">
                            Product name is required
                        </span>
                    )}
                </div>

                <div className="p-field p-col-12 p-md-4 mb-8">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-shopping-cart"></i>
                        </span>
                        <span className="p-float-label">
                            <InputText
                                type="text"
                                id="quantity"
                                {...register("quantity", { required: true })}
                            />

                            <label htmlFor="quantity">Quantity</label>
                        </span>
                    </div>
                    {errors.quantity && (
                        <span className="text-red-500 text-right text-xs">
                            Quantity is required
                        </span>
                    )}
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <button className="p-button block" type="submit">
                        Buy
                    </button>
                </div>
            </form>
        </div>
    );
}
