import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import 'fast-text-encoding';

export default class SageMakerRuntime {

    constructor() {
        const region = "us-east-1";
        this.client = new AWS.SageMakerRuntime({
            region,
            credentials: {
                accessKeyId: "",
                secretAccessKey: ""
            }
        });
        this.decoder = new TextDecoder();
    }

    async invoke(data) {
        const resp = await this.client.invokeEndpoint({
            EndpointName: 'PlateOcr-4',
            Body: data,
        }).promise();

        return this.decoder.decode(resp.Body);
    }

}