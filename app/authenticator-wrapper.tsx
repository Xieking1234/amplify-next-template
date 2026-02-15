"use client"
import "./globals.css"
import { Authenticator } from "@aws-amplify/ui-react";

export default function AuthenticatorWrapper({
                                                 children,
                                             }: {

    children: React.ReactNode;
}) {
    console.log("Authenticator mounted");


    return(
        <div className="mt-40">
        <Authenticator>{({ signOut, user }) => (
        <>{children}</>
    )}</Authenticator>
        </div>
);
}