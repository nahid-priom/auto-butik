// application
import { IMobileMenuLink } from '~/interfaces/mobile-menu-link';

const dataMobileMenuLinks: IMobileMenuLink[] = [
    {
        title: 'Home',
        url: '/',
    },
    {
        title: 'Shop',
        url: '/catalog',
        submenu: [
            { title: 'Catalog', url: '/catalog' },
            { title: 'Cart', url: '/cart' },
            { title: 'Checkout', url: '/cart/checkout' },
            { title: 'Wishlist', url: '/wishlist' },
            { title: 'Compare', url: '/compare' },
            { title: 'Track Order', url: '/track-order' },
        ],
    },
    {
        title: 'Blog',
        url: '/blog',
    },
    {
        title: 'Account',
        url: '/account/dashboard',
        submenu: [
            { title: 'Login & Register', url: '/account/login' },
            { title: 'Dashboard', url: '/account/dashboard' },
            { title: 'Garage', url: '/account/garage' },
            { title: 'Edit Profile', url: '/account/profile' },
            { title: 'Order History', url: '/account/orders' },
            {
                title: 'Order Details',
                url: {
                    href: '/account/orders/[id]?id=1',
                    as: '/account/orders/1',
                },
            },
            { title: 'Address Book', url: '/account/addresses' },
            {
                title: 'Edit Address',
                url: {
                    href: '/account/addresses/[id]?id=new',
                    as: '/account/addresses/new',
                },
            },
            { title: 'Change Password', url: '/account/password' },
        ],
    },
    {
        title: 'Pages',
        url: '/about-us',
        submenu: [
            { title: 'About Us', url: '/about-us' },
            { title: 'Contact Us', url: '/contact-us' },
            { title: '404', url: '/404' },
            { title: 'Terms And Conditions', url: '/terms' },
            { title: 'FAQ', url: '/faq' },
        ],
    },
];

export default dataMobileMenuLinks;
