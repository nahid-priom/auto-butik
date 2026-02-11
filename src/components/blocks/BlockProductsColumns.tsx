// react
import React from 'react';
// application
import ProductCard from '~/components/shared/ProductCard';
import { IProduct } from '~/interfaces/product';

export interface IBlockProductsColumnsItem {
    title: string;
    products: IProduct[];
}

interface Props {
    columns: IBlockProductsColumnsItem[];
    loading?: boolean;
    error?: string | null;
    retry?: () => void;
}

const SKELETON_COLUMNS = 3;
const SKELETON_ROWS = 3;

function BlockProductsColumns(props: Props) {
    const { columns = [], loading = false, error = null, retry } = props;

    if (error) {
        return (
            <div className="block block-products-columns block-products-columns--error">
                <div className="container">
                    <div className="block-products-columns__error">
                        <p className="block-products-columns__error-message">{error}</p>
                        {retry && (
                            <button type="button" className="btn btn-primary btn-sm" onClick={retry}>
                                Försök igen
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="block block-products-columns block-products-columns--loading">
                <div className="container">
                    <div className="block-products-columns__grid">
                        {Array.from({ length: SKELETON_COLUMNS }).map((_, colIdx) => (
                            <div key={colIdx} className="block-products-columns__column">
                                <div className="block-products-columns__skeleton-title" />
                                <div className="block-products-columns__list">
                                    {Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
                                        <div key={rowIdx} className="block-products-columns__skeleton-row">
                                            <div className="block-products-columns__skeleton-thumb" />
                                            <div className="block-products-columns__skeleton-text">
                                                <div className="block-products-columns__skeleton-line block-products-columns__skeleton-line--title" />
                                                <div className="block-products-columns__skeleton-line block-products-columns__skeleton-line--price" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="block block-products-columns">
            <div className="container">
                <div className="block-products-columns__grid">
                    {columns.map((column, columnIdx) => (
                        <div key={columnIdx} className="block-products-columns__column">
                            <div className="block-products-columns__title">{column.title}</div>
                            <div className="block-products-columns__list">
                                {column.products.map((product) => (
                                    <div key={product.id} className="block-products-columns__list-item">
                                        <ProductCard
                                            product={product}
                                            exclude={[
                                                'actions',
                                                'status-badge',
                                                'features',
                                                'buttons',
                                                'meta',
                                                'shipping',
                                                'vat',
                                            ]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockProductsColumns);
