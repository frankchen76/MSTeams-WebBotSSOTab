// MSALWrapper.ts
import {
    LogLevel, PublicClientApplication, AuthenticationResult,
    Configuration, InteractionRequiredAuthError, AccountInfo
} from "@azure/msal-browser";
import { msalInstance } from "../index"

export class MSALWrapper {
    // private msalConfig: Configuration;

    private msalInstance: PublicClientApplication;

    constructor(clientId: string, authority: string) {
        this.msalInstance = msalInstance;
    }

    public async handleLoggedInUser(scopes: string[], userEmail: string): Promise<AuthenticationResult | null> {

        let userAccount: AccountInfo | null;
        const accounts = this.msalInstance.getAllAccounts();

        if (accounts === null || accounts.length === 0) {
            console.log("No users are signed in");
            return null;
        } else if (accounts.length > 1) {
            userAccount = this.msalInstance.getAccountByUsername(userEmail);
        } else {
            userAccount = accounts[0];
        }

        if (userAccount !== null) {
            const accessTokenRequest = {
                scopes: scopes,
                account: userAccount
            };

            return this.msalInstance.acquireTokenSilent(accessTokenRequest).then((response) => {
                return response;
            }).catch((errorinternal) => {
                console.log(errorinternal);
                return null;
            });
        }
        return null;
    }


    public async acquireAccessToken(scopes: string[], userEmail: string): Promise<AuthenticationResult | null> {


        const accessTokenRequest = {
            scopes: scopes,
            loginHint: userEmail
        }

        return this.msalInstance.ssoSilent(accessTokenRequest).then((response) => {
            return response
        }).catch((silentError) => {
            console.log(silentError);
            if (silentError instanceof InteractionRequiredAuthError) {
                return this.msalInstance.loginPopup(accessTokenRequest).then((response) => {
                    return response;
                }
                ).catch((error) => {
                    console.log(error);
                    return null;
                });
            }
            return null;
        })
    }

}

export default MSALWrapper;