import React, { useEffect, useState } from 'react';
import { GoogleUser } from './googleLogin';
import { RenderEmail } from './renderEmails';
import styled from 'styled-components';

declare const window: any;

const EmailsContainer = styled.div`
    width: 100%;
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    height: 90vh;
`;

const EmailListContainer = styled.div`
    width: 30%;
    overflow-y: scroll;
`;

const EmailSubjectContainer = styled.div`
    cursor: pointer;
    margin: 5px;
    border: 1px solid #656664;
    padding: 10px;
    border-radius: 10px
`;

const SubjectLine = styled.p`
    margin: auto;
`;


export interface Email {
    id: string;
    threadId: string;
}

interface UserEmailsProps {
    user: GoogleUser | undefined;
}

export const UserEmails: React.FC<UserEmailsProps> = ({ user }: UserEmailsProps) => {
    const [emails, setEmails] = useState<Array<Email>>([]);
    const [emailSelected, setEmailSelected] = useState<any>(null);


    useEffect(() => {
        function getEmail(email: any) {
            var messageRequest = window.gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': email.id
            });
            messageRequest.execute((emailData: any) => setEmails(e => [emailData, ...e]));
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
                'maxResults': 10
            });
            request.execute(getEmails);
        }
        if (user)
            window.gapi.client.load('gmail', 'v1', loadEmails);
    }, [user])

    const getEmailSubject = (email: any) => {
        return email.payload.headers.filter((header: any) => header.name === "Subject")[0].value;
    }

    const renderEmailHeader = (email: any) => {
        return (
            <EmailSubjectContainer key={email.id} onClick={() => setEmailSelected(email)}>
                <SubjectLine>{getEmailSubject(email)}</SubjectLine>
            </EmailSubjectContainer>
        )
    }

    const renderEmailList = () => {
        return (
            <EmailListContainer>
                {
                    emails.map(email => renderEmailHeader(email))
                }
            </EmailListContainer>
        )
    }

    const renderEmailContent = () => {
        return (
            emailSelected ? <RenderEmail email={emailSelected} /> : <p style={{ width: "70%" }}>Select an email</p>
        )
    }

    return (
        <EmailsContainer>
            {renderEmailList()}
            {renderEmailContent()}
        </EmailsContainer>
    );
}