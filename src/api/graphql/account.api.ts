import { ApolloClient, InMemoryCache, createHttpLink, gql, ApolloError } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { IUser, IAuthResponse } from '~/interfaces/user';
import { IAddress } from '~/interfaces/user';
import { IOrder } from '~/interfaces/order';
import { IListOptions, IOrdersList } from '~/interfaces/list';
import { IEditAddressData } from '~/api/base';

// Define GraphQL response types
interface CurrentUser {
  __typename: 'CurrentUser';
  id: string;
  identifier: string;
  channels?: Array<{ token: string }>;
}

interface ErrorResult {
  __typename: string;
  errorCode: string;
  message: string;
}

type LoginResponse = CurrentUser | ErrorResult;
type RegisterResponse = { __typename: 'Success'; success: boolean } | ErrorResult | { __typename: 'PasswordValidationError'; errorCode: string; message: string };

// Create HTTP link to Vendure Shop API via same-origin proxy (Next.js rewrites)
const getApiUrl = () => '/shop-api';

const httpLink = createHttpLink({
  uri: getApiUrl(),
  // Include cookies so the Vendure session is persisted across requests
  credentials: 'include',
});

// Auth middleware to add token to requests
const authLink = setContext((_, { headers = {} }) => {
  // Get tokens from localStorage (only in browser)
  const channelToken = typeof window !== 'undefined' ? localStorage.getItem('customerToken') : null;
  const bearerToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const extraHeaders: Record<string, string> = {};
  if (channelToken) {
    // Vendure expects the channel token in the `vendure-token` header
    extraHeaders['vendure-token'] = channelToken;
  }
  if (bearerToken) {
    // Optional: support bearer-token sessions if backend is configured that way
    extraHeaders['authorization'] = `Bearer ${bearerToken}`;
  }

  return {
    headers: {
      ...headers,
      ...extraHeaders,
    },
  };
});

// Create Apollo Client instance
export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

// GraphQL mutations
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(username: $email, password: $password) {
      __typename
      ... on CurrentUser {
        id
        identifier
        channels {
          token
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterCustomer($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      __typename
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query Me {
    me {
      id
      identifier
      firstName
      lastName
      emailAddress
    }
  }
`;

export const GET_ACTIVE_CUSTOMER = gql`
  query GetActiveCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          id
          name
          code
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
      }
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
    }
  }
`;

// Address mutations
export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CreateCustomerAddress($input: CreateAddressInput!) {
    createCustomerAddress(input: $input) {
      id
      fullName
      company
      streetLine1
      streetLine2
      city
      province
      postalCode
      country { code name }
      phoneNumber
      defaultShippingAddress
      defaultBillingAddress
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
    updateCustomerAddress(input: $input) {
      id
      fullName
      company
      streetLine1
      streetLine2
      city
      province
      postalCode
      country { code name }
      phoneNumber
      defaultShippingAddress
      defaultBillingAddress
    }
  }
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation DeleteCustomerAddress($id: ID!) {
    deleteCustomerAddress(id: $id) {
      success
    }
  }
`;

// Orders queries
export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($options: OrderListOptions) {
    activeCustomer {
      id
      orders(options: $options) {
        totalItems
        items {
          id
          code
          state
          orderPlacedAt
          totalWithTax
          totalQuantity
        }
      }
    }
  }
`;

export const GET_ORDER_BY_CODE = gql`
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      code
      state
      orderPlacedAt
      totalWithTax
      totalQuantity
      lines {
        id
        quantity
        unitPriceWithTax
        linePriceWithTax
        productVariant {
          id
          name
          sku
          product { name }
        }
      }
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country { name }
        phoneNumber
      }
      billingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country { name }
        phoneNumber
      }
    }
  }
`;

// API methods
export const customerApi = {
  async signIn(email: string, password: string): Promise<IUser> {
    try {
      const { data } = await graphqlClient.mutate<{ login: LoginResponse }>({
        mutation: LOGIN_MUTATION,
        variables: {
          email,
          password,
        },
      });

      if (!data?.login) {
        throw new Error('No response from server');
      }

      if (data.login.__typename === 'CurrentUser') {
        const currentUser = data.login as CurrentUser;
        // Store the token in localStorage
        const token = currentUser.channels?.[0]?.token;
        if (token) {
          localStorage.setItem('customerToken', token);
        }
        
        // Try to fetch additional user data, but don't fail the login if it doesn't work
        try {
          const userData = await this.getCurrentUser();
          if (userData) {
            return userData;
          }
          // If we can't get full user data, return a minimal user object
          return {
            id: currentUser.id,
            email: currentUser.identifier, // Using identifier as email
            firstName: '',
            lastName: '',
            identifier: currentUser.identifier,
          };
        } catch (error) {
          console.error('Error fetching user data after login:', error);
          // Return a minimal user object even if we can't fetch full data
          return {
            id: currentUser.id,
            email: currentUser.identifier,
            firstName: '',
            lastName: '',
            identifier: currentUser.identifier,
          };
        }
      } else if (data.login.__typename === 'NotVerifiedError') {
        // Return a rejected promise with the error message
        return Promise.reject(new Error(`EMAIL_NOT_VERIFIED:${data.login.message || 'Please verify your email address'}`));
      } else if (data.login.__typename === 'InvalidCredentialsError') {
        // Return a rejected promise with the error
        return Promise.reject(new Error('INVALID_CREDENTIALS'));
      }

      throw new Error(
        (data.login as ErrorResult).message || 'Login failed. Please check your credentials.'
      );
    } catch (error) {
      if (error instanceof ApolloError) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during login');
    }
  },

  // Address helpers (mapping Vendure <-> app types)
  mapVendureAddressToApp(address: any): IAddress {
    const [firstName = '', ...rest] = (address.fullName || '').trim().split(' ');
    const lastName = rest.join(' ');
    return {
      id: Number(address.id),
      firstName,
      lastName,
      company: address.company || '',
      country: address.country?.code || '',
      address1: address.streetLine1 || '',
      address2: address.streetLine2 || '',
      city: address.city || '',
      state: address.province || '',
      postcode: address.postalCode || '',
      email: '',
      phone: address.phoneNumber || '',
      default: Boolean(address.defaultShippingAddress || address.defaultBillingAddress),
    };
  },

  buildCreateAddressInput(data: IEditAddressData) {
    return {
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      company: data.company || undefined,
      streetLine1: data.address1,
      streetLine2: data.address2 || undefined,
      city: data.city,
      province: data.state,
      postalCode: data.postcode,
      // Vendure expects a valid countryCode; ensure uppercase
      countryCode: (data.country || '').toUpperCase(),
      phoneNumber: data.phone || undefined,
      defaultShippingAddress: data.default,
      defaultBillingAddress: data.default,
    };
  },

  // Orders mapping
  mapOrderListItem(o: any): Partial<IOrder> & { id: number } {
    return {
      id: Number(o.id),
      token: o.code,
      number: o.code,
      createdAt: o.orderPlacedAt,
      status: o.state,
      total: o.totalWithTax,
      quantity: o.totalQuantity,
    } as any;
  },

  mapOrderDetail(o: any): IOrder {
    const items = (o.lines || []).map((l: any) => ({
      product: { name: l.productVariant?.product?.name || l.productVariant?.name || '' } as any,
      options: [],
      price: l.unitPriceWithTax,
      quantity: l.quantity,
      total: l.linePriceWithTax,
    }));

    const mapAddr = (a: any) => ({
      firstName: (a?.fullName || '').split(' ')[0] || '',
      lastName: (a?.fullName || '').split(' ').slice(1).join(' ') || '',
      company: a?.company || '',
      country: a?.country?.name || '',
      address1: a?.streetLine1 || '',
      address2: a?.streetLine2 || '',
      city: a?.city || '',
      state: a?.province || '',
      postcode: a?.postalCode || '',
      email: '',
      phone: a?.phoneNumber || '',
    });

    return {
      id: Number(o.id),
      token: o.code,
      number: o.code,
      createdAt: o.orderPlacedAt,
      payment: '',
      status: o.state,
      items,
      quantity: o.totalQuantity,
      subtotal: items.reduce((s: number) => s, 0),
      totals: [],
      total: o.totalWithTax,
      shippingAddress: mapAddr(o.shippingAddress),
      billingAddress: mapAddr(o.billingAddress),
    } as IOrder;
  },

  async getAddresses(): Promise<IAddress[]> {
    const current = await this.getCurrentUser();
    const raw = (current as any)?.addresses || [];
    return raw.map((a: any) => this.mapVendureAddressToApp(a));
  },

  async getAddress(addressId: number): Promise<IAddress> {
    const list = await this.getAddresses();
    const found = list.find((a) => a.id === addressId);
    if (!found) throw new Error('Address not found');
    return found;
  },

  async getDefaultAddress(): Promise<IAddress | null> {
    const list = await this.getAddresses();
    return list.find((a) => a.default) || null;
  },

  async addAddress(data: IEditAddressData): Promise<IAddress> {
    const { data: resp } = await graphqlClient.mutate<{ createCustomerAddress: any }>({
      mutation: CREATE_CUSTOMER_ADDRESS,
      variables: { input: this.buildCreateAddressInput(data) },
    });
    if (!resp?.createCustomerAddress) throw new Error('Failed to create address');
    return this.mapVendureAddressToApp(resp.createCustomerAddress);
  },

  async editAddress(addressId: number, data: IEditAddressData): Promise<IAddress> {
    const { data: resp } = await graphqlClient.mutate<{ updateCustomerAddress: any }>({
      mutation: UPDATE_CUSTOMER_ADDRESS,
      variables: {
        input: {
          id: String(addressId),
          ...this.buildCreateAddressInput(data),
        },
      },
    });
    if (!resp?.updateCustomerAddress) throw new Error('Failed to update address');
    return this.mapVendureAddressToApp(resp.updateCustomerAddress);
  },

  async delAddress(addressId: number): Promise<void> {
    const { data: resp } = await graphqlClient.mutate<{ deleteCustomerAddress: { success: boolean } }>({
      mutation: DELETE_CUSTOMER_ADDRESS,
      variables: { id: String(addressId) },
    });
    if (!resp?.deleteCustomerAddress?.success) {
      throw new Error('Failed to delete address');
    }
  },

  // Orders API
  async getOrdersList(options?: IListOptions): Promise<IOrdersList> {
    const take = options?.limit ?? 5;
    const { data } = await graphqlClient.query<{ activeCustomer: { orders: { totalItems: number; items: any[] } } | null }>({
      query: GET_CUSTOMER_ORDERS,
      variables: { options: { take, sort: { orderPlacedAt: 'DESC' } } },
      fetchPolicy: 'network-only',
    });
    const list = data.activeCustomer?.orders || { totalItems: 0, items: [] };
    const items = list.items.map((o) => this.mapOrderListItem(o)) as IOrder[] as any;
    return {
      items: items as any,
      navigation: {
        type: 'page',
        page: 1,
        limit: take,
        total: list.totalItems,
        pages: Math.max(1, Math.ceil(list.totalItems / take)),
        from: 1,
        to: Math.min(take, list.totalItems),
      },
      sort: 'orderPlacedAt:DESC',
    } as unknown as IOrdersList;
  },

  async getOrderById(id: number): Promise<IOrder> {
    // Fetch a page of orders and find by id (Shop API lacks direct query by id)
    const result = await this.getOrdersList({ limit: 50 });
    const match = (result.items as any[]).find((o) => o.id === id);
    if (!match) throw new Error('Order not found');
    // Retrieve full details by code
    return this.getOrderByToken(match.token);
  },

  async getOrderByToken(token: string): Promise<IOrder> {
    const { data } = await graphqlClient.query<{ orderByCode: any }>({
      query: GET_ORDER_BY_CODE,
      variables: { code: token },
      fetchPolicy: 'network-only',
    });
    if (!data.orderByCode) throw new Error('Order not found');
    return this.mapOrderDetail(data.orderByCode);
  },

  async signUp(email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<{ success: boolean }> {
    try {
      console.log('Attempting registration with:', { email, firstName, lastName, phone });
      
      const { data } = await graphqlClient.mutate<{ registerCustomerAccount: RegisterResponse }>({
        mutation: REGISTER_MUTATION,
        variables: {
          input: {
            emailAddress: email,
            firstName,
            lastName,
            password,
            ...(phone && { phoneNumber: phone }),
          },
        },
      });

      console.log('Registration response:', data);

      if (!data?.registerCustomerAccount) {
        console.error('No response from server');
        throw new Error('No response from server');
      }

      if (data.registerCustomerAccount.__typename === 'Success') {
        console.log('Registration successful');
        return { success: true };
      }

      // Handle specific error types
      if (data.registerCustomerAccount.__typename === 'PasswordValidationError') {
        console.error('Password validation error:', data.registerCustomerAccount);
        throw new Error('PASSWORD_VALIDATION_ERROR');
      }

      const errorResult = data.registerCustomerAccount as ErrorResult;
      console.error('Registration failed with error:', errorResult);
      throw new Error(
        errorResult.errorCode || errorResult.message || 'Registration failed'
      );
    } catch (error) {
      console.error('Registration error details:', error);
      if (error instanceof ApolloError) {
        console.error('Apollo error:', error.graphQLErrors, error.networkError);
        throw new Error(error.message);
      }
      // Re-throw the error if it's already been processed above
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during registration');
    }
  },

  async getCurrentUser(): Promise<IUser | null> {
    try {
      const { data, errors } = await graphqlClient.query<{ activeCustomer: any | null }>({
        query: GET_ACTIVE_CUSTOMER,
        fetchPolicy: 'network-only',
      });

      // If there are GraphQL errors or no data, return null
      if (errors || !data?.activeCustomer) {
        console.error('Failed to fetch current user:', errors || 'No user data');
        return null;
      }

      // Return the formatted user data
      return {
        id: data.activeCustomer.id,
        email: data.activeCustomer.emailAddress || '',
        firstName: data.activeCustomer.firstName || '',
        lastName: data.activeCustomer.lastName || '',
        phone: data.activeCustomer.phoneNumber || '',
        title: data.activeCustomer.title || '',
        identifier: data.activeCustomer.emailAddress || '',
        addresses: data.activeCustomer.addresses || [],
        // Add any additional user fields as needed
      };
    } catch (error) {
      // Handle network or other errors
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  },

  async updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string; // Note: Shop API does not update email here
    phone?: string;
    title?: string;
  }): Promise<IUser> {
    try {
      const { data: resp } = await graphqlClient.mutate<{
        updateCustomer: {
          id: string;
          title?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          emailAddress?: string | null;
          phoneNumber?: string | null;
        } | null;
      }>({
        mutation: UPDATE_CUSTOMER_MUTATION,
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phone,
            title: data.title,
          },
        },
      });

      if (!resp?.updateCustomer) {
        throw new Error('Failed to update profile');
      }

      const updated = resp.updateCustomer;
      return {
        id: updated.id,
        email: updated.emailAddress || '',
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        phone: updated.phoneNumber || '',
        title: updated.title || '',
        identifier: updated.emailAddress || '',
      };
    } catch (error) {
      throw new Error('Profile update failed');
    }
  },

  signOut(): Promise<void> {
    localStorage.removeItem('customerToken');
    // Clear Apollo cache
    graphqlClient.clearStore();
    return Promise.resolve();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('customerToken');
  },
};

export default customerApi;
