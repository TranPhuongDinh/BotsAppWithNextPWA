const puppeteer = require("puppeteer");

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

export default async (req, res) => {
    const httpMethod = req.method;
    const { phoneNumber, password, productName, quantity } = req.body;

    switch (httpMethod) {
        case "POST":
            const PHONE_NUMBER = phoneNumber;
            const SHOP_URL = "https://thuocsi.vn/products";
            const PASSWORD = password;
            const PRODUCT_NAME = productName;
            const QUANTITY = Number.parseInt(quantity);

            (async () => {
                //const today = new Date();

                if (true) {
                    const browser = await puppeteer.launch({
                        headless: false,
                    });
                    const page = await browser.newPage();

                    try {
                        await page.goto(SHOP_URL);
                    } catch (e) {
                        await res.status(200).json({
                            message: e,
                        });
                    }

                    await page.setViewport({ width: 1820, height: 980 });
                    await page.screenshot(
                        { path: "example.png" },
                        {
                            waitUntil: "networkidle2",
                        }
                    );

                    try {
                        await page.waitForSelector(
                            "path[d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z']"
                        );
                    } catch (e) {
                        await res.status(200).json({
                            message: e,
                        });
                    }

                    //bấm nút đăng nhập
                    await page.click(
                        "path[d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z']"
                    );

                    //nhập số điện thoại
                    await page.waitForSelector("#username");
                    await page.type("#username", PHONE_NUMBER);

                    //nhập mật khẩu
                    await page.waitForSelector("#password");
                    await page.type("#password", PASSWORD);

                    //bấm nút đăng nhập
                    await page.waitForSelector(
                        "button.styles_btn_register__nNXcY"
                    );
                    await page.click("button.styles_btn_register__nNXcY");

                    await delay(2000);

                    //tìm kiếm sản phẩm cần mua
                    await page.waitForSelector(
                        "input[placeholder='Tìm kiếm tên thuốc hoặc hoạt chất cần tìm...']"
                    );
                    await page.type(
                        "input[placeholder='Tìm kiếm tên thuốc hoặc hoạt chất cần tìm...']",
                        PRODUCT_NAME
                    );

                    //nhấn tìm kiếm
                    await page.waitForSelector("a.styles_searchResults__1pq2T");
                    await page.click("a.styles_searchResults__1pq2T");

                    //bấm vào sản phẩm cần mua
                    await page.waitForSelector(`img[alt='${PRODUCT_NAME}']`);
                    await page.click(`img[alt='${PRODUCT_NAME}']`);

                    //kích vào số lượng mua
                    await page.waitForSelector(
                        "path[d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z']"
                    );

                    for (let i = 0; i < QUANTITY; i++) {
                        await page.click(
                            "path[d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z']"
                        );
                    }

                    //đi đến giỏ hàng
                    await page.waitForSelector(
                        "img[srcset='/_next/image?url=%2Fimages%2Fheader-v2%2FCart_icon.svg&w=50&q=75 1x']"
                    );
                    await page.click(
                        "img[srcset='/_next/image?url=%2Fimages%2Fheader-v2%2FCart_icon.svg&w=50&q=75 1x']"
                    );

                    //thanh toán
                    await page.waitForSelector("button.payment_button");
                    await page.click("button.payment_button");

                    //mua hàng
                }
            })();
            await res.status(200).json({
                message: "done",
            });
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${httpMethod} not supported`);
    }
};
