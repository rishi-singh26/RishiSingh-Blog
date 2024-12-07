export class SocketResponse {
    private action: string;
    private result: { [key: string]: any };
    constructor(action: string, result: { [key: string]: any }) {
        this.action = action;
        this.result = result;
    }

    toJson(): { [key: string]: any } {
        return { action: this.action, result: this.result }
    }
}