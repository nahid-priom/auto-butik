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

// Create HTTP link to Vendure Shop API
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/shop-api', // Update with your Vendure server URL
});

// Auth middleware to add token to requests
const authLink = setContext((_, { headers = {} }) => {
  // Get the token from localStorage
  const token = localStorage.getItem('customerToken');
  
  // Return the headers with the token if it exists
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
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

  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ success: boolean }> {
    try {
      const { data } = await graphqlClient.mutate<{ registerCustomerAccount: RegisterResponse }>({
        mutation: REGISTER_MUTATION,
        variables: {
          input: {
            emailAddress: email,
            firstName,
            lastName,
            password,
            // Removed channel as it's not part of RegisterCustomerInput
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
      const { data, errors } = await graphqlClient.query<{ me: IUser | null }>({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only',
      });

      // If there are GraphQL errors or no data, return null
      if (errors || !data?.me) {
        console.error('Failed to fetch current user:', errors || 'No user data');
        return null;
      }

      // Return the formatted user data
      return {
        id: data.me.id,
        email: data.me.emailAddress || '',
        firstName: data.me.firstName || '',
        lastName: data.me.lastName || '',
        identifier: data.me.identifier || '',
        // Add any additional user fields as needed
      };
    } catch (error) {
      // Handle network or other errors
      console.error('Error in getCurrentUser:', error);
      return null;
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
