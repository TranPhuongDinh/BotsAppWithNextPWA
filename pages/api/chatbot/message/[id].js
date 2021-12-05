import { chatBots } from "../../../../data";

export default async (req, res) => {
    const httpMethod = req.method;
    const { keyword, response } = req.body;

    const botIndex = Number.parseInt(req.query.id);
    const botId = req.query.botId;

    switch (httpMethod) {
        case "PUT": {
            let updateIndex = chatBots.findIndex((m) => m.id === botId);

            if (updateIndex != -1) {
                chatBots[updateIndex].keywords[botIndex] = keyword;
                chatBots[updateIndex].responses[botIndex] = response;
                res.status(200).json({ message: "OK" });
            } else {
                res.status(404).json({
                    message: "NOT FOUND",
                });
            }
            break;
        }
        case "DELETE": {
            let updateIndex = chatBots.findIndex((m) => m.id === botId);

            if (updateIndex != -1) {
                chatBots[updateIndex].keywords.splice(botIndex, 1);
                chatBots[updateIndex].responses.splice(botIndex, 1);

                res.status(200).json({ message: "OK" });
            } else {
                res.status(404).json({
                    message: "NOT FOUND",
                });
            }

            break;
        }
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            res.status(405).end(`Method ${httpMethod} not supported`);
    }
};
