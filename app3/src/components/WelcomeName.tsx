import * as React from "react";
import { useEffect, useState } from "react";
import { useMsal, useAccount, useIsAuthenticated } from "@azure/msal-react";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react";

export const WelcomeName = () => {
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [name, setName] = useState("");
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (account && account.name) {
            setName(account.name);
        } else {
            setName("");
        }
    }, [account]);

    const _items: ICommandBarItemProps[] = [
        {
            key: 'login',
            text: isAuthenticated ? "Welcome, " + name : "Please login"
        }];

    return (
        <div style={{ width: 200 }}>
            <CommandBar
                items={_items}
                ariaLabel="Use left and right arrow keys to navigate between commands"
            />
        </div>
    )

    // if (name) {
    //     return <div>Welcome, {name}</div>;
    // } else {
    //     return null;
    // }
};
