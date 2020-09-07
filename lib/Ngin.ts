import {Stack, Construct, StackProps} from '@aws-cdk/core';

export interface NginConfig extends StackProps {
}

import {GraphQLApiService} from "./services/graphql-api-service/GraphQLApiService"
import {IApiService} from "./interfaces/IApiService";

export class Ngin extends Stack {
    private apiService: IApiService

    constructor(scope: Construct, id: string, props?: NginConfig) {
        super(scope, id, props);

        // @TODO manual test: make a valid API call
        this.apiService = this.createApiService();
        this.apiService.exportUrl();
        this.apiService.exportKey();

        // @TODO create Controller - Request Resolver for calls to the API endpoint
    }

    private createApiService(): IApiService {
        return new GraphQLApiService(this, 'ApiService')
    }
}
