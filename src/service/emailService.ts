import axios, { AxiosResponse } from 'axios';
import { Email } from '../components/userEmails';

export const getEmailsBasedOnSender = (userId: string): Promise<AxiosResponse<[Email]>> => {
    return axios.get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`);
}

export const getUserEmails = async (limit: number, pageToken: string = null) => {
    const listEmailPayload = {
        'labelIds': 'INBOX',
        'q': 'from:noreply@medium.com',
        'maxResults': limit,
        pageToken: pageToken,
    };

    return await window.gapi.client.request({
        path: `gmail/v1/users/me/messages`,
        params: listEmailPayload,
    });
}

export const getEmail = async (emailId: string) => {
    return await window.gapi.client.request({
        path: `gmail/v1/users/me/messages/${emailId}`
    });
}