// react
import React, { useState, useMemo } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink, { resolveAppLinkHref } from '~/components/shared/AppLink';
import dataHeaderCategoryMenu from '~/data/headerCategoryMenu';
import { INestedLink } from '~/interfaces/link';

interface CategoryGroup {
    title: string;
    url: string;
    image: string;
    links: Array<{ title: string; url: string }>;
}

interface TabData {
    id: string;
    name: string;
    groups: CategoryGroup[];
}

function BlockCategoryTabs() {
    const intl = useIntl();
    const [activeTab, setActiveTab] = useState<string>('bildelar');

    // Extract category data from megamenu
    const tabsData = useMemo<TabData[]>(() => {
        const tabs: TabData[] = [];

        // Bildelar (Car Parts) - MENU_CAR_PARTS
        const carPartsMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_CAR_PARTS');
        const carPartsMegamenu = carPartsMenu?.submenu?.type === 'megamenu' ? carPartsMenu.submenu : null;
        if (carPartsMegamenu?.columns?.[0]?.links) {
            const groups: CategoryGroup[] = carPartsMegamenu.columns[0].links
                .filter((link: INestedLink) => link.links && link.links.length > 0)
                .map((link: INestedLink) => ({
                    title: typeof link.title === 'string' ? link.title : '',
                    url: link.url ? resolveAppLinkHref(link.url) : '',
                    image: link.customFields?.image || '',
                    links: (link.links || []).slice(0, 5).map((subLink: INestedLink) => ({
                        title: typeof subLink.title === 'string' ? subLink.title : '',
                        url: subLink.url ? resolveAppLinkHref(subLink.url) : '',
                    })),
                }));
            tabs.push({
                id: 'bildelar',
                name: intl.formatMessage({ id: 'MENU_CAR_PARTS' }),
                groups,
            });
        }

        // Torkarblad (Wiper Blades) - MENU_WIPER_BLADES (flat subcategories only, no parent row)
        const wipersMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_WIPER_BLADES');
        const wipersMegamenu = wipersMenu?.submenu?.type === 'megamenu' ? wipersMenu.submenu : null;
        const wipersLinks = wipersMegamenu?.columns?.[0]?.links ?? [];
        if (wipersLinks.length > 0) {
            const wipersGroups: CategoryGroup[] = wipersLinks.map((link: INestedLink) => ({
                title: typeof link.title === 'string' ? link.title : '',
                url: link.url ? resolveAppLinkHref(link.url) : '',
                image: link.customFields?.image || '',
                links: [],
            }));
            tabs.push({
                id: 'torkarblad',
                name: intl.formatMessage({ id: 'MENU_WIPER_BLADES' }),
                groups: wipersGroups,
            });
        }

        // Oljor och bilvård (Oils and Car Care) - MENU_OILS_CAR_CARE (flat subcategories only)
        const oilsMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_OILS_CAR_CARE');
        const oilsMegamenu = oilsMenu?.submenu?.type === 'megamenu' ? oilsMenu.submenu : null;
        const oilsLinks = oilsMegamenu?.columns?.[0]?.links ?? [];
        if (oilsLinks.length > 0) {
            const groups: CategoryGroup[] = oilsLinks.map((link: INestedLink) => ({
                title: typeof link.title === 'string' ? link.title : '',
                url: link.url ? resolveAppLinkHref(link.url) : '',
                image: link.customFields?.image || '',
                links: [],
            }));
            tabs.push({
                id: 'oljor-och-bilvard',
                name: intl.formatMessage({ id: 'MENU_OILS_CAR_CARE' }),
                groups,
            });
        }

        // Biltillbehör (Car Accessories) - MENU_CAR_ACCESSORIES (flat subcategories only)
        const accessoriesMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_CAR_ACCESSORIES');
        const accessoriesMegamenu = accessoriesMenu?.submenu?.type === 'megamenu' ? accessoriesMenu.submenu : null;
        const accessoriesLinks = accessoriesMegamenu?.columns?.[0]?.links ?? [];
        if (accessoriesLinks.length > 0) {
            const groups: CategoryGroup[] = accessoriesLinks.map((link: INestedLink) => ({
                title: typeof link.title === 'string' ? link.title : '',
                url: link.url ? resolveAppLinkHref(link.url) : '',
                image: link.customFields?.image || '',
                links: [],
            }));
            tabs.push({
                id: 'biltillbehor',
                name: intl.formatMessage({ id: 'MENU_CAR_ACCESSORIES' }),
                groups,
            });
        }

        // Verktyg (Tools) - MENU_TOOLS (flat subcategories only)
        const toolsMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_TOOLS');
        const toolsMegamenu = toolsMenu?.submenu?.type === 'megamenu' ? toolsMenu.submenu : null;
        const toolsLinks = toolsMegamenu?.columns?.[0]?.links ?? [];
        if (toolsLinks.length > 0) {
            const groups: CategoryGroup[] = toolsLinks.map((link: INestedLink) => ({
                title: typeof link.title === 'string' ? link.title : '',
                url: link.url ? resolveAppLinkHref(link.url) : '',
                image: link.customFields?.image || '',
                links: [],
            }));
            tabs.push({
                id: 'verktyg',
                name: intl.formatMessage({ id: 'MENU_TOOLS' }),
                groups,
            });
        }

        return tabs;
    }, [intl]);

    const activeTabData = tabsData.find(tab => tab.id === activeTab) || tabsData[0];

    return (
        <div className="block block-category-tabs">
            <div className="container">
                <div className="block-category-tabs__header">
                    <h2 className="block-category-tabs__title">
                        <FormattedMessage id="HEADER_POPULAR_CATEGORIES" />
                    </h2>
                </div>
                
                <div className="block-category-tabs__tabs">
                    {tabsData.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={classNames('block-category-tabs__tab', {
                                'block-category-tabs__tab--active': activeTab === tab.id,
                            })}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="block-category-tabs__content">
                    {tabsData.map((tab) => (
                        <div
                            key={tab.id}
                            className={classNames('block-category-tabs__pane', {
                                'block-category-tabs__pane--active': activeTab === tab.id,
                            })}
                        >
                            <div className="block-category-tabs__grid">
                                {tab.groups.map((group, index) => (
                                    <AppLink key={index} href={group.url} className="block-category-tabs__card">
                                        <div className="block-category-tabs__card-image">
                                            <AppImage src={group.image} alt={typeof group.title === 'string' ? group.title : ''} />
                                        </div>
                                        <div className="block-category-tabs__card-name">
                                            {intl.formatMessage({ id: group.title, defaultMessage: group.title })}
                                        </div>
                                    </AppLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockCategoryTabs);
