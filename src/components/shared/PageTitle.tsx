// react
import React, { PropsWithChildren } from 'react';
// third-party
import Head from 'next/head';

interface Props extends PropsWithChildren<{}> {}

function PageTitle(props: Props) {
    const { children } = props;
    const title = children || '';
    const fullTitle = title ? `${title} — RedParts` : 'RedParts';

    return (
        <Head>
            <title>{fullTitle}</title>
        </Head>
    );
}

export default PageTitle;
