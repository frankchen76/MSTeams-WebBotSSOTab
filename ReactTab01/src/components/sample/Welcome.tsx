import { useContext, useState } from "react";
import {
    Image,
    TabList,
    Tab,
    SelectTabEvent,
    SelectTabData,
    TabValue,
} from "@fluentui/react-components";
import "./Welcome.css";
import { EditCode } from "./EditCode";
import { AzureFunctions } from "./AzureFunctions";
import { CurrentUser } from "./CurrentUser";
import { useData } from "@microsoft/teamsfx-react";
import { Deploy } from "./Deploy";
import { Publish } from "./Publish";
import { TeamsFxContext } from "../Context";
import { app } from "@microsoft/teams-js";
import { IWebChatViewProps, WebChatView } from "../webchat/WebChatView";

export function Welcome(props: { showFunction?: boolean; environment?: string }) {
    const { showFunction, environment } = {
        showFunction: true,
        environment: window.location.hostname === "localhost" ? "local" : "azure",
        ...props,
    };
    const friendlyEnvironmentName =
        {
            local: "local environment",
            azure: "Azure environment",
        }[environment] || "local environment";

    const botSettings: IWebChatViewProps = {
        botURL: "",
        userEmail: "frank@MngEnvMCAP604196.onmicrosoft.com",
        userFriendlyName: "Frank Chen",
        greet: true,
        customScope: "api://db1c5cfd-ce2e-49b9-979f-4406d5f93b9e/fullcontrol",
        clientID: "beb1477b-bef9-4e1d-b074-7f4ae519b371",
        authority: "https://login.microsoftonline.com/faab624d-b4a9-4f1c-bd59-5fd1ea3fd487"
    };

    const [selectedValue, setSelectedValue] = useState<TabValue>("local");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };
    const { teamsUserCredential } = useContext(TeamsFxContext);
    const { loading, data, error } = useData(async () => {
        if (teamsUserCredential) {
            const userInfo = await teamsUserCredential.getUserInfo();
            return userInfo;
        }
    });
    const userName = loading || error ? "" : data!.displayName;
    const hubName = useData(async () => {
        await app.initialize();
        const context = await app.getContext();
        return context.app.host.name;
    })?.data;
    return (
        <div className="welcome page">
            <div className="narrow page-padding">
                <Image src="hello.png" />
                <h1 className="center">Congratulations{userName ? ", " + userName : ""}!</h1>
                {hubName && <p className="center">Your app is running in {hubName}</p>}
                <p className="center">Your app is running in your {friendlyEnvironmentName}</p>

                <div className="tabList">
                    <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                        <Tab id="Local" value="local">
                            1. Build your app locally
                        </Tab>
                        <Tab id="Azure" value="azure">
                            2. Provision and Deploy to the Cloud
                        </Tab>
                        <Tab id="Publish" value="publish">
                            3. Publish to Teams
                        </Tab>
                        <Tab id="webbot" value="webbot">
                            4. Web chat bot
                        </Tab>
                    </TabList>
                    <div>
                        {selectedValue === "local" && (
                            <div>
                                <EditCode showFunction={showFunction} />
                                <CurrentUser userName={userName} />
                                {showFunction && <AzureFunctions />}
                            </div>
                        )}
                        {selectedValue === "azure" && (
                            <div>
                                <Deploy />
                            </div>
                        )}
                        {selectedValue === "publish" && (
                            <div>
                                <Publish />
                            </div>
                        )}
                        {selectedValue === "webbot" && (
                            <div>
                                <WebChatView {...botSettings} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
