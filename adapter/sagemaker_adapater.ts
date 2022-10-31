import { ENDPOINT } from '../config/config';

export default class SageMakerRuntime {

    readonly endpoint: string;

    constructor() {
        this.endpoint = `${ENDPOINT}/model`;
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