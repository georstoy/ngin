import {Construct} from "@aws-cdk/core";
import {IPermissionService} from "../../interfaces/IPermissionService";
import {Role, RoleProps} from "@aws-cdk/aws-iam";

export class PermissionService implements IPermissionService {
    constructor() {
    }

    public createRole(scope: Construct, id: string, props: RoleProps) {
        return new Role(scope, id, props);
    }
}