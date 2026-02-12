// application
import { IMainMenuLink } from '~/interfaces/main-menu-link';

const dataHeaderMainMenu: IMainMenuLink[] = [
    {
        title: 'Hem',
        url: '/',
    },
    {
        title: 'Reservdelar',
        url: '/catalog/products',
        submenu: {
            type: 'megamenu',
            size: 'nl',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'Bromssystem',
                            url: '/catalog/products?collectionId=116',
                            links: [
                                { title: 'Bromsdelar / Tillbehör', url: '/catalog/products?collectionId=144' }, // 10,720 products
                                { title: 'Vakumpump', url: '/catalog/products?collectionId=159' }, // 1,792 products
                                { title: 'Huvudbromscylinder', url: '/catalog/products?collectionId=138' }, // 448 products
                                { title: 'Bromskraftsförstärkare', url: '/catalog/products?collectionId=117' }, // 248 products
                                { title: 'Bromsok/ -hållare', url: '/catalog/products?collectionId=122' }, // 92 products
                                { title: 'Bromskraftsregulator', url: '/catalog/products?collectionId=118' }, // 84 products
                            ],
                        },
                        {
                            title: 'Motor & Transmission',
                            url: '/catalog/products?collectionId=1032',
                            links: [
                                { title: 'Motorelektriskt', url: '/catalog/products?collectionId=1032' }, // 10,418 products
                                { title: 'Packning, insugsgrenrör', url: '/catalog/products?collectionId=1046' }, // 3,635 products
                                { title: 'Kolv', url: '/catalog/products?collectionId=1328' }, // 2,968 products
                                { title: 'Avgasgrenrörspackning', url: '/catalog/products?collectionId=1038' }, // 2,786 products
                                { title: 'Kuggrem', url: '/catalog/products?collectionId=1257' }, // 2,735 products
                                { title: 'Kopplingshydraulik', url: '/catalog/products?collectionId=989' }, // 1,195 products
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'El-system & Belysning',
                            url: '/catalog/products?collectionId=168',
                            links: [
                                { title: 'Generator / Delar', url: '/catalog/products?collectionId=196' }, // 1,793 products
                                { title: 'Startmotor', url: '/catalog/products?collectionId=265' }, // 100 products
                                { title: 'Strålkastare / Delar', url: '/catalog/products?collectionId=269' }, // 10 products
                                { title: 'Batteri', url: '/catalog/products?collectionId=169' }, // 2 products
                            ],
                        },
                        {
                            title: 'Karosseri & Interiör',
                            url: '/catalog/products?collectionId=515',
                            links: [
                                { title: 'Grill/delar', url: '/catalog/products?collectionId=515' }, // 3,027 products
                                { title: 'Gasfjädrar', url: '/catalog/products?collectionId=403' }, // 1,414 products
                                { title: 'Motorkåpa', url: '/catalog/products?collectionId=490' }, // 974 products
                                { title: 'Upphängning', url: '/catalog/products?collectionId=1573' }, // 820 products
                                { title: 'Hållare/fästen/sargar', url: '/catalog/products?collectionId=516' }, // 617 products
                                { title: 'Oljepackningar', url: '/catalog/products?collectionId=1056' }, // 643 products
                            ],
                        },
                    ],
                },
            ],
        },
        customFields: {
            ignoreIn: ['spaceship'],
        },
    },
    {
        title: 'Fler kategorier',
        url: '/catalog/products',
        submenu: {
            type: 'megamenu',
            size: 'nl',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'Bränslesystem',
                            url: '/catalog/products?collectionId=57',
                            links: [
                                { title: 'Insprutningspump', url: '/catalog/products?collectionId=38' }, // 541 products
                                { title: 'Bränsleberedning', url: '/catalog/products?collectionId=57' }, // 191 products
                                { title: 'Bränslepump', url: '/catalog/products?collectionId=851' }, // 34 products
                                { title: 'Bränslefilter', url: '/catalog/products?collectionId=281' }, // 2 products
                                { title: 'Bränsletrycksregulator', url: '/catalog/products?collectionId=857' }, // 2 products
                            ],
                        },
                        {
                            title: 'Kylsystem & Värme',
                            url: '/catalog/products?collectionId=1521',
                            links: [
                                { title: 'Värme / Ventilation', url: '/catalog/products?collectionId=1521' }, // 76 products
                                { title: 'Fläktmotor / -delar', url: '/catalog/products?collectionId=1523' }, // 70 products
                                { title: 'Kylfläkt', url: '/catalog/products?collectionId=804' }, // 58 products
                                { title: 'Frostskydd', url: '/catalog/products?collectionId=796' }, // 40 products
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'Motor & Vevaxel',
                            url: '/catalog/products?collectionId=1344',
                            links: [
                                { title: 'Vevaxellager', url: '/catalog/products?collectionId=1344' }, // 452 products
                                { title: 'Kedjespännare', url: '/catalog/products?collectionId=1210' }, // 242 products
                            ],
                        },
                        {
                            title: 'Koppling & Transmission',
                            url: '/catalog/products?collectionId=754',
                            links: [
                                { title: 'Kraftöverföring', url: '/catalog/products?collectionId=754' }, // 2 products
                                { title: 'Fördelningsväxel', url: '/catalog/products?collectionId=763' }, // 2 products
                                { title: 'Urtrampningslager', url: '/catalog/products?collectionId=751' }, // 1 product
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Butik',
        url: '/catalog/products',
        submenu: {
            type: 'menu',
            links: [
                { title: 'Alla produkter', url: '/catalog/products' },
                { title: 'Bromssystem', url: '/catalog/products?collectionId=116' },
                { title: 'Motor & Transmission', url: '/catalog/products?collectionId=1032' },
                { title: 'El-system', url: '/catalog/products?collectionId=168' },
                { title: 'Karosseri', url: '/catalog/products?collectionId=515' },
                { title: 'Bränslesystem', url: '/catalog/products?collectionId=57' },
                { title: 'Kylsystem', url: '/catalog/products?collectionId=1521' },
            ],
        },
    },
    {
        title: 'Konto',
        url: '/account/dashboard',
        submenu: {
            type: 'menu',
            links: [
                { title: 'Logga in / Registrera', url: '/account/login' },
                { title: 'Översikt', url: '/account/dashboard' },
                { title: 'Garage', url: '/account/garage' },
                { title: 'Redigera profil', url: '/account/profile' },
                { title: 'Orderhistorik', url: '/account/orders' },
                { title: 'Adressbok', url: '/account/addresses' },
                { title: 'Ändra lösenord', url: '/account/password' },
            ],
        },
    },
    {
        title: 'Sidor',
        url: '/about-us',
        submenu: {
            type: 'menu',
            links: [
                { title: 'Om oss', url: '/about-us' },
                { title: 'Kontakta oss', url: '/contact' },
                { title: 'Villkor', url: '/terms' },
                { title: 'Vanliga frågor', url: '/faq' },
            ],
        },
    },
];

export default dataHeaderMainMenu;