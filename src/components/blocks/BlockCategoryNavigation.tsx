// react
import React from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';

interface CategoryItem {
    name: string;
    image: string;
    url: string;
}

const categories: CategoryItem[] = [
    {
        name: 'Bildelar',
        image: '/images/homepage-categories/bildelar.webp',
        url: '/catalog/products?collectionSlug=bromsanlaggning-skivbroms-bromsskiva',
    },
    {
        name: 'Torkarblad',
        image: '/images/homepage-categories/torkarblad.webp',
        url: '/catalog/products?collectionSlug=vindruterengoring-torkarblad-gummi',
    },
    {
        name: 'Oljor och bilvård',
        image: '/images/homepage-categories/oljor-och-bilvård.webp',
        url: '/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-motorolja',
    },
    {
        name: 'Biltillbehör',
        image: '/images/homepage-categories/biltillbehör.webp',
        url: '/catalog/products?collectionSlug=hybrid-eldrift-laddare',
    },
    {
        name: 'Verktyg',
        image: '/images/homepage-categories/verktyg.webp',
        url: '/catalog/products?collectionSlug=verktyg-handverktyg',
    },
];

function BlockCategoryNavigation() {
    return (
        <div className="block block-category-navigation">
            <div className="container">
                <div className="block-category-navigation__list">
                    {categories.map((category) => (
                        <AppLink
                            key={category.name}
                            href={category.url}
                            className="block-category-navigation__item"
                        >
                            <div className="block-category-navigation__image">
                                <AppImage src={category.image} alt={category.name} />
                            </div>
                            <div className="block-category-navigation__name">
                                {category.name}
                            </div>
                        </AppLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockCategoryNavigation);
