import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import styles from "../../styles/Login.module.css";
import Link from "next/link";

import botBanner from "../../public/img/bot-image-head.png";

export default function Login() {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => console.log(data);

    return (
        <div className={styles.login}>
            <div className={styles.loginImgBot}>
                <Image src={botBanner}></Image>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col justify-center items-end"
            >
                <input
                    {...register("email", {
                        required: true,
                        pattern: emailRegex,
                    })}
                    placeholder="Your email"
                    className="border-2 border-solid border-gray-300 rounded-lg p-2 w-80 mb-4"
                />
                {errors.email && (
                    <span className="text-red-500 text-right mb-4">
                        Email is not valid
                    </span>
                )}

                <input
                    placeholder="Your password"
                    type="password"
                    {...register("password", { required: true, minLength: 8 })}
                    className="border-2 border-solid border-gray-300 rounded-lg p-2 w-80 mb-4"
                />

                {errors.password && (
                    <span className="text-red-500 text-right mb-4">
                        Password require at least 8 characters
                    </span>
                )}

                <div>
                    <input
                        type="submit"
                        value="Login"
                        className={styles.btnLogin}
                    />

                    <span className="ml-5 text-white">
                        or{" "}
                        <Link href="/users/register">
                            <span className="transition-all font-semibold hover:underline cursor-pointer">
                                Sign Up
                            </span>
                        </Link>{" "}
                    </span>
                </div>
            </form>
        </div>
    );
}
