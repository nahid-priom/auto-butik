import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '~/store/user/userHooks';
import { customerApi } from '~/api/graphql/account.api';

type AuthOptions = {
  requireAuth?: boolean;
  redirectTo?: string;
  redirectIfFound?: boolean;
};

export function withAuth(
  WrappedComponent: React.ComponentType<any>,
  options: AuthOptions = {}
) {
  const { requireAuth = true, redirectTo = '/account/login', redirectIfFound = false } = options;

  const WithAuth = (props: any) => {
    const router = useRouter();
    const user = useUser();
    const isAuthenticated = customerApi.isAuthenticated();

    useEffect(() => {
      // If redirectIfFound is also set, redirect if the user was found
      if (redirectIfFound && user) {
        router.push(redirectTo);
        return;
      }

      // If auth is required and user is not logged in, redirect to login
      if (requireAuth && !isAuthenticated) {
        // Store the current URL to redirect back after login
        const returnUrl = router.asPath;
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    }, [user, isAuthenticated, router, redirectTo, requireAuth, redirectIfFound]);

    // If redirectIfFound is set and user is found, don't render the component
    if (redirectIfFound && user) {
      return null;
    }

    // If auth is required and user is not authenticated, don't render the component
    if (requireAuth && !isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for the HOC for better debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuth.displayName = `withAuth(${displayName})`;

  return WithAuth;
}

export function withGuest(WrappedComponent: React.ComponentType<any>, redirectTo = '/account/dashboard') {
  return withAuth(WrappedComponent, {
    requireAuth: false,
    redirectTo,
    redirectIfFound: true,
  });
}
