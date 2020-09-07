import {Construct} from "@aws-cdk/core";
import {Code, Function, Runtime} from "@aws-cdk/aws-lambda";
import {IController} from "../../interfaces/IController";
import {ControllerType, IControllerConfig} from "../../interfaces/IControllerConfig";
import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";

/**
 * This Lambda function can be attached to the GraphQLApiService as a Controller
 */
export class GraphQLController extends NodejsFunction implements IController {
    public readonly name: string;
    public readonly type: ControllerType;
    public readonly functionArn: string;

    constructor(scope: Construct, id: string, config: IControllerConfig) {
        super(scope, id, {
            runtime: Runtime.NODEJS_12_X,
            //code: Code.fromAsset("../../controllers/"),
            handler: config.name
        })

        this.name = config.name;
        this.type = config.type;

        this.functionArn = super.functionArn;
    }

}