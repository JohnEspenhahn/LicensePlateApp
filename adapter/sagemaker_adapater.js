import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import 'fast-text-encoding';

export default class SageMakerRuntime {

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

            return await resp.text();
        } catch (e) {
            console.log(e);
            return "error";
        }
    }

}