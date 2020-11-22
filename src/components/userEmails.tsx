import React, { useEffect, useState } from 'react';
import { GoogleUser } from './googleLogin';
import { RenderEmail } from './renderEmails';

declare const window: any;

export interface Email {
    id: string;
    threadId: string;
}

interface UserEmailsProps {
    user: GoogleUser | undefined;
}

export const UserEmails: React.FC<UserEmailsProps> = ({ user }: UserEmailsProps) => {
    const [emails, setEmails] = useState<Array<Email>>([]);


    useEffect(() => {
        function getEmail(email: any) {
            var messageRequest = window.gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': email.id
            });
            messageRequest.execute((emailData: any) => setEmails(e => [...e, emailData]));
        }

        function getEmails(response: any) {
            console.log("emails are ", response);
            response.messages.forEach((email: any) => getEmail(email));
        }

        function loadEmails() {
            const request = window.gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': 'INBOX',
                'q': 'from:noreply@medium.com',
                'maxResults': 1
            });
            request.execute(getEmails);
        }
        if (user)
            window.gapi.client.load('gmail', 'v1', loadEmails);
    }, [user])

    return (
        <div>
            {
                emails.map(email => <RenderEmail email={email} />)
            }
        </div>
    );
}