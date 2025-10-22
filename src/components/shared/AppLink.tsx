// react
import React, { PropsWithChildren } from 'react';
// third-party
import Link, { LinkProps } from 'next/link';
import { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring';
import {
    format as formatUrl,
    parse as parseUrl,
    Url,
    UrlObject,
} from 'url';
// application
import { baseUrl } from '~/services/utils';

export type IAppLinkHref = string | LinkProps;

type INormalizedUrlObject = Omit<UrlObject, 'query'> & {
    query: ParsedUrlQueryInput;
};

type INormalizedLinkProps = Omit<LinkProps, 'href' | 'as'> & {
    href: INormalizedUrlObject;
    as: INormalizedUrlObject;
};

export function normalizeHref(href: string | UrlObject): INormalizedUrlObject {
    const result = {
        ...(parseUrl(typeof href === 'string' ? href : formatUrl(href), true)),
    } as (Partial<Url> & { query: ParsedUrlQuery });

    delete result.host;
    delete result.href;
    delete result.path;
    delete result.search;

    result.query = result.query || {};

    return result;
}

export function normalizeLinkHref(data: IAppLinkHref): INormalizedLinkProps {
    const result = typeof data === 'string' ? { href: data } : data;

    return {
        ...result,
        href: normalizeHref(result.href),
        as: normalizeHref(result.as || result.href),
    };
}

export function resolveAppLinkHref(data: IAppLinkHref): string {
    if (typeof data === 'string') {
        return data;
    }

    const normalized = normalizeLinkHref(data);
    return formatUrl(normalized.as);
}

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

interface Props extends PropsWithChildren<AnchorProps> {
    href?: IAppLinkHref;
    anchor?: boolean;
}

function AppLink(props: Props) {
    const {
        href: hrefProp,
        children,
        anchor = false,
        ...anchorProps
    } = props;
    const href = hrefProp || '/';
    const data = normalizeLinkHref(href || '');
    const isExternal = !!data.href.hostname;
    const hasPath = !!data.href.pathname;
    const onlyHash = formatUrl(data.href).startsWith('#');

    if (isExternal || anchor || onlyHash) {
        let anchorHref;

        if (!isExternal && hasPath) {
            anchorHref = baseUrl(formatUrl(data.href));
        } else {
            anchorHref = formatUrl(data.href);
        }

        return <Link href={anchorHref} {...anchorProps}>{children}</Link>;
    }

    return (
        <Link {...data} legacyBehavior>
            <a {...anchorProps}>{children}</a>
        </Link>
    );
}

export default AppLink;
