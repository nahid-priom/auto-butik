// react
import React from 'react';
// third-party
import classNames from 'classnames';
// application
import AppLink from '~/components/shared/AppLink';
import { ILink } from '~/interfaces/link';

interface Props extends React.HTMLAttributes<HTMLElement> {
    items: ILink[];
    withPageTitle?: boolean;
    afterHeader?: boolean;
}

function Breadcrumb(props: Props) {
    const {
        className,
        items,
        withPageTitle = false,
        afterHeader = true,
    } = props;

    const rootClasses = classNames('breadcrumb', className);

    return (
        <nav className={rootClasses} aria-label="Brödsmulor">
            <ol className="breadcrumb__list">
                {afterHeader && <li className="breadcrumb__spaceship-safe-area" role="presentation" />}

                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;

                    const itemClasses = classNames('breadcrumb__item', {
                        'breadcrumb__item--first': isFirst,
                        'breadcrumb__item--last': isLast,
                        'breadcrumb__item--parent': !isLast,
                        'breadcrumb__item--current': isLast,
                    });

                    return (
                        <li key={index} className={itemClasses} aria-current={isLast ? 'page' : undefined}>
                            {isLast && <span className="breadcrumb__item-link breadcrumb__item-link--current">{item.title}</span>}
                            {!isLast && (
                                <AppLink href={item.url} className="breadcrumb__item-link" title={item.title}>
                                    {item.title}
                                </AppLink>
                            )}
                        </li>
                    );
                })}

                {withPageTitle && <li className="breadcrumb__title-safe-area" role="presentation" />}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
