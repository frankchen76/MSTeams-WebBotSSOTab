import { Stack } from '@fluentui/react';
import { WelcomeName } from './WelcomeName';
import { SignInSignOutButton } from './SignInSignOutButton';

export const LoginHeader = () => {
    const fixStyle: React.CSSProperties = {
        "overflow": "hidden",
        "position": "fixed",
        "top": 0

    };
    return (
        <div>
            <Stack horizontal horizontalAlign="space-evenly" className="navbar">
                <WelcomeName />
                <SignInSignOutButton />
            </Stack>
        </div>
    );
}