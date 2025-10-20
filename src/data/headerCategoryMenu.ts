// application
import { IMainMenuLink } from '~/interfaces/main-menu-link';

const dataHeaderCategoryMenu: IMainMenuLink[] = [
    {
        title: 'Car Parts',
        url: '/catalog/products',
        submenu: {
            type: 'megamenu',
            size: 'nl',
            columns: [
                {
                    size: 4,
                    links: [
                        {
                            title: 'Brake System',
                            url: '/catalog/products',
                            links: [
                                { title: 'Brake Discs', url: '/catalog/products' },
                                { title: 'Brake Pads', url: '/catalog/products' },
                                { title: 'Brake Caliper', url: '/catalog/products' },
                                { title: 'Brake Accessories', url: '/catalog/products' },
                                { title: 'Hand Brakes', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'Engine Parts',
                            url: '/catalog/products',
                            links: [
                                { title: 'Air Filters', url: '/catalog/products' },
                                { title: 'Oil Filters', url: '/catalog/products' },
                                { title: 'Fuel Filters', url: '/catalog/products' },
                                { title: 'Spark Plugs', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: 'Suspension',
                            url: '/catalog/products',
                            links: [
                                { title: 'Shock Absorbers', url: '/catalog/products' },
                                { title: 'Springs', url: '/catalog/products' },
                                { title: 'Ball Joints', url: '/catalog/products' },
                                { title: 'Control Arms', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'Steering',
                            url: '/catalog/products',
                            links: [
                                { title: 'Steering Racks', url: '/catalog/products' },
                                { title: 'Tie Rods', url: '/catalog/products' },
                                { title: 'Power Steering Pumps', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: 'Exhaust System',
                            url: '/catalog/products',
                            links: [
                                { title: 'Mufflers', url: '/catalog/products' },
                                { title: 'Catalytic Converters', url: '/catalog/products' },
                                { title: 'Exhaust Pipes', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'Electrical System',
                            url: '/catalog/products',
                            links: [
                                { title: 'Batteries', url: '/catalog/products' },
                                { title: 'Alternators', url: '/catalog/products' },
                                { title: 'Starters', url: '/catalog/products' },
                                { title: 'Sensors', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Wiper Blades',
        url: '/catalog/products?category=wiper-blades',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'Front Wipers',
                            url: '/catalog/products',
                            links: [
                                { title: 'Standard Wipers', url: '/catalog/products' },
                                { title: 'Flat Blade Wipers', url: '/catalog/products' },
                                { title: 'Hybrid Wipers', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'Rear Wipers',
                            url: '/catalog/products',
                            links: [
                                { title: 'Rear Wiper Blades', url: '/catalog/products' },
                                { title: 'Rear Wiper Arms', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Oils and Car Care',
        url: '/catalog/products?category=oils-care',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'Engine Oils',
                            url: '/catalog/products',
                            links: [
                                { title: 'Synthetic Oil', url: '/catalog/products' },
                                { title: 'Semi-Synthetic Oil', url: '/catalog/products' },
                                { title: 'Mineral Oil', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'Car Care',
                            url: '/catalog/products',
                            links: [
                                { title: 'Car Wash', url: '/catalog/products' },
                                { title: 'Wax & Polish', url: '/catalog/products' },
                                { title: 'Interior Cleaners', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Car Accessories',
        url: '/catalog/products?category=accessories',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'Interior',
                            url: '/catalog/products',
                            links: [
                                { title: 'Floor Mats', url: '/catalog/products' },
                                { title: 'Seat Covers', url: '/catalog/products' },
                                { title: 'Steering Wheel Covers', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'Exterior',
                            url: '/catalog/products',
                            links: [
                                { title: 'Car Covers', url: '/catalog/products' },
                                { title: 'Mud Flaps', url: '/catalog/products' },
                                { title: 'Roof Racks', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Tool',
        url: '/catalog/products?category=tools',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 12,
                    links: [
                        {
                            title: 'Hand Tools',
                            url: '/catalog/products',
                            links: [
                                { title: 'Wrenches', url: '/catalog/products' },
                                { title: 'Screwdrivers', url: '/catalog/products' },
                                { title: 'Pliers', url: '/catalog/products' },
                                { title: 'Sockets', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'Bicycle Parts',
        url: '/catalog/products?category=bicycle',
    },
    {
        title: 'Boat Accessories',
        url: '/catalog/products?category=boat',
    },
];

export default dataHeaderCategoryMenu;

