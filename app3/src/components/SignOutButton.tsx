import * as React from "react";
import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react";

export const SignOutButton = () => {
    const { instance } = useMsal();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLogout = (logoutType: string) => {
        setAnchorEl(null);

        if (logoutType === "popup") {
            instance.logoutPopup({
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect();
        }
    }
    const _items: ICommandBarItemProps[] = [
        {
            key: 'logout',
            text: 'Logout',
            //iconProps: { iconName: 'Add' },
            // split: true,
            // ariaLabel: 'New',
            subMenuProps: {
                items: [
                    {
                        key: 'popup',
                        text: 'Sign out using Popup',
                        iconProps: { iconName: 'Unlock' },
                        onClick: () => handleLogout("popup")
                    },
                    {
                        key: 'redirect',
                        text: 'Sign out using Redirect',
                        iconProps: { iconName: 'Unlock' },
                        onClick: () => handleLogout("redirect")
                    },
                ],
            },
        }];

    return (
        <div style={{ width: 200 }}>
            <CommandBar
                items={_items}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
        </div>
    )
};