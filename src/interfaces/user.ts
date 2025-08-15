export interface IUser {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    identifier?: string;
    // Add any additional fields that might come from the GraphQL API
    [key: string]: any;
}

export interface IAuthResponse {
    user: IUser | null;
    token?: string;
    error?: string;
}
