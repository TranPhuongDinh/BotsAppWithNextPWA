class ActionProvider {
    constructor(createChatbotMessage, setStateFunc, createClientMessage) {
        this.createChatbotMessage = createChatbotMessage;
        this.setState = setStateFunc;
        this.createClientMessage = createClientMessage;
    }

    setResponseMessage(responseMessage) {
        const message = this.createChatbotMessage(responseMessage);

        this.setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
        }));
    }

    handleResponse(response) {
        this.setResponseMessage(response);
    }
}

export default ActionProvider;
