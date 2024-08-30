import * as React from "react";

import { DirectLine } from 'botframework-directlinejs';
// import ReactWebChat from 'botframework-webchat';
import { Components } from 'botframework-webchat-component';
import * as ReactWebChatLib from 'botframework-webchat';
import { IconButton, PrimaryButton, IStackItemStyles, IStackStyles, Spinner, Stack, TextField } from "@fluentui/react";
import { useEffect, useState, useContext } from "react";
import { useId } from "@fluentui/react-hooks";

import { Dispatch } from 'redux';
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { teamsDarkTheme } from "@fluentui/react-components";

// import { hooks } from 'botframework-webchat-component';
//const { useActivities, useSendMessage } = hooks;


export interface IWebChatViewProps {
    botURL: string;
    userEmail: string;
    userFriendlyName: string;
    greet?: boolean;
    customScope: string;
    clientID: string;
    authority: string;
}

const SendMessageCtrl = () => {
    const [prompt, setPrompt] = React.useState<string>("");

    const sendMessage = ReactWebChatLib.hooks.useSendMessage();

    const onPromptChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPrompt(newValue!);
    }
    const onPromptSend = () => {
        sendMessage(prompt);
        setPrompt("");
    }
    const nonShrinkingStackItemStyles: IStackItemStyles = {
        root: {
            alignItems: 'center',
            display: 'flex',
            height: 32,
            justifyContent: 'center',
            overflow: 'hidden',
            width: 40
        }
    };
    const stackStyles: IStackStyles = {
        root: {
            width: `100%`,
        },
    };

    return (
        <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="end" styles={stackStyles}>
            <Stack.Item grow>
                <TextField title="Type your question" label="Type your message" value={prompt} onChange={onPromptChange} />
            </Stack.Item>
            <Stack.Item disableShrink styles={nonShrinkingStackItemStyles}>
                {/* <IconButton iconProps={{ iconName: 'Send' }} onClick={onPromptSend} /> */}
                <PrimaryButton onClick={onPromptSend}>Send</PrimaryButton>
            </Stack.Item>
        </Stack>

    );
}

export const WebChatView = (props: IWebChatViewProps) => {
    // const [loading, setLoading] = useState<boolean>(false);
    // const [botName, setBotName] = useState<string>();
    const [directLine, setDirectLine] = useState<DirectLine>();
    const [store, setStore] = useState<any>();
    // const [prompt, setPrompt] = React.useState<string>("");

    // const [botToken, setBotToken] = useState<string>();
    // const [userId, setUserId] = useState<string>();

    const { teamsUserCredential } = useContext(TeamsFxContext);
    const { loading, data, error } = useData(async () => {
        if (teamsUserCredential) {
            const userInfo = await teamsUserCredential.getUserInfo();
            const exchangeToken = await teamsUserCredential.getToken(props.customScope);
            return { userInfo, exchangeToken };
        }
    });

    // const labelId: string = useId('dialogLabel');
    // const subTextId: string = useId('subTextLabel');
    // const modalProps = React.useMemo(
    //     () => ({
    //         isBlocking: false,
    //     }),
    //     [labelId, subTextId],
    // );


    console.log(directLine);

    // A utility function that extracts the OAuthCard resource URI from the incoming activity or return undefined
    const getOAuthCardResourceUri = (activity: any): string | undefined => {
        const attachment = activity?.attachments?.[0];
        if (attachment?.contentType === 'application/vnd.microsoft.card.oauth' && attachment.content.tokenExchangeResource) {
            return attachment.content.tokenExchangeResource.uri;
        }
    }

    const _fetchJSON = async (url: string, options: any) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...(options || {}).headers,
                accept: 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
        }

        return await res.json();
    }



    useEffect(() => {
        const loadBotToken = async () => {
            //setLoading(true);
            try {

                // Your bot's token endpoint
                const botURL = props.botURL;

                // get token: 
                // const MSALWrapperInstance = new MSALWrapper(props.clientID, props.authority);
                // // Trying to get token if user is already signed-in
                // let responseToken = await MSALWrapperInstance.handleLoggedInUser([props.customScope], props.userEmail);
                // if (!responseToken) {
                //     // Trying to get token if user is not signed-in
                //     responseToken = await MSALWrapperInstance.acquireAccessToken([props.customScope], props.userEmail);
                // }
                // const exchangedToken = responseToken?.accessToken || null;
                // console.log("Get SSO token:", token);

                // Get DirectLine token
                const uniqueID = () => Math.random().toString(36).substr(2, 9);

                const userID = uniqueID;
                const botSecret = process.env.REACT_APP_WEBBOTSECRET;
                const { token } = await _fetchJSON('https://directline.botframework.com/v3/directline/tokens/generate', {
                    body: JSON.stringify({ user: { id: `dl_${userID}`, name: 'frank@MngEnvMCAP604196.onmicrosoft.com' } }),
                    headers: {
                        authorization: `Bearer ${botSecret}`,
                        'Content-type': 'application/json'
                    },
                    method: 'POST'
                });

                // Create DirectLine object
                let directline: any;
                if (token) {
                    directline = new DirectLine({
                        token: token
                        // domain: regionalChannelURL + 'v3/directline',
                    });
                    setDirectLine(directline);
                    // directline = ReactWebChat.createDirectLine({
                    //     token: conversationInfo.token,
                    //     domain: regionalChannelURL + 'v3/directline',
                    // });
                    ReactWebChatLib.createStore()
                }

                // create store
                const localStore = ReactWebChatLib.createStore(
                    {},
                    ({ dispatch }: { dispatch: Dispatch }) => (next: any) => (action: any) => {
                        console.log("Action1:", action);
                        // Checking whether we should greet the user
                        if (props.greet) {
                            if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
                                console.log("Action:" + action.type);
                                dispatch({
                                    meta: {
                                        method: "keyboard",
                                    },
                                    payload: {
                                        activity: {
                                            channelData: {
                                                postBack: true,
                                            },
                                            //Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
                                            name: 'startConversation',
                                            type: "event"
                                        },
                                    },
                                    type: "DIRECT_LINE/POST_ACTIVITY",
                                });
                                return next(action);
                            }
                        }

                        // Checking whether the bot is asking for authentication
                        if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
                            const activity = action.payload.activity;
                            if (activity.from && activity.from.role === 'bot' &&
                                (getOAuthCardResourceUri(activity))) {
                                directline.postActivity({
                                    type: 'invoke',
                                    name: 'signin/tokenExchange',
                                    value: {
                                        id: activity.attachments[0].content.tokenExchangeResource.id,
                                        connectionName: activity.attachments[0].content.connectionName,
                                        token: data?.exchangeToken//token
                                    },
                                    "from": {
                                        id: props.userEmail,
                                        name: props.userFriendlyName,
                                        role: "user"
                                    }
                                }).subscribe(
                                    (id: any) => {
                                        if (id === "retry") {
                                            // bot was not able to handle the invoke, so display the oauthCard (manual authentication)
                                            console.log("bot was not able to handle the invoke, so display the oauthCard")
                                            return next(action);
                                        }
                                    },
                                    (error: any) => {
                                        // an error occurred to display the oauthCard (manual authentication)
                                        console.log("An error occurred so display the oauthCard");
                                        return next(action);
                                    }
                                )
                                // token exchange was successful, do not show OAuthCard
                                return;
                            }
                        } else {
                            return next(action);
                        }

                        return next(action);
                    }
                );
                setStore(localStore);


            } catch (error) {
                console.log(error);
            }
            //setLoading(false);
        };

        loadBotToken();

    }, []);

    return (
        <div id="chatContainer" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {loading ?
                <Spinner />
                :
                directLine ?
                    // <ReactWebChat directLine={directLine} userID={props.userEmail} store={store} /> 
                    <Components.Composer directLine={directLine} store={store} >
                        <Components.BasicTranscript />
                        <SendMessageCtrl />
                    </Components.Composer>
                    :
                    <div>Cannot load web bot</div>}
        </div>

    );
};