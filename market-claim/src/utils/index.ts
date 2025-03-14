import axios, { AxiosHeaders, AxiosInstance } from 'axios';

export class APIInstance {
    private axiosInstance: AxiosInstance
    constructor(baseUrl: string, timeout?: number, headers?: AxiosHeaders) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            timeout,
            headers
        })
    }

    getInstance(): AxiosInstance {
        return this.axiosInstance
    }
}