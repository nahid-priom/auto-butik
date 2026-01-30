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
                    size: 12,
                    links: [
                        // Bromssystem (Brake System)
                        {
                            title: "GROUP_BRAKE_SYSTEM",
                            url: "/catalog/products?collectionId=116",
                            customFields: {
                                image: "/images/megamenu/subcategories/252_brake_system.jpg"
                            },
                            links: [
                                { title: "LINK_BRAKE_DISCS", url: "/catalog/products?collectionId=144", customFields: { image: "/images/megamenu/subcategories/269_brake_discs.jpg" } }, // Bromsdelar / Tillbehör - 10,720 products
                                { title: "LINK_BRAKE_PADS", url: "/catalog/products?collectionId=144", customFields: { image: "/images/megamenu/subcategories/268_brake_pads.jpg" } }, // Bromsdelar / Tillbehör - 10,720 products
                                { title: "LINK_BRAKE_CALIPER", url: "/catalog/products?collectionId=122", customFields: { image: "/images/megamenu/subcategories/257_brake_calipers.jpg" } }, // Bromsok/ -hållare - 92 products
                                { title: "LINK_BRAKE_ACCESSORIES", url: "/catalog/products?collectionId=144", customFields: { image: "/images/megamenu/subcategories/270_brake_parts_accessories.jpg" } }, // Bromsdelar / Tillbehör - 10,720 products
                                { title: "LINK_WEAR_INDICATORS", url: "/catalog/products?collectionId=144", customFields: { image: "/images/megamenu/subcategories/281_wear_indicator_brake_pads.jpg" } }, // Bromsdelar / Tillbehör
                                { title: "LINK_BRAKE_CALIPER_REPAIR", url: "/catalog/products?collectionId=122", customFields: { image: "/images/megamenu/subcategories/256_brake_caliper_parts.jpg" } }, // Bromsok/ -hållare - 92 products
                                { title: "LINK_HAND_BRAKES", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/260_handbrake.jpg" } }, // Bromsanläggning - 1,314 products
                                { title: "LINK_BRAKE_DRUMS", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/274_brake_drums.jpg" } }, // Bromsanläggning
                                { title: "LINK_BRAKE_SHOES", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/273_brake_lining_shoe.jpg" } }, // Bromsanläggning
                                { title: "LINK_WHEEL_CYLINDERS", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/279_wheel_cylinders.jpg" } }, // Bromsanläggning
                                { title: "LINK_DRUM_BRAKE_PARTS", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/276_drum_brake_parts.jpg" } }, // Bromsanläggning
                                { title: "LINK_ABS_PARTS", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/264_abs_parts.jpg" } }, // Bromsanläggning
                                { title: "LINK_BRAKE_MASTER_CYLINDER", url: "/catalog/products?collectionId=138", customFields: { image: "/images/megamenu/subcategories/254_brake_master_cylinder.jpg" } }, // Huvudbromscylinder - 448 products
                                { title: "LINK_BRAKE_HOSES", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/261_brake_hoses.jpg" } }, // Bromsanläggning
                                { title: "LINK_PARKING_BRAKE_CABLES", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/282_control_levers_cables.jpg" } }, // Bromsanläggning
                                { title: "LINK_BRAKE_LINE_FITTINGS", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/1102_brake_line_fittings.jpg" } }, // Bromsanläggning
                                { title: "LINK_BRAKE_BOOSTER", url: "/catalog/products?collectionId=117", customFields: { image: "/images/megamenu/subcategories/253_brake_booster.jpg" } }, // Bromskraftsförstärkare - 248 products
                                { title: "LINK_BRAKE_POWER_REGULATOR", url: "/catalog/products?collectionId=118", customFields: { image: "/images/megamenu/subcategories/263_brake_power_regulator.jpg" } }, // Bromskraftsregulator - 84 products
                            ],
                        },
                        // Filter
                        {
                            title: "GROUP_FILTERS",
                            url: "/catalog/products?collectionId=281",
                            customFields: {
                                image: "/images/megamenu/subcategories/241_filters.jpg"
                            },
                            links: [
                                { title: "LINK_OIL_FILTERS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/242_oil_filters.jpg" } }, // Bränslefilter - 2 products (limited)
                                { title: "LINK_AIR_FILTERS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/243_air_filters.jpg" } },
                                { title: "LINK_FUEL_FILTERS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/244_fuel_filters.jpg" } }, // Bränslefilter - 2 products
                                { title: "LINK_HYDRAULIC_FILTERS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/245_hydraulic_filters.jpg" } },
                                { title: "LINK_CABIN_FILTERS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/246_pollen_filters.jpg" } },
                                { title: "LINK_COOLANT_FILTERS", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/subcategories/247_coolant_filters.jpg" } }, // Frostskydd - 40 products
                                { title: "LINK_FILTER_SETS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/248_filter_sets.jpg" } },
                                { title: "LINK_POWER_STEERING_FILTERS", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/685_filter_power_steering.jpg" } },
                            ],
                        },
                        // Dämpare och fjädrar (Suspension)
                        {
                            title: "GROUP_SUSPENSION",
                            url: "/catalog/products?collectionId=322",
                            customFields: {
                                image: "/images/megamenu/subcategories/663_suspension.jpg"
                            },
                            links: [
                                { title: "LINK_SHOCK_ABSORBERS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/665_shock_absorbers.jpg" } }, // Länkarmar - 11,487 products
                                { title: "LINK_COIL_SPRINGS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/664_coil_springs.jpg" } },
                                { title: "LINK_BALL_JOINTS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/723_ball_joint.jpg" } },
                                { title: "LINK_CONTROL_ARMS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/713_steering_links_control_arm_trailing_link_diagonal_arm.jpg" } }, // Länkarmar - 11,487 products
                                { title: "LINK_STABILIZER", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/717_stabilizer.jpg" } },
                                { title: "LINK_WHEEL_BEARINGS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/wheel_bearing.jpg" } },
                                { title: "LINK_WHEEL_HUBS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/702_wheel_hub.jpg" } },
                                { title: "LINK_STRUT_MOUNTS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/668_suspension_strut_bearing.jpg" } },
                                { title: "LINK_STRUT_BOOTS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/Strut_boots.jpg" } },
                                { title: "LINK_WHEEL_NUTS_BOLTS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/738_wheel_nuts_bolts___studs.jpg" } },
                                { title: "LINK_AXLE_BEAM", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/726_axle_beam.jpg" } },
                                { title: "LINK_AIR_SUSPENSION", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/674_pneumatic_suspension.jpg" } },
                            ],
                        },
                        // Styrning (Steering)
                        {
                            title: "GROUP_STEERING",
                            url: "/catalog/products?collectionId=322",
                            customFields: {
                                image: "/images/megamenu/subcategories/676_steering.jpg"
                            },
                            links: [
                                { title: "LINK_TIE_RODS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/677_tie_rod.jpg" } },
                                { title: "LINK_TIE_ROD_ENDS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/690_tie_rod_assembly.jpg" } },
                                { title: "LINK_POWER_STEERING_PUMPS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/678_steering_pump.jpg" } },
                                { title: "LINK_STEERING_RACKS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/986_steering_gear.jpg" } },
                                { title: "LINK_STEERING_COLUMN", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/681_steering_column.jpg" } },
                                { title: "LINK_STEERING_DAMPER", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/679_steering_damper.jpg" } },
                                { title: "LINK_STEERING_BOOTS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/680_bellowseal.jpg" } },
                                { title: "LINK_STEERING_HOSES", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/686_steering_hose_pipe.jpg" } },
                                { title: "LINK_STEERING_LINKAGE", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/subcategories/688_steering_linkage.jpg" } },
                                { title: "LINK_STEERING_RESERVOIR", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/subcategories/693_hydraulic_oil_expansion_tank.jpg" } },
                            ],
                        },
                        // Vindrutetorkar system (Windscreen Wipers) - No products found
                        {
                            title: "GROUP_WIPERS",
                            url: "/catalog/products?collectionId=1616",
                            customFields: {
                                image: "/images/megamenu/subcategories/606_windscreen_cleaning_system.jpg"
                            },
                            links: [
                                { title: "LINK_WIPER_BLADES", url: "/catalog/products?collectionId=1616", customFields: { image: "/images/megamenu/subcategories/607_windscreen_wipers.jpg" } },
                                { title: "LINK_WIPER_MOTORS", url: "/catalog/products?collectionId=1617", customFields: { image: "/images/megamenu/subcategories/608_motor_windscreen_wipers.jpg" } },
                                { title: "LINK_WASHER_PUMPS", url: "/catalog/products?collectionId=1619", customFields: { image: "/images/megamenu/subcategories/609_water_pump_windscreen_washing.jpg" } },
                                { title: "LINK_WIPER_LINKAGE", url: "/catalog/products?collectionId=1614", customFields: { image: "/images/megamenu/subcategories/611_wiper_linkage_drive.jpg" } },
                                { title: "LINK_WASHER_RESERVOIR", url: "/catalog/products?collectionId=281", customFields: { image: "/images/megamenu/subcategories/612_water_tank_pipe_windscreen.jpg" } },
                                { title: "LINK_WASHER_JETS", url: "/catalog/products?collectionId=1619", customFields: { image: "/images/megamenu/subcategories/613_washer_fluid_jet.jpg" } },
                                { title: "LINK_HEADLIGHT_WASHER", url: "/catalog/products?collectionId=1619", customFields: { image: "/images/megamenu/subcategories/955_headlight_washer_system.jpg" } },
                            ],
                        },
                        // Motordelar (Engine Parts)
                        {
                            title: "GROUP_ENGINE_PARTS",
                            url: "/catalog/products?collectionId=1032",
                            customFields: {
                                image: "/images/megamenu/subcategories/4_engine.jpg"
                            },
                            links: [
                                { title: "LINK_TIMING_BELT_KITS", url: "/catalog/products?collectionId=1257", customFields: { image: "/images/megamenu/subcategories/185_timing_belt_set.jpg" } }, // Kuggrem - 2,735 products
                                { title: "LINK_TIMING_CHAIN_KITS", url: "/catalog/products?collectionId=1210", customFields: { image: "/images/megamenu/subcategories/25_timing_chain_set.jpg" } }, // Kedjespännare - 242 products
                                { title: "LINK_TURBOCHARGERS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/subcategories/227_turbocharger.jpg" } }, // Motorelektriskt - 10,418 products
                                { title: "LINK_ENGINE_MOUNTS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/subcategories/135_engine_mounting_bracket.jpg" } },
                                { title: "LINK_INTAKE_MANIFOLD", url: "/catalog/products?collectionId=1046", customFields: { image: "/images/megamenu/subcategories/86_intake_manifold.jpg" } }, // Packning, insugsgrenrör - 3,635 products
                                { title: "LINK_DRIVE_BELTS", url: "/catalog/products?collectionId=1257", customFields: { image: "/images/megamenu/subcategories/171_vbelt_set.jpg" } }, // Kuggrem - 2,735 products
                                { title: "LINK_TENSIONERS_PULLEYS", url: "/catalog/products?collectionId=1257", customFields: { image: "/images/megamenu/subcategories/10036_tensioners_pulleys_and_dampers.png" } },
                                { title: "LINK_CYLINDER_HEAD", url: "/catalog/products?collectionId=1056", customFields: { image: "/images/megamenu/subcategories/72_cylinder_head_parts.jpg" } }, // Oljepackningar - 643 products
                                { title: "LINK_CRANKSHAFT_PARTS", url: "/catalog/products?collectionId=1344", customFields: { image: "/images/megamenu/subcategories/110_crankshaft_drive.jpg" } }, // Vevaxellager - 452 products
                                { title: "LINK_ENGINE_GASKETS", url: "/catalog/products?collectionId=1038", customFields: { image: "/images/megamenu/subcategories/10051_engine_gaskets_and_seals.png" } }, // Avgasgrenrörspackning - 2,786 products
                                { title: "LINK_THROTTLE_BODY", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/subcategories/98_throttle_sensor.jpg" } },
                                { title: "LINK_LUBRICATION", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/subcategories/47_lubrication.jpg" } },
                            ],
                        },
                        // Bränslesystem (Fuel System)
                        {
                            title: "GROUP_FUEL_SYSTEM",
                            url: "/catalog/products?collectionId=57",
                            customFields: {
                                image: "/images/megamenu/subcategories/740_fuel_system.jpg"
                            },
                            links: [
                                { title: "LINK_FUEL_PUMPS", url: "/catalog/products?collectionId=851", customFields: { image: "/images/megamenu/subcategories/744_fuel_pump.jpg" } }, // Bränslepump - 34 products
                                { title: "LINK_FUEL_INJECTORS", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/subcategories/787_injector_valvenozzlenozzle_holderui.jpg" } }, // Bränsleberedning - 191 products
                                { title: "LINK_FUEL_PRESSURE_REGULATOR", url: "/catalog/products?collectionId=857", customFields: { image: "/images/megamenu/subcategories/753_fuel_pressure_regulator_switch.jpg" } }, // Bränsletrycksregulator - 2 products
                                { title: "LINK_FUEL_TANK_PARTS", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/subcategories/Fuel_Tank_Parts.jpg" } },
                                { title: "LINK_FUEL_LINES", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/subcategories/792_fuel_line_distributionallocation.jpg" } },
                                { title: "LINK_HIGH_PRESSURE_PUMP", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/791_fuel_injection_pumphigh_pressure_pump.jpg" } }, // Insprutningspump - 541 products
                                { title: "LINK_FUEL_SENSORS", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/subcategories/235_sensor.jpg" } },
                                { title: "LINK_FUEL_GAUGES", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/subcategories/352_gauges.jpg" } },
                            ],
                        },
                        // Avgassystem (Exhaust System)
                        {
                            title: "GROUP_EXHAUST_SYSTEM",
                            url: "/catalog/products?collectionId=38",
                            customFields: {
                                image: "/images/megamenu/subcategories/198_exhaust_system.jpg"
                            },
                            links: [
                                { title: "LINK_CATALYTIC_CONVERTERS", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/200_catalytic_converter.jpg" } }, // Insprutningspump - 541 products
                                { title: "LINK_MUFFLERS", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/221_silencer.jpg" } },
                                { title: "LINK_EXHAUST_PIPES", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/222_exhaust_pipes.jpg" } },
                                { title: "LINK_EXHAUST_MANIFOLD", url: "/catalog/products?collectionId=1038", customFields: { image: "/images/megamenu/subcategories/226_manifold.jpg" } }, // Avgasgrenrörspackning - 2,786 products
                                { title: "LINK_DPF_FILTER", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/223_sootparticulate_filter.jpg" } },
                                { title: "LINK_LAMBDA_SENSORS", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/201_lambda_sensor.jpg" } },
                                { title: "LINK_EXHAUST_GASKETS", url: "/catalog/products?collectionId=1038", customFields: { image: "/images/megamenu/subcategories/207_gasket.jpg" } },
                                { title: "LINK_EGR_VALVE", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/subcategories/229_exhaust_gas_door.jpg" } },
                            ],
                        },
                        // Elsystem (Electrical System)
                        {
                            title: "GROUP_ELECTRICAL_SYSTEM",
                            url: "/catalog/products?collectionId=168",
                            customFields: {
                                image: "/images/megamenu/subcategories/323_electrics.jpg"
                            },
                            links: [
                                { title: "LINK_STARTERS", url: "/catalog/products?collectionId=265", customFields: { image: "/images/megamenu/subcategories/356_starter.jpg" } }, // Startmotor - 100 products
                                { title: "LINK_ALTERNATORS", url: "/catalog/products?collectionId=196", customFields: { image: "/images/megamenu/subcategories/341_alternator.jpg" } }, // Generator / Delar - 1,793 products
                                { title: "LINK_IGNITION_COILS", url: "/catalog/products?collectionId=1109", customFields: { image: "/images/megamenu/subcategories/326_ignition_coil.jpg" } }, // Tändstift - 768 products
                                { title: "LINK_SPARK_PLUGS", url: "/catalog/products?collectionId=1109", customFields: { image: "/images/megamenu/subcategories/spark_plug_1.jpg" } }, // Tändstift - 768 products
                                { title: "LINK_GLOW_PLUGS", url: "/catalog/products?collectionId=1109", customFields: { image: "/images/megamenu/subcategories/328_glow_plugs.jpg" } },
                                { title: "LINK_SENSORS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/366_sensors.jpg" } }, // El-system - 231 products
                                { title: "LINK_SWITCHES", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/10035_switches.png" } },
                                { title: "LINK_CONTROL_UNITS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/360_control_units.jpg" } },
                                { title: "LINK_HORN", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/349_airelectric_horn.jpg" } },
                                { title: "LINK_WIRING_HARNESS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/367_harness.jpg" } },
                            ],
                        },
                        // Kylsystem (Cooling System)
                        {
                            title: "GROUP_COOLING_SYSTEM",
                            url: "/catalog/products?collectionId=804",
                            customFields: {
                                image: "/images/megamenu/subcategories/296_cooling_system.jpg"
                            },
                            links: [
                                { title: "LINK_WATER_PUMPS", url: "/catalog/products?collectionId=820", customFields: { image: "/images/megamenu/subcategories/299_water_pump.jpg" } }, // Nav - 1 product
                                { title: "LINK_THERMOSTATS", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/subcategories/303_thermostat.jpg" } }, // Frostskydd - 40 products
                                { title: "LINK_RADIATORS", url: "/catalog/products?collectionId=804", customFields: { image: "/images/megamenu/subcategories/310_radiator_parts.jpg" } }, // Kylfläkt - 58 products
                                { title: "LINK_RADIATOR_FANS", url: "/catalog/products?collectionId=804", customFields: { image: "/images/megamenu/subcategories/316_radiator_fan.jpg" } }, // Kylfläkt - 58 products
                                { title: "LINK_COOLANT_HOSES", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/subcategories/306_radiator_hoses.jpg" } },
                                { title: "LINK_EXPANSION_TANKS", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/subcategories/314_expansion_tank_engine_coolant.jpg" } },
                                { title: "LINK_INTERCOOLER", url: "/catalog/products?collectionId=804", customFields: { image: "/images/megamenu/subcategories/93_intercooler.jpg" } },
                                { title: "LINK_OIL_COOLER", url: "/catalog/products?collectionId=804", customFields: { image: "/images/megamenu/subcategories/313_oil_cooler.jpg" } },
                                { title: "LINK_COOLANT_TEMP_SENSOR", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/subcategories/315_sender_unit_coolant_temperature.jpg" } },
                            ],
                        },
                        // Luftkonditionering (Air Conditioning)
                        {
                            title: "GROUP_AIR_CONDITIONING",
                            url: "/catalog/products?collectionId=1521",
                            customFields: {
                                image: "/images/megamenu/subcategories/414_heater.jpg"
                            },
                            links: [
                                { title: "LINK_AC_COMPRESSOR", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/425_compressor_parts.jpg" } }, // Värme / Ventilation - 76 products
                                { title: "LINK_AC_CONDENSER", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/426_condenser.jpg" } },
                                { title: "LINK_AC_EVAPORATOR", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/427_vaporizer.jpg" } },
                                { title: "LINK_AC_DRYER", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/428_dryer.jpg" } },
                                { title: "LINK_HEATER_CORE", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/311_heat_exchanger_interior_heating.jpg" } },
                                { title: "LINK_BLOWER_MOTOR", url: "/catalog/products?collectionId=1523", customFields: { image: "/images/megamenu/subcategories/418_blower_parts.jpg" } }, // Fläktmotor / -delar - 70 products
                                { title: "LINK_AC_HOSES", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/430_hoses_pipes.jpg" } },
                                { title: "LINK_PARKING_HEATER", url: "/catalog/products?collectionId=1521", customFields: { image: "/images/megamenu/subcategories/371_parking_heater.jpg" } },
                            ],
                        },
                        // Drivlina (Transmission)
                        {
                            title: "GROUP_TRANSMISSION",
                            url: "/catalog/products?collectionId=989",
                            customFields: {
                                image: "/images/megamenu/subcategories/814_transmission_and_gearing.jpg"
                            },
                            links: [
                                { title: "LINK_CLUTCH_KITS", url: "/catalog/products?collectionId=989", customFields: { image: "/images/megamenu/subcategories/824_repair_kit_clutch_complete.jpg" } }, // Kopplingshydraulik - 1,195 products
                                { title: "LINK_CLUTCH_PARTS", url: "/catalog/products?collectionId=989", customFields: { image: "/images/megamenu/subcategories/10007_idividual_clutch_parts.png" } },
                                { title: "LINK_FLYWHEEL", url: "/catalog/products?collectionId=989", customFields: { image: "/images/megamenu/subcategories/832_flywheel.jpg" } },
                                { title: "LINK_CV_JOINTS", url: "/catalog/products?collectionId=754", customFields: { image: "/images/megamenu/subcategories/819_cv_joint__set.jpg" } }, // Kraftöverföring - 2 products
                                { title: "LINK_DRIVE_SHAFTS", url: "/catalog/products?collectionId=754", customFields: { image: "/images/megamenu/subcategories/pusass_piedzinasvarpsta.jpg" } },
                                { title: "LINK_PROPSHAFT", url: "/catalog/products?collectionId=754", customFields: { image: "/images/megamenu/subcategories/890_propshaft.jpg" } },
                                { title: "LINK_DIFFERENTIAL", url: "/catalog/products?collectionId=754", customFields: { image: "/images/megamenu/subcategories/886_differential.jpg" } },
                                { title: "LINK_TRANSMISSION_MOUNTS", url: "/catalog/products?collectionId=1573", customFields: { image: "/images/megamenu/subcategories/854_transmission_mounting.jpg" } }, // Upphängning - 820 products
                                { title: "LINK_CLUTCH_MASTER_CYLINDER", url: "/catalog/products?collectionId=989", customFields: { image: "/images/megamenu/subcategories/836_master_cylinder.jpg" } },
                            ],
                        },
                        // Karosseri (Body)
                        {
                            title: "GROUP_BODY",
                            url: "/catalog/products?collectionId=515",
                            customFields: {
                                image: "/images/megamenu/subcategories/443_body.jpg"
                            },
                            links: [
                                { title: "LINK_MIRRORS", url: "/catalog/products?collectionId=515", customFields: { image: "/images/megamenu/subcategories/469_mirrors.jpg" } }, // Grill/delar - 3,027 products
                                { title: "LINK_DOOR_PARTS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/subcategories/477_doors_parts.jpg" } }, // Gasfjädrar - 1,414 products
                                { title: "LINK_DOOR_HANDLES_LOCKS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/subcategories/10005_door_handles_and_locks.png" } },
                                { title: "LINK_WINDOW_REGULATORS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/subcategories/622_window_lift.jpg" } },
                                { title: "LINK_GAS_STRUTS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/subcategories/483_gas_springs.jpg" } }, // Gasfjädrar - 1,414 products
                                { title: "LINK_BUMPER_PARTS", url: "/catalog/products?collectionId=515", customFields: { image: "/images/megamenu/subcategories/460_bumper_parts.jpg" } },
                                { title: "LINK_GRILLES", url: "/catalog/products?collectionId=515", customFields: { image: "/images/megamenu/subcategories/461_front_fairing_grille.jpg" } }, // Grill/delar - 3,027 products
                                { title: "LINK_FENDERS", url: "/catalog/products?collectionId=515", customFields: { image: "/images/megamenu/subcategories/Wing.jpg" } },
                                { title: "LINK_HOOD_PARTS", url: "/catalog/products?collectionId=490", customFields: { image: "/images/megamenu/subcategories/492_bonnet_parts_silencing_material.jpg" } }, // Motorkåpa - 974 products
                                { title: "LINK_INTERIOR_PARTS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/subcategories/10006_interior_parts.png" } },
                            ],
                        },
                        // Utvändig belysning (External Lighting)
                        {
                            title: "GROUP_LIGHTING",
                            url: "/catalog/products?collectionId=273",
                            customFields: {
                                image: "/images/megamenu/subcategories/lightning.jpg"
                            },
                            links: [
                                { title: "LINK_HEADLIGHTS", url: "/catalog/products?collectionId=273", customFields: { image: "/images/megamenu/subcategories/951_headlights.jpg" } }, // Strålkastare / -insats - 2,391 products
                                { title: "LINK_TAIL_LIGHTS", url: "/catalog/products?collectionId=218", customFields: { image: "/images/megamenu/subcategories/combination_rearlight.jpg" } }, // Extra bromsljus - 132 products
                                { title: "LINK_FOG_LIGHTS", url: "/catalog/products?collectionId=188", customFields: { image: "/images/megamenu/subcategories/fog_light-insert.jpg" } }, // Fjärrljusglödlampa - 147 products
                                { title: "LINK_TURN_SIGNALS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/926_indicator.jpg" } },
                                { title: "LINK_LICENSE_PLATE_LIGHTS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/931_licence_plate_light.jpg" } },
                                { title: "LINK_REVERSE_LIGHTS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/subcategories/939_reverse_light.jpg" } },
                                { title: "LINK_BRAKE_LIGHTS", url: "/catalog/products?collectionId=218", customFields: { image: "/images/megamenu/subcategories/921_auxiliary_stop_light.jpg" } }, // Extra bromsljus - 132 products
                                { title: "LINK_CAR_BULBS", url: "/catalog/products?collectionId=188", customFields: { image: "/images/megamenu/subcategories/1074_car_bulbs.jpg" } },
                                { title: "LINK_LED_KITS", url: "/catalog/products?collectionId=273", customFields: { image: "/images/megamenu/subcategories/LED_Conversion_Kits_1.png" } },
                                { title: "LINK_DRL", url: "/catalog/products?collectionId=273", customFields: { image: "/images/megamenu/subcategories/DRL_dedicated.png" } },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_WIPER_BLADES",
        url: "/catalog/products?collectionId=1616",
    },
    {
        title: "MENU_OILS_CAR_CARE",
        url: "/catalog/products?collectionId=57",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        { title: "GROUP_ENGINE_OIL", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/oils-bilvard/957_engine_oil.jpg" }, links: [] },
                        { title: "GROUP_CAR_CARE", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/oils-bilvard/1114_car_detailing.jpg" }, links: [] },
                        { title: "GROUP_TRANSMISSION_OIL", url: "/catalog/products?collectionId=989", customFields: { image: "/images/megamenu/oils-bilvard/958_transmission_oil.jpg" }, links: [] },
                        { title: "GROUP_HYDRAULIC_OIL", url: "/catalog/products?collectionId=989", customFields: { image: "/images/megamenu/oils-bilvard/873_oil.jpg" }, links: [] },
                        { title: "GROUP_LUBRICANTS", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/oils-bilvard/959_lubricants.jpg" }, links: [] },
                        { title: "GROUP_BRAKE_FLUID", url: "/catalog/products?collectionId=116", customFields: { image: "/images/megamenu/oils-bilvard/960_brake_fluid.jpg" }, links: [] },
                        { title: "GROUP_POWER_STEERING_OIL", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/oils-bilvard/1110_power_steering_oil.jpg" }, links: [] },
                        { title: "GROUP_COOLANT", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/oils-bilvard/961_coolant.jpg" }, links: [] },
                        { title: "GROUP_FUEL_ADDITIVES", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/oils-bilvard/Fuel_additives.png" }, links: [] },
                        { title: "GROUP_ADBLUE", url: "/catalog/products?collectionId=38", customFields: { image: "/images/megamenu/oils-bilvard/AdBlue_1.jpg" }, links: [] },
                        { title: "GROUP_OIL_ADDITIVES", url: "/catalog/products?collectionId=57", customFields: { image: "/images/megamenu/oils-bilvard/1075_oil_additives.jpg" }, links: [] },
                        { title: "GROUP_ADHESIVES_SEALANTS", url: "/catalog/products?collectionId=1038", customFields: { image: "/images/megamenu/oils-bilvard/963_adhesives_and_sealants.jpg" }, links: [] },
                        { title: "GROUP_WINDSHIELD_FLUID", url: "/catalog/products?collectionId=1619", customFields: { image: "/images/megamenu/oils-bilvard/964_windshield_fluid.jpg" }, links: [] },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_CAR_ACCESSORIES",
        url: "/catalog/products?collectionId=403",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        { title: "GROUP_EV_CHARGING", url: "/catalog/products?collectionId=358", customFields: { image: "/images/megamenu/biltillbehor/evwc2t7g_1_1_.jpg" }, links: [] },
                        { title: "GROUP_MOBILE_ACCESSORIES", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/71Qe9M9QfGL.jpg" }, links: [] },
                        { title: "GROUP_ADDITIONAL_LIGHTS", url: "/catalog/products?collectionId=188", customFields: { image: "/images/megamenu/biltillbehor/additional_lightning.jpg" }, links: [] },
                        { title: "GROUP_TOWBAR_PARTS", url: "/catalog/products?collectionId=162", customFields: { image: "/images/megamenu/biltillbehor/601_towbar_parts.jpg" }, links: [] },
                        { title: "GROUP_FLOOR_MATS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/968_floor_mats.jpg" }, links: [] },
                        { title: "GROUP_TRUNK_MATS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/1054_trunk_mats.jpg" }, links: [] },
                        { title: "GROUP_WINTER_PRODUCTS", url: "/catalog/products?collectionId=796", customFields: { image: "/images/megamenu/biltillbehor/976_winter_products.jpg" }, links: [] },
                        { title: "GROUP_SNOW_CHAINS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/biltillbehor/1019_snow_chains_and_socks.jpg" }, links: [] },
                        { title: "GROUP_BATTERY_CHARGERS", url: "/catalog/products?collectionId=169", customFields: { image: "/images/megamenu/biltillbehor/975_battery_chargers.jpg" }, links: [] },
                        { title: "GROUP_JUMP_STARTERS", url: "/catalog/products?collectionId=169", customFields: { image: "/images/megamenu/biltillbehor/987_jump_starters.jpg" }, links: [] },
                        { title: "GROUP_JUMP_CABLES", url: "/catalog/products?collectionId=169", customFields: { image: "/images/megamenu/biltillbehor/jump_start_cables.png" }, links: [] },
                        { title: "GROUP_PARKING_SENSORS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/biltillbehor/1014_universal_parking_sensors.jpg" }, links: [] },
                        { title: "GROUP_REVERSING_CAMERAS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/biltillbehor/1015_reversing_cameras.jpg" }, links: [] },
                        { title: "GROUP_ROOF_BARS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/1079_roof_bars_and_accessories.jpg" }, links: [] },
                        { title: "GROUP_BIKE_CARRIERS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/979_bike_carriers.jpg" }, links: [] },
                        { title: "GROUP_DASH_CAMERAS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/biltillbehor/1103_dash_cameras.jpg" }, links: [] },
                        { title: "GROUP_INVERTERS", url: "/catalog/products?collectionId=168", customFields: { image: "/images/megamenu/biltillbehor/1105_inverters.jpg" }, links: [] },
                        { title: "GROUP_CAR_COVERS", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/car_cover.jpg" }, links: [] },
                        { title: "GROUP_WHEEL_TRIMS", url: "/catalog/products?collectionId=322", customFields: { image: "/images/megamenu/biltillbehor/983_wheel_trims.jpg" }, links: [] },
                        { title: "GROUP_BATTERIES", url: "/catalog/products?collectionId=169", customFields: { image: "/images/megamenu/biltillbehor/123batt.jpeg" }, links: [] },
                        { title: "GROUP_OTHER_EQUIPMENT", url: "/catalog/products?collectionId=403", customFields: { image: "/images/megamenu/biltillbehor/985_other_equipment.jpg" }, links: [] },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_TOOLS",
        url: "/catalog/products?collectionId=1032",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        { title: "GROUP_HAND_TOOLS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/verktyg/1041_hand_tools.jpg" }, links: [] },
                        { title: "GROUP_VEHICLE_SERVICE_TOOLS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/verktyg/1033_vehicle_service_tools.jpg" }, links: [] },
                        { title: "GROUP_ELECTRIC_TOOLS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/verktyg/1035_electric_tools.jpg" }, links: [] },
                        { title: "GROUP_CORDLESS_TOOLS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/verktyg/2606-22ct.jpg" }, links: [] },
                        { title: "GROUP_PNEUMATIC_TOOLS", url: "/catalog/products?collectionId=1032", customFields: { image: "/images/megamenu/verktyg/1055_pneumatic_tools.jpg" }, links: [] },
                    ],
                },
            ],
        },
    },
];

export default dataHeaderCategoryMenu;