import { chatBots } from "../../../data";
import { v4 as uuidv4 } from "uuid";

export default async (req, res) => {
    const httpMethod = req.method;
    const { name } = req.body;

    switch (httpMethod) {
        case "GET":
            if (chatBots) {
                res.status(200).json(chatBots);
            } else {
                res.status(404).json({ message: "NOT FOUND" });
            }
            break;
        case "POST":
            //add new chatbot
            const newMessBot = {
                id: uuidv4(),
                name: name,
                keywords: [],
                responses: [],
            };

            if (newMessBot.name) {
                chatBots.push(newMessBot);
                res.status(200).json({ message: "OK" });
            } else {
                res.status(400).json({
                    message: "FAILED",
                });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${httpMethod} not supported`);
    }
};
