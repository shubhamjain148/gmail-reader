import axios, { AxiosResponse } from 'axios';
import { Email } from '../components/userEmails';

export const getEmailsBasedOnSender = (userId: string): Promise<AxiosResponse<[Email]>> => {
    return axios.get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`);
}