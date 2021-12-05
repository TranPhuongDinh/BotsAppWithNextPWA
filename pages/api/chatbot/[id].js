import { chatBots } from "../../../data";

export default async (req, res) => {
    const httpMethod = req.method;
    const { name, keywords, responses } = req.body;

    const botId = req.query.id;

    switch (httpMethod) {
        case "GET": {
            const result = chatBots.filter((mes) => mes.id === botId);
            if (result.length) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({
                    message: "NOT FOUND",
                });
            }
            break;
        }
        case "PUT": {
            const updatedBot = {
                id: botId,
                name: name,
                keywords: [...keywords],
                responses: [...responses],
            };

            let updateIndex = chatBots.findIndex((m) => m.id === botId);

            let updateKeywordIndex = chatBots[updateIndex].keywords.findIndex(
                (k) => k === keywords[keywords.length - 1]
            );

            if (updateKeywordIndex !== -1) {
                res.status(200).json({
                    message: "EXISTED",
                });
                break;
            }

            if (updateIndex != -1) {
                chatBots[updateIndex] = {
                    id: botId,
                    ...updatedBot,
                };

                res.status(200).json({ message: "OK" });
            } else {
                res.status(404).json({
                    message: "NOT FOUND",
                });
            }
            break;
        }
        case "DELETE": {
            let removeIndex = chatBots.findIndex((m) => m.id === botId);

            if (removeIndex !== -1) {
                chatBots.splice(removeIndex, 1);

                res.status(200).json({
                    message: "OK",
                });
            } else {
                res.status(404).json({
                    message: "NOT FOUND",
                });
            }

            break;
        }
        default:
            res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
            res.status(405).end(`Method ${httpMethod} not supported`);
    }
};
