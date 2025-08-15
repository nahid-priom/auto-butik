// react
import React from 'react';
// application
import { AppDispatch } from '~/store/types';
import { optionsSetAll } from '~/store/options/optionsActions';
import { wrapper } from '~/store/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
    const dispatch = store.dispatch as AppDispatch;

    await dispatch(optionsSetAll({
        desktopHeaderVariant: 'spaceship/one',
        mobileHeaderVariant: 'two',
    }));

    return { props: {} };
});

function Page() {
    return (
        <React.Fragment />
    );
}

export default Page;
