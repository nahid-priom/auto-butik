// react
import React, { useState, useMemo } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import dataHeaderCategoryMenu from '~/data/headerCategoryMenu';
import { IMainMenuLink } from '~/interfaces/main-menu-link';

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
        if (carPartsMenu?.submenu?.columns?.[0]?.links) {
            const groups: CategoryGroup[] = carPartsMenu.submenu.columns[0].links
                .filter(link => link.links && link.links.length > 0)
                .map(link => ({
                    title: link.title,
                    url: link.url,
                    image: link.customFields?.image || '',
                    links: (link.links || []).slice(0, 5).map(subLink => ({
                        title: subLink.title,
                        url: subLink.url,
                    })),
                }));
            tabs.push({
                id: 'bildelar',
                name: intl.formatMessage({ id: 'MENU_CAR_PARTS' }),
                groups,
            });
        }

        // Torkarblad (Wiper Blades) - MENU_WIPER_BLADES
        // Get wiper blades data from MENU_CAR_PARTS -> GROUP_WIPERS
        const carPartsForWipers = dataHeaderCategoryMenu.find(item => item.title === 'MENU_CAR_PARTS');
        const wipersGroup = carPartsForWipers?.submenu?.columns?.[0]?.links?.find(
            link => link.title === 'GROUP_WIPERS'
        );
        if (wipersGroup && wipersGroup.links && wipersGroup.links.length > 0) {
            tabs.push({
                id: 'torkarblad',
                name: intl.formatMessage({ id: 'MENU_WIPER_BLADES' }),
                groups: [{
                    title: wipersGroup.title,
                    url: wipersGroup.url,
                    image: wipersGroup.customFields?.image || '',
                    links: (wipersGroup.links || []).slice(0, 5).map(subLink => ({
                        title: subLink.title,
                        url: subLink.url,
                    })),
                }],
            });
        }

        // Oljor och bilvård (Oils and Car Care) - MENU_OILS_CAR_CARE
        const oilsMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_OILS_CAR_CARE');
        if (oilsMenu?.submenu?.columns?.[0]?.links) {
            const groups: CategoryGroup[] = oilsMenu.submenu.columns[0].links
                .map(link => ({
                    title: link.title,
                    url: link.url,
                    image: link.customFields?.image || '',
                    links: (link.links || []).slice(0, 5).map(subLink => ({
                        title: subLink.title,
                        url: subLink.url,
                    })),
                }));
            tabs.push({
                id: 'oljor-och-bilvard',
                name: intl.formatMessage({ id: 'MENU_OILS_CAR_CARE' }),
                groups,
            });
        }

        // Biltillbehör (Car Accessories) - MENU_CAR_ACCESSORIES
        const accessoriesMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_CAR_ACCESSORIES');
        if (accessoriesMenu?.submenu?.columns?.[0]?.links) {
            const groups: CategoryGroup[] = accessoriesMenu.submenu.columns[0].links
                .map(link => ({
                    title: link.title,
                    url: link.url,
                    image: link.customFields?.image || '',
                    links: (link.links || []).slice(0, 5).map(subLink => ({
                        title: subLink.title,
                        url: subLink.url,
                    })),
                }));
            tabs.push({
                id: 'biltillbehor',
                name: intl.formatMessage({ id: 'MENU_CAR_ACCESSORIES' }),
                groups,
            });
        }

        // Verktyg (Tools) - MENU_TOOLS
        const toolsMenu = dataHeaderCategoryMenu.find(item => item.title === 'MENU_TOOLS');
        if (toolsMenu?.submenu?.columns?.[0]?.links) {
            const groups: CategoryGroup[] = toolsMenu.submenu.columns[0].links
                .map(link => ({
                    title: link.title,
                    url: link.url,
                    image: link.customFields?.image || '',
                    links: (link.links || []).slice(0, 5).map(subLink => ({
                        title: subLink.title,
                        url: subLink.url,
                    })),
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
                                            <AppImage src={group.image} alt={intl.formatMessage({ id: group.title })} />
                                        </div>
                                        <div className="block-category-tabs__card-name">
                                            <FormattedMessage id={group.title} />
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
