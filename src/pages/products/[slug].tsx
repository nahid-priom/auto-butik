// react
import React from 'react';
// third-party
import { GetServerSideProps } from 'next';
// application
import ShopPageProduct from '~/components/shop/ShopPageProduct';
import { IProduct } from '~/interfaces/product';
import { fetchProductDetail } from '~/api/graphql/products.api';
import SitePageNotFound from '~/components/site/SitePageNotFound';

interface Props {
    product: IProduct | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
    const slug = typeof params?.slug === 'string' ? params?.slug : null;

    try {
        const product = slug ? await fetchProductDetail(slug) : null;
        
        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            props: {
                product: null,
            },
        };
    }
};

function Page(props: Props) {
    const { product } = props;

    if (product === null) {
        return <SitePageNotFound />;
    }

    return (
        <ShopPageProduct
            product={product}
            layout="full"
        />
    );
}

export default Page;
