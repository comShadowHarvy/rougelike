class Logger {
    constructor() {
        this.messages = [];
        this.maxMessages = 5;
    }

    log(message, type = 'info') {
        let coloredMessage = message;
        if (type === 'damage') coloredMessage = `\x1b[31m${message}\x1b[0m`; // red
        else if (type === 'heal') coloredMessage = `\x1b[32m${message}\x1b[0m`; // green
        else if (type === 'death') coloredMessage = `\x1b[31m\x1b[1m${message}\x1b[0m`; // bold red

        this.messages.unshift(coloredMessage);
        if (this.messages.length > this.maxMessages) {
            this.messages.pop();
        }
    }

    getMessages() {
        return this.messages;
    }

    clear() {
        this.messages = [];
    }
}

module.exports = Logger;
