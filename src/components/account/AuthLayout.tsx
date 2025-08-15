// react
import React, { PropsWithChildren } from 'react';
// third-party
import { ToastContainer } from 'react-toastify';
// application
import { useOptions } from '~/store/options/optionsHooks';

interface Props extends PropsWithChildren<{}> {}

function AuthLayout(props: Props) {
    const { children } = props;
    const { mobileHeaderVariant } = useOptions();
    const mobileVariantClass = `mobile-${mobileHeaderVariant}`;

    const classes = `site site--auth site--mobile-header--${mobileVariantClass}`;

    return (
        <div className={classes}>
            <ToastContainer autoClose={5000} hideProgressBar />
            <div className="site__container">
                <div className="site__body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
