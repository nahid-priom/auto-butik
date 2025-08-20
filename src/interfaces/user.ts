export interface IAddress {
    id: string;
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province?: string;
    postalCode: string;
    country: {
        id: string;
        name: string;
        code: string;
    };
    phoneNumber?: string;
    defaultShippingAddress: boolean;
    defaultBillingAddress: boolean;
}

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    identifier: string;
    title?: string;
    addresses?: IAddress[];
    // Add any additional fields that might come from the GraphQL API
    [key: string]: any;
}

export interface IAuthResponse {
    user: IUser | null;
    token?: string;
    error?: string;
}
