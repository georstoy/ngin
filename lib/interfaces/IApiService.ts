import {IController} from "./IController";

export interface IApiService {

    addController(config: IController): void;

    exportUrl(): void;
    exportKey(): void;
}
