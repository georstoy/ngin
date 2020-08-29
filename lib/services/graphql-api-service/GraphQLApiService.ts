import {CfnOutput, Construct} from "@aws-cdk/core";
import {AuthorizationType, GraphQLApi, Schema} from "@aws-cdk/aws-appsync";

import {IApiService} from "../../interfaces/IApiService";
import {IApiServiceConfig} from "../../interfaces/IApiServiceConfig";

export class GraphQLApiService extends Construct implements IApiService {
    private api: GraphQLApi;

    constructor(scope: Construct, id: string, props?: IApiServiceConfig) {
        super(scope, id);
        this.api = this.createGraphQLApi();
    }

    public exportUrl() {
        new CfnOutput(this, 'exportApiUrl', {
            exportName: "graphql-api-url",
            description: "Call the GraphQL API on this URL",
            value: this.api.graphQlUrl
        })
    }

    public exportKey() {
        new CfnOutput(this, 'exportApiKey', {
            exportName: "graphql-api-key",
            description: "This key authorizes requests to the GraphQL API Endpoint. " +
                "Attach this as a value of 'x-api-key' request header",
            value: this.api.apiKey!
        })
    }

    private createGraphQLApi(): GraphQLApi {
        return new GraphQLApi(this, "Api", {
            name: "graphql-api",
            schema: Schema.fromAsset(`${__dirname}/schema.graphql`),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.API_KEY,
                }
            }
        })
    }
}