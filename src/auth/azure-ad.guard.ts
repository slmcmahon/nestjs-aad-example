import { Global, Injectable } from "@nestjs/common";
import { PassportStrategy, AuthGuard } from "@nestjs/passport";
import { BearerStrategy } from "passport-azure-ad";

@Global()
@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, "azure-ad") {
    constructor() {
        super({
            identityMetadata: `https://login.microsoftonline.com/${process.env.AZ_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
            clientID: process.env.AZ_AD_CLIENT_ID,
            issuer: `https://sts.windows.net/${process.env.AZ_AD_TENANT_ID}/`,
            audience: `api://${process.env.AZ_AD_CLIENT_ID}`,
            loggingLevel: process.env.AZ_AD_LOG_LEVEL,
            passReqToCallback: false
        });
    }

    async validate(data) {
        return data;
    }
}

export const AzureADGuard = AuthGuard("azure-ad")