import axios from "axios";

class MessageParser {
    constructor(actionProvider, state) {
        this.actionProvider = actionProvider;
        this.state = state;
    }

    async getDataMessage() {
        const res = await axios.get(
            "http://localhost:3000/api/chatbot/message"
        );
        return res.data;
    }

    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    async parse(message) {
        const res = await this.getDataMessage();

        message = this.removeAccents(message);

        for (let i = 0; i < res.length; i++) {
            if (message.includes(this.removeAccents(res[i].yourMessage))) {
                this.actionProvider.handleResponse(
                    this.removeAccents(res[i].botMessage)
                );
                return;
            }
        }
    }
}

export default MessageParser;
