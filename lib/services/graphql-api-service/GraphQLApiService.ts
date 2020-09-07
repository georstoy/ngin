import {CfnOutput, Construct} from "@aws-cdk/core";
import {
    AuthorizationType,
    CfnDataSource,
    GraphqlApi,
    MappingTemplate,
    Schema,
    CfnResolver
} from "@aws-cdk/aws-appsync";

import {IApiService} from "../../interfaces/IApiService";
import {IApiServiceConfig} from "../../interfaces/IApiServiceConfig";
import {GraphQLController} from "./GraphQLController";
import {IController} from "../../interfaces/IController";
import {ControllerType, IControllerConfig} from "../../interfaces/IControllerConfig";
import {IRole, ServicePrincipal} from "@aws-cdk/aws-iam";
import {PermissionService} from "../permission-service/PermissionService";
import {IPermissionService} from "../../interfaces/IPermissionService";

export class GraphQLApiService extends Construct implements IApiService {
    public controllers: IController[];

    private api: GraphqlApi;
    private role: IRole;

    private permissionService: IPermissionService;

    constructor(scope: Construct, id: string, props?: IApiServiceConfig) {
        super(scope, id);
        this.api = this.createGraphQLApi();
        this.permissionService = (props?.permissionService) ? props.permissionService : new PermissionService()

        this.role = this.createServiceRole();

        this.addController({name: "hello", type: ControllerType.GET});
    }

    public addController(config: IControllerConfig): void {
        const controller = new GraphQLController(this, `controller-${config.type}-${config.name}`, config)
        controller.grantInvoke(this.role);
        const resolver = this.createGraphQLResolver(controller);
    }

    public exportUrl() {
        new CfnOutput(this, 'exportApiUrl', {
            exportName: "graphql-api-url",
            description: "Call the GraphQL API on this URL",
            value: this.api.graphqlUrl
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

    private createGraphQLApi(): GraphqlApi {
        return new GraphqlApi(this, "Api", {
            name: "graphql-api",
            schema: Schema.fromAsset(`${__dirname}/schema.graphql`),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.API_KEY,
                }
            }
        })
    }

    /**
     * Returns a role that must be used to grant the GraphQL Service right to invoke a Controller
     */
    private createServiceRole(): IRole {
        return this.permissionService.createRole(this, "GraphQLApiRole", {
            assumedBy: new ServicePrincipal("appsync")
        })
    }

    /**
     * Register Controller as AppSync GraphQL Resolver
     * @param controller
     */
    private createGraphQLResolver(controller: IController): CfnResolver {
        const dataSource = this.createLambdaDataSource(controller);

        return new CfnResolver(
            this,
            `Resolver-${controller.type}-${controller.name}`,
            {
                apiId: this.api.apiId,
                dataSourceName: dataSource.name,
                typeName: (controller.type === ControllerType.GET) ? "Query" : "Mutation",
                fieldName: controller.name,
                requestMappingTemplate: MappingTemplate.fromString("{" +
                    "\"version\": \"2018-05-29\", " +
                    "\"operation\": \"Invoke\", " +
                    "\"payload\": $util.toJson($context) " +
                    "}").renderTemplate(),
                responseMappingTemplate: MappingTemplate.fromString(
                    "#if($context.result && $context.result.errors)\n" +
                    "        #foreach ( $error in $context.result.errors )\n" +
                    "            $utils.appendError($error.errorMessage, $error.errorType, {}, $error.info)\n" +
                    "        #end\n" +
                    "        #return\n" +
                    "    #else\n" +
                    "        $utils.toJson($context.result)\n" +
                    "    #end`;").renderTemplate()
            }
        );
    }

    /**
     * Register Controller as AppSync DataSource
     * @param controller
     */
    private createLambdaDataSource(controller: IController) {
        return new CfnDataSource(
            this,
            `dataSource-${controller.type}-${controller.name}`,
            {
                apiId: this.api.apiId,
                name: `Lambda DataSource for ${controller.name}`,
                serviceRoleArn: this.role.roleArn,
                lambdaConfig: {
                    lambdaFunctionArn: controller.functionArn
                },
                type: "AWS_LAMBDA"
            }
        );
    }

}