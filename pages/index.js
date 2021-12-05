import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

import botBanner from "../public/img/bot-image-head.png";
import chatBotImg from "../public/img/chatbot.png";
import announcerBot from "../public/img/announcerBot.png";
import shoppingBot from "../public/img/shoppingBot.png";

export default function Home() {
    return (
        <div className="w-full h-full">
            <Head>
                <title>Bot test</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <Header />
            <section className={styles.banner}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className="text-white text-4xl font-black uppercase">
                            Choose your bots
                        </h1>
                        <p className="text-white text-base my-4">
                            Help your users create their bots like never before.
                            No programming required.
                        </p>
                        <Link href="./bots">
                            <span className="shadow-md rounded-lg px-8 py-4 bg-white mt-10 uppercase font-medium transition-all hover:bg-green-500 cursor-pointer">
                                create now
                            </span>
                        </Link>
                    </div>
                    <div className={styles.bannerImg}>
                        <Image src={botBanner}></Image>
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-10">
                <div className={styles.buttonList}>
                    <Link href="/shoppingBot">
                        <div className={styles.buttonBot}>
                            <Image
                                src={shoppingBot}
                                width="200"
                                height="200"
                            ></Image>
                            <h3>Shopping Bot</h3>
                        </div>
                    </Link>

                    <Link href="/bots">
                        <div className={styles.buttonBot}>
                            <Image
                                src={chatBotImg}
                                width="200"
                                height="200"
                            ></Image>
                            <h3>Chat Bot</h3>
                        </div>
                    </Link>

                    <Link href="/notificationBot">
                        <div className={styles.buttonBot}>
                            <Image
                                src={announcerBot}
                                width="200"
                                height="200"
                            ></Image>
                            <h3>Announcer Bot</h3>
                        </div>
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    );
}
