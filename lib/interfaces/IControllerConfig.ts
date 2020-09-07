export interface IControllerConfig {
    name: string
    type: ControllerType
    // codeBasePath?: string TODO set default codebase path
}

export enum ControllerType {
    "GET" = "get",
    "POST" = "post"
}