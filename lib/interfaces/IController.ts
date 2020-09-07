import {ControllerType} from "./IControllerConfig";

export interface IController {
    name: string
    type: ControllerType
    functionArn: string
}