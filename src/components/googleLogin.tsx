import React, { useEffect, useState } from 'react';
import { UserEmails } from './userEmails';

declare const window: any;

export interface GoogleAuth {
    isSignedIn: any;
    signOut: any;
    currentUser: any;
}

export interface GoogleUser {
    getBasicProfile: Function;
}

const GoogleLoginContainer: React.FC<{}> = () => {
    const [googleAuth, setGoogleAuth] = useState<GoogleAuth>();
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [user, setUser] = useState<GoogleUser>();
    const onSuccess = (e: any) => {
        console.log("success is ", e);
    }

    const onFailure = (e: any) => {
        console.log("failure is ", e);
    }

    useEffect(() => {
        (async function loadOuth2() {
            window.gapi.load('client:auth2', async () => {
                await window.gapi.client.init({
                    clientId: "891866724637-rqhpb7cep2ntkhenomcau08dcob1ltqf.apps.googleusercontent.com",
                    apiKey: "AIzaSyBzXvWyN7N8dxJcnw-82JP5tUZRN-pPHQs",
                    'scope': 'profile email https://www.googleapis.com/auth/gmail.readonly'
                });
                const auth = window.gapi.auth2.getAuthInstance();
                setGoogleAuth(auth);
                auth.isSignedIn.listen(setIsSignedIn);
                setIsSignedIn(auth.isSignedIn.get());
            })
        })();
    }, [])

    useEffect(() => {
        if (!isSignedIn) {
            console.log('rendering');
            window.gapi.signin2.render('mySignIn', {
                'scope': 'profile email https://www.googleapis.com/auth/gmail.readonly',
                'width': 250,
                'height': 50,
                'longtitle': false,
                'onsuccess': onSuccess,
                'onfailure': onFailure
            })
        } else if (googleAuth) {
            setUser(googleAuth?.currentUser.get());
            console.log('user is ', googleAuth?.currentUser.get().getBasicProfile);
        }
    }, [isSignedIn, googleAuth])

    const signOut = () => {
        if (googleAuth) {
            (async function signOutFromGoogle() {
                await googleAuth.signOut();
            })();
        }
    }

    return (
        isSignedIn ? <> <UserEmails user={user} /> <div onClick={signOut}>{`${user?.getBasicProfile().getName()} is Signed in`}</div></> : <div id="mySignIn"></div>
    );
}

export default GoogleLoginContainer;
