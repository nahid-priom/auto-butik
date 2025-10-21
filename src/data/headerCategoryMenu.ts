// application
import { IMainMenuLink } from '~/interfaces/main-menu-link';

const dataHeaderCategoryMenu: IMainMenuLink[] = [
    {
        title: 'MENU_CAR_PARTS',
        url: '/catalog/products',
        submenu: {
            type: 'megamenu',
            size: 'nl',
            columns: [
                {
                    size: 4,
                    links: [
                        {
                            title: 'GROUP_BRAKE_SYSTEM', url: '/catalog/products',
                            links: [
                                { title: 'LINK_BRAKE_DISCS', url: '/catalog/products' },
                                { title: 'LINK_BRAKE_PADS', url: '/catalog/products' },
                                { title: 'LINK_BRAKE_CALIPER', url: '/catalog/products' },
                                { title: 'LINK_BRAKE_ACCESSORIES', url: '/catalog/products' },
                                { title: 'LINK_HAND_BRAKES', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'GROUP_ENGINE_PARTS', url: '/catalog/products',
                            links: [
                                { title: 'LINK_AIR_FILTERS', url: '/catalog/products' },
                                { title: 'LINK_OIL_FILTERS', url: '/catalog/products' },
                                { title: 'LINK_FUEL_FILTERS', url: '/catalog/products' },
                                { title: 'LINK_SPARK_PLUGS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: 'GROUP_SUSPENSION', url: '/catalog/products',
                            links: [
                                { title: 'LINK_SHOCK_ABSORBERS', url: '/catalog/products' },
                                { title: 'LINK_SPRINGS', url: '/catalog/products' },
                                { title: 'LINK_BALL_JOINTS', url: '/catalog/products' },
                                { title: 'LINK_CONTROL_ARMS', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'GROUP_STEERING', url: '/catalog/products',
                            links: [
                                { title: 'LINK_STEERING_RACKS', url: '/catalog/products' },
                                { title: 'LINK_TIE_RODS', url: '/catalog/products' },
                                { title: 'LINK_POWER_STEERING_PUMPS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: 'GROUP_EXHAUST_SYSTEM', url: '/catalog/products',
                            links: [
                                { title: 'LINK_MUFFLERS', url: '/catalog/products' },
                                { title: 'LINK_CATALYTIC_CONVERTERS', url: '/catalog/products' },
                                { title: 'LINK_EXHAUST_PIPES', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'GROUP_ELECTRICAL_SYSTEM', url: '/catalog/products',
                            links: [
                                { title: 'LINK_BATTERIES', url: '/catalog/products' },
                                { title: 'LINK_ALTERNATORS', url: '/catalog/products' },
                                { title: 'LINK_STARTERS', url: '/catalog/products' },
                                { title: 'LINK_SENSORS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'MENU_WIPER_BLADES',
        url: '/catalog/products?category=wiper-blades',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'GROUP_FRONT_WIPERS', url: '/catalog/products',
                            links: [
                                { title: 'LINK_STANDARD_WIPERS', url: '/catalog/products' },
                                { title: 'LINK_FLAT_BLADE_WIPERS', url: '/catalog/products' },
                                { title: 'LINK_HYBRID_WIPERS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'GROUP_REAR_WIPERS', url: '/catalog/products',
                            links: [
                                { title: 'LINK_REAR_WIPER_BLADES', url: '/catalog/products' },
                                { title: 'LINK_REAR_WIPER_ARMS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'MENU_OILS_CAR_CARE',
        url: '/catalog/products?category=oils-care',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'GROUP_ENGINE_OILS', url: '/catalog/products',
                            links: [
                                { title: 'LINK_SYNTHETIC_OIL', url: '/catalog/products' },
                                { title: 'LINK_SEMI_SYNTHETIC_OIL', url: '/catalog/products' },
                                { title: 'LINK_MINERAL_OIL', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'GROUP_CAR_CARE', url: '/catalog/products',
                            links: [
                                { title: 'LINK_CAR_WASH', url: '/catalog/products' },
                                { title: 'LINK_WAX_POLISH', url: '/catalog/products' },
                                { title: 'LINK_INTERIOR_CLEANERS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'MENU_CAR_ACCESSORIES',
        url: '/catalog/products?category=accessories',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: 'GROUP_INTERIOR', url: '/catalog/products',
                            links: [
                                { title: 'LINK_FLOOR_MATS', url: '/catalog/products' },
                                { title: 'LINK_SEAT_COVERS', url: '/catalog/products' },
                                { title: 'LINK_STEERING_WHEEL_COVERS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: 6,
                    links: [
                        {
                            title: 'GROUP_EXTERIOR', url: '/catalog/products',
                            links: [
                                { title: 'LINK_CAR_COVERS', url: '/catalog/products' },
                                { title: 'LINK_MUD_FLAPS', url: '/catalog/products' },
                                { title: 'LINK_ROOF_RACKS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'MENU_TOOLS',
        url: '/catalog/products?category=tools',
        submenu: {
            type: 'megamenu',
            size: 'sm',
            columns: [
                {
                    size: 12,
                    links: [
                        {
                            title: 'GROUP_HAND_TOOLS', url: '/catalog/products',
                            links: [
                                { title: 'LINK_WRENCHES', url: '/catalog/products' },
                                { title: 'LINK_SCREWDRIVERS', url: '/catalog/products' },
                                { title: 'LINK_PLIERS', url: '/catalog/products' },
                                { title: 'LINK_SOCKETS', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
];

export default dataHeaderCategoryMenu;

