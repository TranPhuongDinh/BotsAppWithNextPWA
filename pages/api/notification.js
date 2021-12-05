const nodemailer = require("nodemailer");

export default async (req, res) => {
    const httpMethod = req.method;
    const { subject, text } = req.body;

    switch (httpMethod) {
        case "POST":
            //add new chatbot
            const SRC_MAIL = "dinhblade123@gmail.com";
            const SRC_MAIL_PASS = "irqebsvgusdttxsp";
            const SERVICE = "gmail";

            const SUBJECT = subject;
            const TEXT = text;

            let transporter = nodemailer.createTransport({
                service: SERVICE,
                auth: {
                    user: SRC_MAIL,
                    pass: SRC_MAIL_PASS,
                },
            });

            let today = new Date();

            let time =
                today.getHours() +
                ":" +
                today.getMinutes() +
                ":" +
                today.getSeconds();

            let mails = [
                "dinhblade123@gmail.com",
                "dinhramos123@gmail.com",
                "19120476@student.hcmus.edu.vn",
            ];

            for (let mail of mails) {
                let mailOptions = {
                    from: "dinhblade123@gmail.com",
                    to: mail,
                    subject: `${SUBJECT} - ${time}`,
                    text: TEXT,
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            }

            await res.status(200).json({
                message: "done",
            });
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${httpMethod} not supported`);
    }
};
