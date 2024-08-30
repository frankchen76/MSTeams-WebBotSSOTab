import * as React from "react";
import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react";

export const SignInButton = () => {
    const { instance } = useMsal();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLogin = (loginType: string) => {
        setAnchorEl(null);

        if (loginType === "popup") {
            instance.loginPopup(loginRequest);
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest);
        }
    }
    const _items: ICommandBarItemProps[] = [
        {
            key: 'login',
            text: 'Login',
            //iconProps: { iconName: 'Add' },
            split: true,
            ariaLabel: 'New',
            subMenuProps: {
                items: [
                    {
                        key: 'popup',
                        text: 'Sign in using Popup',
                        iconProps: { iconName: 'Contact' },
                        onClick: () => handleLogin("popup")
                    },
                    {
                        key: 'redirect',
                        text: 'Sign in using Redirect',
                        iconProps: { iconName: 'Contact' },
                        onClick: () => handleLogin("redirect")
                    },
                ],
            },
        }];

    return (
        <div>
            <CommandBar
                items={_items}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
        </div>
    )
};