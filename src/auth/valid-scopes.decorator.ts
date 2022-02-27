import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const ValidScopes = createParamDecorator((data:string[], ctx:ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // The "scp" property of the user object contains a space separated list of scopes.
    // Here we convert them to an array and change the case of each item to lowercase.
    let tokenScopes = user.scp.split(" ").map((s:string) => s.toLowerCase());

    // Here we want to determine if any of the scopes that we provided in the 'data' property
    // match any of the scopes that were in the token.
    let matchedScopes = tokenScopes.filter((s:string) => 
        data.map((s:string) => 
        s.toLowerCase()).includes(s.toLowerCase()));

    // If we matched any scopes, then the user should be allowed to execute the method that this
    // decorator is applied to.
    let hasPermission = matchedScopes.length > 0;

    return {
        // return the original payload
        user,
        // here we will return an objct with a method on it that will help us to determine
        // if the user has permission and at what level.  The 'adminScopes' argument to this
        // method is used to determine if we need to return the name of the user who is 
        // executing the method because we need to restrict access so that they can only 
        // affect the records that they own.
        authorize: (adminScopes?: string[]) : string => { 

            // if the user does not have any scopes that are required to execute the method
            // so we return 401 to the browser.
            if (!hasPermission) {
                throw new UnauthorizedException();
            }
            
            // if no admin scopes were provided, it means that the method that is being called
            // does not have any administrative restriction requirements.  So we short-circuit
            // and return null
            if (!adminScopes) {
                return null;
            }

            // find out if the user has any of the admin scopes that were passed into the 
            // authorize method;
            let matchedAdminScopes = matchedScopes.filter((s:string) => 
                adminScopes.includes(s.toLowerCase()));
            
            // if the current user has admin scopes, then return null as we will not be
            // filtering by user.  Otherwise, return the oid of the user so that we can
            // apply filters.
            return matchedAdminScopes.length > 0 ? null : user.oid;
        }
    };
});