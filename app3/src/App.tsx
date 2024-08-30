import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { PrimaryButton, Stack } from '@fluentui/react';
import { LoginHeader } from './components/LoginHeader';
import { IWebChatViewProps, WebChatView } from './components/WebChatView';

type AppProps = {
    pca: IPublicClientApplication;
};

export const App = ({ pca }: AppProps) => {
    // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
    // const navigate = useNavigate();
    // const navigationClient = new CustomNavigationClient(navigate);
    // pca.setNavigationClient(navigationClient);
    const botSettings: IWebChatViewProps = {
        botURL: "",
        userEmail: "frank@MngEnvMCAP604196.onmicrosoft.com",
        userFriendlyName: "Frank Chen",
        greet: true,
        customScope: "api://db1c5cfd-ce2e-49b9-979f-4406d5f93b9e/fullcontrol",
        clientID: "beb1477b-bef9-4e1d-b074-7f4ae519b371",
        authority: "https://login.microsoftonline.com/faab624d-b4a9-4f1c-bd59-5fd1ea3fd487"
    };
    const _loginHandler = () => {
    }

    return (
        <MsalProvider instance={pca}>
            <UnauthenticatedTemplate>
                {/* <h5 className="card-title">Please sign-in to see your profile information.</h5>
                <PrimaryButton text="Login" onClick={_loginHandler} /> */}
                <LoginHeader />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <Stack>
                    <LoginHeader />
                    <WebChatView {...botSettings} />
                </Stack>

            </AuthenticatedTemplate>

            <div>Home</div>
        </MsalProvider>
    );
}


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
