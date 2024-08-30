import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: "beb1477b-bef9-4e1d-b074-7f4ae519b371",
        authority: "https://login.microsoftonline.com/faab624d-b4a9-4f1c-bd59-5fd1ea3fd487",
        redirectUri: "/",
        postLogoutRedirectUri: "/"
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};