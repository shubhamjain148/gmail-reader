import React, { useEffect, useState } from 'react';
import { GoogleUser } from './googleLogin';
import { RenderEmail } from './renderEmails';
import styled from 'styled-components';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getUserEmails, getEmail } from '../service/emailService';


const EmailsContainer = styled.div`
    width: 100%;
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    height: 90vh;
`;

interface divProps {
    readonly isSelected: boolean;
}

const EmailSubjectContainer = styled.div<divProps>`
    cursor: pointer;
    margin: 5px;
    border: 1px solid #656664;
    padding: 10px;
    border-radius: 10px;
    background-color: ${({ isSelected }) => (isSelected ? `aqua` : `white`)};
`;

const EmailListContainer = styled.div`
    margin: 10px;
`;

const EmailPageContainer = styled.div`
    width: 30%;
    position: relative;
    overflow-y: scroll;
`;

const PageNavigationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    position: sticky;
    bottom: 0;
    font-size: 20px;
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
    const [tokens, setTokens] = useState<Array<string>>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [emailSelected, setEmailSelected] = useState<any>(null);
    const [selectedEmailIndex, setSelectedEmailIndex] = useState<number>(-1);

    async function getUserEmail(email: any) {
        const response = await getEmail(email.id);
        setEmails(e => [response.result, ...e])
    }

    useEffect(() => {
        if (user) {
            (async function callGetUserEmails() {
                const response = await getUserEmails(10);
                console.log("emails are ", response);
                setTokens(currentTokens => [...currentTokens, response.result.nextPageToken]);
                response.result.messages.forEach((email: any) => getUserEmail(email));
            })();
        }
    }, [user])

    const getEmailSubject = (email: any) => {
        return email.payload.headers.filter((header: any) => header.name === "Subject")[0].value;
    }

    useEffect(() => {
        if (emailSelected && emails.length > 0) {
            setSelectedEmailIndex(emails.findIndex(email => email.id === emailSelected.id));
        }
    }, [emailSelected, emails])

    const renderEmailHeader = (email: any, index: number) => {
        return (
            <EmailSubjectContainer isSelected={selectedEmailIndex === index} key={email.id} onClick={() => setEmailSelected(email)}>
                <SubjectLine>{getEmailSubject(email)}</SubjectLine>
            </EmailSubjectContainer>
        )
    }

    const handleNextPageClick = async () => {
        setEmails([]);
        setEmailSelected(null);
        setSelectedEmailIndex(-1);
        const response = await getUserEmails(10, tokens[tokens.length - 1]);
        console.log("emails are ", response);
        setTokens(currentTokens => [...currentTokens, response.result.nextPageToken]);
        response.result.messages.forEach((email: any) => getUserEmail(email));
        setCurrentPage(cp => cp + 1);
    }

    const handlePrevPageClick = async () => {
        setEmails([]);
        setEmailSelected(null);
        setSelectedEmailIndex(-1);
        const response = await getUserEmails(10, tokens.length > 2 ? tokens[tokens.length - 3] : null);
        console.log("emails are ", response);
        setTokens(currentTokens => [...currentTokens.slice(0, -2), response.result.nextPageToken]);
        response.result.messages.forEach((email: any) => getUserEmail(email));
        setCurrentPage(cp => cp - 1);
    }

    const renderEmailList = () => {
        return (
            <EmailPageContainer>
                <EmailListContainer>
                    {
                        emails.map((email, index) => renderEmailHeader(email, index))
                    }
                </EmailListContainer>
                {emails.length > 0 &&
                    <PageNavigationContainer>
                        {currentPage > 0 && <ArrowLeftOutlined onClick={handlePrevPageClick} />}
                        {tokens.length > 0 && <ArrowRightOutlined onClick={handleNextPageClick} />}
                    </PageNavigationContainer>}
            </EmailPageContainer>
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