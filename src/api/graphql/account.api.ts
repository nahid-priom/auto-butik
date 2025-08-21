import { ApolloClient, InMemoryCache, createHttpLink, gql, ApolloError } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { IUser, IAuthResponse } from '~/interfaces/user';

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
type RegisterResponse = { __typename: 'Success'; success: boolean } | ErrorResult;

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

  async signUp(email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<{ success: boolean }> {
    try {
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

      if (!data?.registerCustomerAccount) {
        throw new Error('No response from server');
      }

      if (data.registerCustomerAccount.__typename === 'Success') {
        return { success: true };
      }

      throw new Error(
        (data.registerCustomerAccount as ErrorResult).message || 'Registration failed'
      );
    } catch (error) {
      if (error instanceof ApolloError) {
        throw new Error(error.message);
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
