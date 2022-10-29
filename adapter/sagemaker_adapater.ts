export default class SageMakerRuntime {

    readonly endpoint: string;

    constructor() {
        this.endpoint = "https://mosak1d405.execute-api.us-east-1.amazonaws.com/alpha/model";
    }

    async invokeApi(data) {
        try {
            const resp = await fetch(this.endpoint, {
                method: "POST",
                body: data,
                headers: { 'Content-Type': 'text/plain' },
            });

            if (resp.ok) {
                return await resp.text();
            } else {
                return "error";
            }
        } catch (e) {
            return "error";
        }
    }

}