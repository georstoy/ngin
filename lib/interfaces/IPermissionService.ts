import {Construct} from "@aws-cdk/core";
import {IRole, RoleProps} from "@aws-cdk/aws-iam";

export interface IPermissionService {
    createRole(scope: Construct, id: string, role: RoleProps): IRole;

}