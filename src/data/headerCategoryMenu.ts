// application
import { IMainMenuLink } from "~/interfaces/main-menu-link";

const dataHeaderCategoryMenu: IMainMenuLink[] = [
    {
        title: "MENU_CAR_PARTS",
        url: "/catalog/products",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 4,
                    links: [
                        {
                            title: "GROUP_BRAKE_SYSTEM",
                            url: "/catalog/products",
                            links: [
                                { title: "LINK_BRAKE_DISCS", url: "/catalog/products" },
                                { title: "LINK_BRAKE_PADS", url: "/catalog/products" },
                                { title: "LINK_BRAKE_CALIPER", url: "/catalog/products" },
                                { title: "LINK_BRAKE_ACCESSORIES", url: "/catalog/products" },
                                { title: "LINK_HAND_BRAKES", url: "/catalog/products" },
                            ],
                        },
                        {
                            title: "GROUP_ENGINE_PARTS",
                            url: "/catalog/products",
                            links: [
                                { title: "LINK_AIR_FILTERS", url: "/catalog/products" },
                                { title: "LINK_OIL_FILTERS", url: "/catalog/products" },
                                { title: "LINK_FUEL_FILTERS", url: "/catalog/products" },
                                { title: "LINK_SPARK_PLUGS", url: "/catalog/products" },
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: "GROUP_SUSPENSION",
                            url: "/catalog/products",
                            links: [
                                { title: "LINK_SHOCK_ABSORBERS", url: "/catalog/products" },
                                { title: "LINK_SPRINGS", url: "/catalog/products" },
                                { title: "LINK_BALL_JOINTS", url: "/catalog/products" },
                                { title: "LINK_CONTROL_ARMS", url: "/catalog/products" },
                            ],
                        },
                        {
                            title: "GROUP_STEERING",
                            url: "/catalog/products",
                            links: [
                                { title: "LINK_STEERING_RACKS", url: "/catalog/products" },
                                { title: "LINK_TIE_RODS", url: "/catalog/products" },
                                { title: "LINK_POWER_STEERING_PUMPS", url: "/catalog/products" },
                            ],
                        },
                    ],
                },
                {
                    size: 4,
                    links: [
                        {
                            title: "GROUP_EXHAUST_SYSTEM",
                            url: "/catalog/products",
                            links: [
                                { title: "LINK_MUFFLERS", url: "/catalog/products" },
                                { title: "LINK_CATALYTIC_CONVERTERS", url: "/catalog/products" },
                                { title: "LINK_EXHAUST_PIPES", url: "/catalog/products" },
                            ],
                        },
                        {
                            title: "GROUP_ELECTRICAL_SYSTEM",
                            url: "/catalog/products",
                            links: [
                                { title: "LINK_BATTERIES", url: "/catalog/products" },
                                { title: "LINK_ALTERNATORS", url: "/catalog/products" },
                                { title: "LINK_STARTERS", url: "/catalog/products" },
                                { title: "LINK_SENSORS", url: "/catalog/products" },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_WIPER_BLADES",
        url: "/catalog/products?category=wiper-blades",
    },
    {
        title: "MENU_OILS_CAR_CARE",
        url: "/catalog/products?category=oils-care",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: "GROUP_ENGINE_OILS",
                            url: "/catalog/products",
                            // Removed nested links
                        },
                        {
                            title: "GROUP_CAR_CARE",
                            url: "/catalog/products",
                            // Removed nested links
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_CAR_ACCESSORIES",
        url: "/catalog/products?category=accessories",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 6,
                    links: [
                        {
                            title: "GROUP_INTERIOR",
                            url: "/catalog/products",
                            // Removed nested links
                        },
                        {
                            title: "GROUP_EXTERIOR",
                            url: "/catalog/products",
                            // Removed nested links
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_TOOLS",
        url: "/catalog/products?category=tools",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        {
                            title: "GROUP_HAND_TOOLS",
                            url: "/catalog/products",
                            // Removed nested links
                        },
                    ],
                },
            ],
        },
    },
];

export default dataHeaderCategoryMenu;
