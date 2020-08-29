import {Stack, Construct, StackProps} from '@aws-cdk/core';

export class Ngin extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // @TODO create API Service and provide endpoint as output
        // @TODO create Controller - Request Resolver for calls to the API endpoint
    }
}
