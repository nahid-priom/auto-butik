// react
import React from 'react';
// application
import { AppDispatch } from '~/store/types';
import { optionsSetAll } from '~/store/options/optionsActions';
import { wrapper } from '~/store/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
    const dispatch = store.dispatch as AppDispatch;

    await dispatch(optionsSetAll({
        desktopHeaderVariant: 'classic/one',
        mobileHeaderVariant: 'one',
    }));

    return { props: {} };
});

function Page() {
    return (
        <React.Fragment />
    );
}

export default Page;
