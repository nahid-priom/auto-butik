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
                            url: "/catalog/products?collectionSlug=bromsanlaggning-2",
                            customFields: {
                                image: "/images/megamenu/subcategories/252_brake_system.jpg"
                            },
                            links: [
                                { title: "LINK_BRAKE_DISCS", url: "/catalog/products?collectionSlug=bromsanlaggning-skivbroms-bromsskiva", customFields: { image: "/images/megamenu/subcategories/269_brake_discs.jpg" } },
                                { title: "LINK_BRAKE_PADS", url: "/catalog/products?collectionSlug=bromsanlaggning-skivbroms-bromsbelagg", customFields: { image: "/images/megamenu/subcategories/268_brake_pads.jpg" } },
                                { title: "LINK_BRAKE_CALIPER", url: "/catalog/products?collectionSlug=bromsanlaggning-bromsok", customFields: { image: "/images/megamenu/subcategories/257_brake_calipers.jpg" } },
                                { title: "LINK_BRAKE_ACCESSORIES", url: "/catalog/products?collectionSlug=bromsanlaggning-skivbroms", customFields: { image: "/images/megamenu/subcategories/270_brake_parts_accessories.jpg" } },
                                { title: "LINK_WEAR_INDICATORS", url: "/catalog/products?collectionSlug=bromsanlaggning-skivbroms-slitagevarnare", customFields: { image: "/images/megamenu/subcategories/281_wear_indicator_brake_pads.jpg" } },
                                { title: "LINK_BRAKE_CALIPER_REPAIR", url: "/catalog/products?collectionSlug=bromsanlaggning-bromsok", customFields: { image: "/images/megamenu/subcategories/256_brake_caliper_parts.jpg" } },
                                { title: "LINK_HAND_BRAKES", url: "/catalog/products?collectionSlug=bromsanlaggning-parkeringsbroms", customFields: { image: "/images/megamenu/subcategories/260_handbrake.jpg" } },
                                { title: "LINK_BRAKE_DRUMS", url: "/catalog/products?collectionSlug=bromsanlaggning-bromstrumma", customFields: { image: "/images/megamenu/subcategories/274_brake_drums.jpg" } },
                                { title: "LINK_BRAKE_SHOES", url: "/catalog/products?collectionSlug=bromsanlaggning-trumbroms", customFields: { image: "/images/megamenu/subcategories/273_brake_lining_shoe.jpg" } },
                                { title: "LINK_WHEEL_CYLINDERS", url: "/catalog/products?collectionSlug=bromsanlaggning-hjulcylinder", customFields: { image: "/images/megamenu/subcategories/279_wheel_cylinders.jpg" } },
                                { title: "LINK_DRUM_BRAKE_PARTS", url: "/catalog/products?collectionSlug=bromsanlaggning-trumbroms", customFields: { image: "/images/megamenu/subcategories/276_drum_brake_parts.jpg" } },
                                { title: "LINK_ABS_PARTS", url: "/catalog/products?collectionSlug=bromsanlaggning-kordynamikreglering-2", customFields: { image: "/images/megamenu/subcategories/264_abs_parts.jpg" } },
                                { title: "LINK_BRAKE_MASTER_CYLINDER", url: "/catalog/products?collectionSlug=bromsanlaggning-huvudcylinder", customFields: { image: "/images/megamenu/subcategories/254_brake_master_cylinder.jpg" } },
                                { title: "LINK_BRAKE_HOSES", url: "/catalog/products?collectionSlug=bromsanlaggning-bromsslangar-2", customFields: { image: "/images/megamenu/subcategories/261_brake_hoses.jpg" } },
                                { title: "LINK_PARKING_BRAKE_CABLES", url: "/catalog/products?collectionSlug=bromsanlaggning-parkeringsbroms", customFields: { image: "/images/megamenu/subcategories/282_control_levers_cables.jpg" } },
                                { title: "LINK_BRAKE_LINE_FITTINGS", url: "/catalog/products?collectionSlug=bromsanlaggning-rorledningar", customFields: { image: "/images/megamenu/subcategories/1102_brake_line_fittings.jpg" } },
                                { title: "LINK_BRAKE_BOOSTER", url: "/catalog/products?collectionSlug=bromsforstarkare-delar-0200101", customFields: { image: "/images/megamenu/subcategories/253_brake_booster.jpg" } },
                                { title: "LINK_BRAKE_POWER_REGULATOR", url: "/catalog/products?collectionSlug=bromskraftregulator-0200107", customFields: { image: "/images/megamenu/subcategories/263_brake_power_regulator.jpg" } },
                            ],
                        },
                        // Filter
                        {
                            title: "GROUP_FILTERS",
                            url: "/catalog/products?collectionSlug=filter",
                            customFields: {
                                image: "/images/megamenu/subcategories/241_filters.jpg"
                            },
                            links: [
                                { title: "LINK_OIL_FILTERS", url: "/catalog/products?collectionSlug=filter-oljefilter", customFields: { image: "/images/megamenu/subcategories/242_oil_filters.jpg" } },
                                { title: "LINK_AIR_FILTERS", url: "/catalog/products?collectionSlug=filter-luftfilter", customFields: { image: "/images/megamenu/subcategories/243_air_filters.jpg" } },
                                { title: "LINK_FUEL_FILTERS", url: "/catalog/products?collectionSlug=filter-branslefilter", customFields: { image: "/images/megamenu/subcategories/244_fuel_filters.jpg" } },
                                { title: "LINK_HYDRAULIC_FILTERS", url: "/catalog/products?collectionSlug=filter-hydraulfilter", customFields: { image: "/images/megamenu/subcategories/245_hydraulic_filters.jpg" } },
                                { title: "LINK_CABIN_FILTERS", url: "/catalog/products?collectionSlug=filter-kupeluftfilter", customFields: { image: "/images/megamenu/subcategories/246_pollen_filters.jpg" } },
                                { title: "LINK_COOLANT_FILTERS", url: "/catalog/products?collectionSlug=filter-kylmedelsfilter", customFields: { image: "/images/megamenu/subcategories/247_coolant_filters.jpg" } },
                                { title: "LINK_FILTER_SETS", url: "/catalog/products?collectionSlug=filter-filtersats", customFields: { image: "/images/megamenu/subcategories/248_filter_sets.jpg" } },
                                { title: "LINK_POWER_STEERING_FILTERS", url: "/catalog/products?collectionSlug=filter-hydraulfilter", customFields: { image: "/images/megamenu/subcategories/685_filter_power_steering.jpg" } },
                            ],
                        },
                        // Dämpare och fjädrar (Suspension)
                        {
                            title: "GROUP_SUSPENSION",
                            url: "/catalog/products?collectionSlug=fjadringdampning-2",
                            customFields: {
                                image: "/images/megamenu/subcategories/663_suspension.jpg"
                            },
                            links: [
                                { title: "LINK_SHOCK_ABSORBERS", url: "/catalog/products?collectionSlug=fjadringdampning-stotdampare", customFields: { image: "/images/megamenu/subcategories/665_shock_absorbers.jpg" } },
                                { title: "LINK_COIL_SPRINGS", url: "/catalog/products?collectionSlug=fjadringdampning-fjader-och-stotdamparsats", customFields: { image: "/images/megamenu/subcategories/664_coil_springs.jpg" } },
                                { title: "LINK_BALL_JOINTS", url: "/catalog/products?collectionSlug=framvagns-och-chassidelar-leder-spindelled-kulled", customFields: { image: "/images/megamenu/subcategories/723_ball_joint.jpg" } },
                                { title: "LINK_CONTROL_ARMS", url: "/catalog/products?collectionSlug=framvagns-och-chassidelar-lankarmar-lankarmslager", customFields: { image: "/images/megamenu/subcategories/713_steering_links_control_arm_trailing_link_diagonal_arm.jpg" } },
                                { title: "LINK_STABILIZER", url: "/catalog/products?collectionSlug=krangningshammare-delar-0200467", customFields: { image: "/images/megamenu/subcategories/717_stabilizer.jpg" } },
                                { title: "LINK_WHEEL_BEARINGS", url: "/catalog/products?collectionSlug=hjullager-sats-0200888", customFields: { image: "/images/megamenu/subcategories/wheel_bearing.jpg" } },
                                { title: "LINK_WHEEL_HUBS", url: "/catalog/products?collectionSlug=framvagns-och-chassidelar-hjulnav-infastning", customFields: { image: "/images/megamenu/subcategories/702_wheel_hub.jpg" } },
                                { title: "LINK_STRUT_MOUNTS", url: "/catalog/products?collectionSlug=fjadringdampning-fjaderbenslager-stotdamparfasten", customFields: { image: "/images/megamenu/subcategories/668_suspension_strut_bearing.jpg" } },
                                { title: "LINK_STRUT_BOOTS", url: "/catalog/products?collectionSlug=hjuldrivning-balg", customFields: { image: "/images/megamenu/subcategories/Strut_boots.jpg" } },
                                { title: "LINK_WHEEL_NUTS_BOLTS", url: "/catalog/products?collectionSlug=hjul-dack-hjulskruv-mutter", customFields: { image: "/images/megamenu/subcategories/738_wheel_nuts_bolts___studs.jpg" } },
                                { title: "LINK_AXLE_BEAM", url: "/catalog/products?collectionSlug=axelupphangninghjulstyrning", customFields: { image: "/images/megamenu/subcategories/726_axle_beam.jpg" } },
                                { title: "LINK_AIR_SUSPENSION", url: "/catalog/products?collectionSlug=flervagsventil-luftfjadring-0200542", customFields: { image: "/images/megamenu/subcategories/674_pneumatic_suspension.jpg" } },
                            ],
                        },
                        // Styrning (Steering)
                        {
                            title: "GROUP_STEERING",
                            url: "/catalog/products?collectionSlug=styrning",
                            customFields: {
                                image: "/images/megamenu/subcategories/676_steering.jpg"
                            },
                            links: [
                                { title: "LINK_TIE_RODS", url: "/catalog/products?collectionSlug=framvagns-och-chassidelar-styrspindel-reparationssats", customFields: { image: "/images/megamenu/subcategories/677_tie_rod.jpg" } },
                                { title: "LINK_TIE_ROD_ENDS", url: "/catalog/products?collectionSlug=styrning-styrleder", customFields: { image: "/images/megamenu/subcategories/690_tie_rod_assembly.jpg" } },
                                { title: "LINK_POWER_STEERING_PUMPS", url: "/catalog/products?collectionSlug=styrvaxel-servopump-0200515", customFields: { image: "/images/megamenu/subcategories/678_steering_pump.jpg" } },
                                { title: "LINK_STEERING_RACKS", url: "/catalog/products?collectionSlug=stryning-styrvaxel-pump", customFields: { image: "/images/megamenu/subcategories/986_steering_gear.jpg" } },
                                { title: "LINK_STEERING_COLUMN", url: "/catalog/products?collectionSlug=komfortsystem-motor-rela-styrkolumninstallning", customFields: { image: "/images/megamenu/subcategories/681_steering_column.jpg" } },
                                { title: "LINK_STEERING_DAMPER", url: "/catalog/products?collectionSlug=styrdampare-0402175", customFields: { image: "/images/megamenu/subcategories/679_steering_damper.jpg" } },
                                { title: "LINK_STEERING_BOOTS", url: "/catalog/products?collectionSlug=axelupphangninghjulstyrning-balgar", customFields: { image: "/images/megamenu/subcategories/680_bellowseal.jpg" } },
                                { title: "LINK_STEERING_HOSES", url: "/catalog/products?collectionSlug=bromsanlaggning-rorledningar", customFields: { image: "/images/megamenu/subcategories/686_steering_hose_pipe.jpg" } },
                                { title: "LINK_STEERING_LINKAGE", url: "/catalog/products?collectionSlug=styrning-styrleder", customFields: { image: "/images/megamenu/subcategories/688_steering_linkage.jpg" } },
                                { title: "LINK_STEERING_RESERVOIR", url: "/catalog/products?collectionSlug=bromsanlaggning-bromsvatskebehallare-delar", customFields: { image: "/images/megamenu/subcategories/693_hydraulic_oil_expansion_tank.jpg" } },
                            ],
                        },
                        // Vindrutetorkar system (Windscreen Wipers)
                        {
                            title: "GROUP_WIPERS",
                            url: "/catalog/products?collectionSlug=vindruterengoring",
                            customFields: {
                                image: "/images/megamenu/subcategories/606_windscreen_cleaning_system.jpg"
                            },
                            links: [
                                { title: "LINK_WIPER_BLADES", url: "/catalog/products?collectionSlug=vindruterengoring-torkarblad-gummi", customFields: { image: "/images/megamenu/subcategories/607_windscreen_wipers.jpg" } },
                                { title: "LINK_WIPER_MOTORS", url: "/catalog/products?collectionSlug=vindruterengoring-torkarmotor", customFields: { image: "/images/megamenu/subcategories/608_motor_windscreen_wipers.jpg" } },
                                { title: "LINK_WASHER_PUMPS", url: "/catalog/products?collectionSlug=vindruterengoring-vindrutespolarpump", customFields: { image: "/images/megamenu/subcategories/609_water_pump_windscreen_washing.jpg" } },
                                { title: "LINK_WIPER_LINKAGE", url: "/catalog/products?collectionSlug=vindruterengoring-torkararm-drivning", customFields: { image: "/images/megamenu/subcategories/611_wiper_linkage_drive.jpg" } },
                                { title: "LINK_WASHER_RESERVOIR", url: "/catalog/products?collectionSlug=filter-spolarvatska-0200165", customFields: { image: "/images/megamenu/subcategories/612_water_tank_pipe_windscreen.jpg" } },
                                { title: "LINK_WASHER_JETS", url: "/catalog/products?collectionSlug=vindruterengoring-vindrutespolarmunstycke", customFields: { image: "/images/megamenu/subcategories/613_washer_fluid_jet.jpg" } },
                                { title: "LINK_HEADLIGHT_WASHER", url: "/catalog/products?collectionSlug=vindruterengoring-vindruterengoringssystem", customFields: { image: "/images/megamenu/subcategories/955_headlight_washer_system.jpg" } },
                            ],
                        },
                        // Motordelar (Engine Parts)
                        {
                            title: "GROUP_ENGINE_PARTS",
                            url: "/catalog/products?collectionSlug=motor",
                            customFields: {
                                image: "/images/megamenu/subcategories/4_engine.jpg"
                            },
                            links: [
                                { title: "LINK_TIMING_BELT_KITS", url: "/catalog/products?collectionSlug=remdrift-kuggrem-sats-remspannare", customFields: { image: "/images/megamenu/subcategories/185_timing_belt_set.jpg" } },
                                { title: "LINK_TIMING_CHAIN_KITS", url: "/catalog/products?collectionSlug=motor-motortransmission-kamkedja-strackare-styrning-kamkedjesats", customFields: { image: "/images/megamenu/subcategories/25_timing_chain_set.jpg" } },
                                { title: "LINK_TURBOCHARGERS", url: "/catalog/products?collectionSlug=motor-luftberedning-turboladdare", customFields: { image: "/images/megamenu/subcategories/227_turbocharger.jpg" } },
                                { title: "LINK_ENGINE_MOUNTS", url: "/catalog/products?collectionSlug=motor-motorupphangning-motorfasten", customFields: { image: "/images/megamenu/subcategories/135_engine_mounting_bracket.jpg" } },
                                { title: "LINK_INTAKE_MANIFOLD", url: "/catalog/products?collectionSlug=motor-luftberedning-insugsgrenrorinsug", customFields: { image: "/images/megamenu/subcategories/86_intake_manifold.jpg" } },
                                { title: "LINK_DRIVE_BELTS", url: "/catalog/products?collectionSlug=remdrift-drivremmar", customFields: { image: "/images/megamenu/subcategories/171_vbelt_set.jpg" } },
                                { title: "LINK_TENSIONERS_PULLEYS", url: "/catalog/products?collectionSlug=remdrift-flersparsrem-sats-remspannare", customFields: { image: "/images/megamenu/subcategories/10036_tensioners_pulleys_and_dampers.png" } },
                                { title: "LINK_CYLINDER_HEAD", url: "/catalog/products?collectionSlug=motor-topplockdelar", customFields: { image: "/images/megamenu/subcategories/72_cylinder_head_parts.jpg" } },
                                { title: "LINK_CRANKSHAFT_PARTS", url: "/catalog/products?collectionSlug=motor-vevaxel", customFields: { image: "/images/megamenu/subcategories/110_crankshaft_drive.jpg" } },
                                { title: "LINK_ENGINE_GASKETS", url: "/catalog/products?collectionSlug=bromsanlaggning-tatningarpackningar", customFields: { image: "/images/megamenu/subcategories/10051_engine_gaskets_and_seals.png" } },
                                { title: "LINK_THROTTLE_BODY", url: "/catalog/products?collectionSlug=avgassystem-avgasspjall", customFields: { image: "/images/megamenu/subcategories/98_throttle_sensor.jpg" } },
                                { title: "LINK_LUBRICATION", url: "/catalog/products?collectionSlug=motor-smrorjning", customFields: { image: "/images/megamenu/subcategories/47_lubrication.jpg" } },
                            ],
                        },
                        // Bränslesystem (Fuel System)
                        {
                            title: "GROUP_FUEL_SYSTEM",
                            url: "/catalog/products?collectionSlug=matarpump-bransle",
                            customFields: {
                                image: "/images/megamenu/subcategories/740_fuel_system.jpg"
                            },
                            links: [
                                { title: "LINK_FUEL_PUMPS", url: "/catalog/products?collectionSlug=matarpump-bransle-branslepump", customFields: { image: "/images/megamenu/subcategories/744_fuel_pump.jpg" } },
                                { title: "LINK_FUEL_INJECTORS", url: "/catalog/products?collectionSlug=bransleberedning-bransleberedning-bransleinsprutningspumphogtryckspump", customFields: { image: "/images/megamenu/subcategories/787_injector_valvenozzlenozzle_holderui.jpg" } },
                                { title: "LINK_FUEL_PRESSURE_REGULATOR", url: "/catalog/products?collectionSlug=matarpump-bransle-bransletrycksregulator-brytare", customFields: { image: "/images/megamenu/subcategories/753_fuel_pressure_regulator_switch.jpg" } },
                                { title: "LINK_FUEL_TANK_PARTS", url: "/catalog/products?collectionSlug=karosseri-bransletankdelar", customFields: { image: "/images/megamenu/subcategories/Fuel_Tank_Parts.jpg" } },
                                { title: "LINK_FUEL_LINES", url: "/catalog/products?collectionSlug=matarpump-bransle-bransleledningar", customFields: { image: "/images/megamenu/subcategories/792_fuel_line_distributionallocation.jpg" } },
                                { title: "LINK_HIGH_PRESSURE_PUMP", url: "/catalog/products?collectionSlug=bransleberedning-bransleberedning-bransleinsprutningspumphogtryckspump", customFields: { image: "/images/megamenu/subcategories/791_fuel_injection_pumphigh_pressure_pump.jpg" } },
                                { title: "LINK_FUEL_SENSORS", url: "/catalog/products?collectionSlug=matarpump-bransle-branslegivare", customFields: { image: "/images/megamenu/subcategories/235_sensor.jpg" } },
                                { title: "LINK_FUEL_GAUGES", url: "/catalog/products?collectionSlug=matarpump-bransle-branslegivare", customFields: { image: "/images/megamenu/subcategories/352_gauges.jpg" } },
                            ],
                        },
                        // Avgassystem (Exhaust System)
                        {
                            title: "GROUP_EXHAUST_SYSTEM",
                            url: "/catalog/products?collectionSlug=avgassystem-2",
                            customFields: {
                                image: "/images/megamenu/subcategories/198_exhaust_system.jpg"
                            },
                            links: [
                                { title: "LINK_CATALYTIC_CONVERTERS", url: "/catalog/products?collectionSlug=avgassystem-katalysator", customFields: { image: "/images/megamenu/subcategories/200_catalytic_converter.jpg" } },
                                { title: "LINK_MUFFLERS", url: "/catalog/products?collectionSlug=avgassystem-ljuddampare-2", customFields: { image: "/images/megamenu/subcategories/221_silencer.jpg" } },
                                { title: "LINK_EXHAUST_PIPES", url: "/catalog/products?collectionSlug=avgassystem-avgasror-2", customFields: { image: "/images/megamenu/subcategories/222_exhaust_pipes.jpg" } },
                                { title: "LINK_EXHAUST_MANIFOLD", url: "/catalog/products?collectionSlug=avgassystem-grenror", customFields: { image: "/images/megamenu/subcategories/226_manifold.jpg" } },
                                { title: "LINK_DPF_FILTER", url: "/catalog/products?collectionSlug=avgassystem-sot-partikelfilter-2", customFields: { image: "/images/megamenu/subcategories/223_sootparticulate_filter.jpg" } },
                                { title: "LINK_LAMBDA_SENSORS", url: "/catalog/products?collectionSlug=avgassystem-lambdasond", customFields: { image: "/images/megamenu/subcategories/201_lambda_sensor.jpg" } },
                                { title: "LINK_EXHAUST_GASKETS", url: "/catalog/products?collectionSlug=avgassystem-monteringsdetaljer-2", customFields: { image: "/images/megamenu/subcategories/207_gasket.jpg" } },
                                { title: "LINK_EGR_VALVE", url: "/catalog/products?collectionSlug=motor-avgasrening-avgasaterforing", customFields: { image: "/images/megamenu/subcategories/229_exhaust_gas_door.jpg" } },
                            ],
                        },
                        // Elsystem (Electrical System)
                        {
                            title: "GROUP_ELECTRICAL_SYSTEM",
                            url: "/catalog/products?collectionSlug=elsystem",
                            customFields: {
                                image: "/images/megamenu/subcategories/323_electrics.jpg"
                            },
                            links: [
                                { title: "LINK_STARTERS", url: "/catalog/products?collectionSlug=elsystem-startmotor", customFields: { image: "/images/megamenu/subcategories/356_starter.jpg" } },
                                { title: "LINK_ALTERNATORS", url: "/catalog/products?collectionSlug=elsystem-generator-delar", customFields: { image: "/images/megamenu/subcategories/341_alternator.jpg" } },
                                { title: "LINK_IGNITION_COILS", url: "/catalog/products?collectionSlug=tandningglodning-tandspolartandspole-enheter", customFields: { image: "/images/megamenu/subcategories/326_ignition_coil.jpg" } },
                                { title: "LINK_SPARK_PLUGS", url: "/catalog/products?collectionSlug=tandningglodning-tandstift", customFields: { image: "/images/megamenu/subcategories/spark_plug_1.jpg" } },
                                { title: "LINK_GLOW_PLUGS", url: "/catalog/products?collectionSlug=tandningglodning-glodstift", customFields: { image: "/images/megamenu/subcategories/328_glow_plugs.jpg" } },
                                { title: "LINK_SENSORS", url: "/catalog/products?collectionSlug=elsystem-sensorer", customFields: { image: "/images/megamenu/subcategories/366_sensors.jpg" } },
                                { title: "LINK_SWITCHES", url: "/catalog/products?collectionSlug=elsystem-strombrytare", customFields: { image: "/images/megamenu/subcategories/10035_switches.png" } },
                                { title: "LINK_CONTROL_UNITS", url: "/catalog/products?collectionSlug=elsystem-styrenheter", customFields: { image: "/images/megamenu/subcategories/360_control_units.jpg" } },
                                { title: "LINK_HORN", url: "/catalog/products?collectionSlug=belsyningsignalsystem-signalhorn-fanfar", customFields: { image: "/images/megamenu/subcategories/349_airelectric_horn.jpg" } },
                                { title: "LINK_WIRING_HARNESS", url: "/catalog/products?collectionSlug=bransleberedning-forgasare-kabelstam", customFields: { image: "/images/megamenu/subcategories/367_harness.jpg" } },
                            ],
                        },
                        // Kylsystem (Cooling System)
                        {
                            title: "GROUP_COOLING_SYSTEM",
                            url: "/catalog/products?collectionSlug=kylsystem",
                            customFields: {
                                image: "/images/megamenu/subcategories/296_cooling_system.jpg"
                            },
                            links: [
                                { title: "LINK_WATER_PUMPS", url: "/catalog/products?collectionSlug=kylsystem-vattenpumpar-packning", customFields: { image: "/images/megamenu/subcategories/299_water_pump.jpg" } },
                                { title: "LINK_THERMOSTATS", url: "/catalog/products?collectionSlug=kylsystem-termostat-packning", customFields: { image: "/images/megamenu/subcategories/303_thermostat.jpg" } },
                                { title: "LINK_RADIATORS", url: "/catalog/products?collectionSlug=kylsystem-kylare-oljekylare", customFields: { image: "/images/megamenu/subcategories/310_radiator_parts.jpg" } },
                                { title: "LINK_RADIATOR_FANS", url: "/catalog/products?collectionSlug=kylsystem-kylflakt", customFields: { image: "/images/megamenu/subcategories/316_radiator_fan.jpg" } },
                                { title: "LINK_COOLANT_HOSES", url: "/catalog/products?collectionSlug=kylsystem-slangar", customFields: { image: "/images/megamenu/subcategories/306_radiator_hoses.jpg" } },
                                { title: "LINK_EXPANSION_TANKS", url: "/catalog/products?collectionSlug=kylsystem-expansionskarl", customFields: { image: "/images/megamenu/subcategories/314_expansion_tank_engine_coolant.jpg" } },
                                { title: "LINK_INTERCOOLER", url: "/catalog/products?collectionSlug=laddluftkylning-delar-0200922", customFields: { image: "/images/megamenu/subcategories/93_intercooler.jpg" } },
                                { title: "LINK_OIL_COOLER", url: "/catalog/products?collectionSlug=kylsystem-kylare-oljekylare", customFields: { image: "/images/megamenu/subcategories/313_oil_cooler.jpg" } },
                                { title: "LINK_COOLANT_TEMP_SENSOR", url: "/catalog/products?collectionSlug=kylsystem-givare-strombrytare", customFields: { image: "/images/megamenu/subcategories/315_sender_unit_coolant_temperature.jpg" } },
                            ],
                        },
                        // Luftkonditionering (Air Conditioning)
                        {
                            title: "GROUP_AIR_CONDITIONING",
                            url: "/catalog/products?collectionSlug=klimatanlaggning-2",
                            customFields: {
                                image: "/images/megamenu/subcategories/414_heater.jpg"
                            },
                            links: [
                                { title: "LINK_AC_COMPRESSOR", url: "/catalog/products?collectionSlug=klimatanlaggning-kompressor-delar-2", customFields: { image: "/images/megamenu/subcategories/425_compressor_parts.jpg" } },
                                { title: "LINK_AC_CONDENSER", url: "/catalog/products?collectionSlug=klimatanlaggning-kondensor-2", customFields: { image: "/images/megamenu/subcategories/426_condenser.jpg" } },
                                { title: "LINK_AC_EVAPORATOR", url: "/catalog/products?collectionSlug=klimatanlaggning-forangare-2", customFields: { image: "/images/megamenu/subcategories/427_vaporizer.jpg" } },
                                { title: "LINK_AC_DRYER", url: "/catalog/products?collectionSlug=klimatanlaggning-torkare-2", customFields: { image: "/images/megamenu/subcategories/428_dryer.jpg" } },
                                { title: "LINK_HEATER_CORE", url: "/catalog/products?collectionSlug=varme-ventilation-varmevaxlare", customFields: { image: "/images/megamenu/subcategories/311_heat_exchanger_interior_heating.jpg" } },
                                { title: "LINK_BLOWER_MOTOR", url: "/catalog/products?collectionSlug=varme-ventilation-flaktmotor-delar", customFields: { image: "/images/megamenu/subcategories/418_blower_parts.jpg" } },
                                { title: "LINK_AC_HOSES", url: "/catalog/products?collectionSlug=klimatanlaggning-kylarslangar", customFields: { image: "/images/megamenu/subcategories/430_hoses_pipes.jpg" } },
                                { title: "LINK_PARKING_HEATER", url: "/catalog/products?collectionSlug=varme-ventilation-oberoende-uppvarmning", customFields: { image: "/images/megamenu/subcategories/371_parking_heater.jpg" } },
                            ],
                        },
                        // Drivlina (Transmission)
                        {
                            title: "GROUP_TRANSMISSION",
                            url: "/catalog/products?collectionSlug=koppling",
                            customFields: {
                                image: "/images/megamenu/subcategories/814_transmission_and_gearing.jpg"
                            },
                            links: [
                                { title: "LINK_CLUTCH_KITS", url: "/catalog/products?collectionSlug=koppling-delar-kopplingssats", customFields: { image: "/images/megamenu/subcategories/824_repair_kit_clutch_complete.jpg" } },
                                { title: "LINK_CLUTCH_PARTS", url: "/catalog/products?collectionSlug=koppling-delar", customFields: { image: "/images/megamenu/subcategories/10007_idividual_clutch_parts.png" } },
                                { title: "LINK_FLYWHEEL", url: "/catalog/products?collectionSlug=koppling-delar-styrlagersvanghjulslagermedbringarskiva", customFields: { image: "/images/megamenu/subcategories/832_flywheel.jpg" } },
                                { title: "LINK_CV_JOINTS", url: "/catalog/products?collectionSlug=hjuldrivning-ledknut-sats", customFields: { image: "/images/megamenu/subcategories/819_cv_joint__set.jpg" } },
                                { title: "LINK_DRIVE_SHAFTS", url: "/catalog/products?collectionSlug=drivaxel-tillbehor-0200321", customFields: { image: "/images/megamenu/subcategories/pusass_piedzinasvarpsta.jpg" } },
                                { title: "LINK_PROPSHAFT", url: "/catalog/products?collectionSlug=motor-motortransmission-mellanaxel", customFields: { image: "/images/megamenu/subcategories/890_propshaft.jpg" } },
                                { title: "LINK_DIFFERENTIAL", url: "/catalog/products?collectionSlug=differential-delar-0200871", customFields: { image: "/images/megamenu/subcategories/886_differential.jpg" } },
                                { title: "LINK_TRANSMISSION_MOUNTS", url: "/catalog/products?collectionSlug=kraftoverforingvaxellada-vaxelladsfasten", customFields: { image: "/images/megamenu/subcategories/854_transmission_mounting.jpg" } },
                                { title: "LINK_CLUTCH_MASTER_CYLINDER", url: "/catalog/products?collectionSlug=koppling-delar-kopplingshuvudcylinder", customFields: { image: "/images/megamenu/subcategories/836_master_cylinder.jpg" } },
                            ],
                        },
                        // Karosseri (Body)
                        {
                            title: "GROUP_BODY",
                            url: "/catalog/products?collectionSlug=karosseri-2",
                            customFields: {
                                image: "/images/megamenu/subcategories/443_body.jpg"
                            },
                            links: [
                                { title: "LINK_MIRRORS", url: "/catalog/products?collectionSlug=karosseri-spegel-tillbehor", customFields: { image: "/images/megamenu/subcategories/469_mirrors.jpg" } },
                                { title: "LINK_DOOR_PARTS", url: "/catalog/products?collectionSlug=karosseri-luckorhuvardorrarsoltakkanvastak", customFields: { image: "/images/megamenu/subcategories/477_doors_parts.jpg" } },
                                { title: "LINK_DOOR_HANDLES_LOCKS", url: "/catalog/products?collectionSlug=lassystem-dorrlasdelar", customFields: { image: "/images/megamenu/subcategories/10005_door_handles_and_locks.png" } },
                                { title: "LINK_WINDOW_REGULATORS", url: "/catalog/products?collectionSlug=invandig-utrustning-fonsterhissar", customFields: { image: "/images/megamenu/subcategories/622_window_lift.jpg" } },
                                { title: "LINK_GAS_STRUTS", url: "/catalog/products?collectionSlug=karosseri-gasfjadrar", customFields: { image: "/images/megamenu/subcategories/483_gas_springs.jpg" } },
                                { title: "LINK_BUMPER_PARTS", url: "/catalog/products?collectionSlug=karosseri-karoseridelarskarmarstotfangare", customFields: { image: "/images/megamenu/subcategories/460_bumper_parts.jpg" } },
                                { title: "LINK_GRILLES", url: "/catalog/products?collectionSlug=karosseri-frontplat-grill", customFields: { image: "/images/megamenu/subcategories/461_front_fairing_grille.jpg" } },
                                { title: "LINK_FENDERS", url: "/catalog/products?collectionSlug=karosseri-karoseridelarskarmarstotfangare", customFields: { image: "/images/megamenu/subcategories/Wing.jpg" } },
                                { title: "LINK_HOOD_PARTS", url: "/catalog/products?collectionSlug=komfortsystem-motorhuvsaktivering", customFields: { image: "/images/megamenu/subcategories/492_bonnet_parts_silencing_material.jpg" } },
                                { title: "LINK_INTERIOR_PARTS", url: "/catalog/products?collectionSlug=invandig-utrustning", customFields: { image: "/images/megamenu/subcategories/10006_interior_parts.png" } },
                            ],
                        },
                        // Utvändig belysning (External Lighting)
                        {
                            title: "GROUP_LIGHTING",
                            url: "/catalog/products?collectionSlug=belsyningsignalsystem",
                            customFields: {
                                image: "/images/megamenu/subcategories/lightning.jpg"
                            },
                            links: [
                                { title: "LINK_HEADLIGHTS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-stralkastare-delar", customFields: { image: "/images/megamenu/subcategories/951_headlights.jpg" } },
                                { title: "LINK_TAIL_LIGHTS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-lampor-och-lyktor-bakljus", customFields: { image: "/images/megamenu/subcategories/combination_rearlight.jpg" } },
                                { title: "LINK_FOG_LIGHTS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-extraljus-delar-dimstralkastare-delar", customFields: { image: "/images/megamenu/subcategories/fog_light-insert.jpg" } },
                                { title: "LINK_TURN_SIGNALS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-lampor-och-lyktor-blinklyktor", customFields: { image: "/images/megamenu/subcategories/926_indicator.jpg" } },
                                { title: "LINK_LICENSE_PLATE_LIGHTS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-lampor-och-lyktor-nummerskyltsbelysning", customFields: { image: "/images/megamenu/subcategories/931_licence_plate_light.jpg" } },
                                { title: "LINK_REVERSE_LIGHTS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-lampor-och-lyktor-backljus", customFields: { image: "/images/megamenu/subcategories/939_reverse_light.jpg" } },
                                { title: "LINK_BRAKE_LIGHTS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-lampor-och-lyktor-bromsljusextrabromsljus", customFields: { image: "/images/megamenu/subcategories/921_auxiliary_stop_light.jpg" } },
                                { title: "LINK_CAR_BULBS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-glodlampor", customFields: { image: "/images/megamenu/subcategories/1074_car_bulbs.jpg" } },
                                { title: "LINK_LED_KITS", url: "/catalog/products?collectionSlug=belsyningsignalsystem-glodlampor-glodlampor-stralkastare", customFields: { image: "/images/megamenu/subcategories/LED_Conversion_Kits_1.png" } },
                                { title: "LINK_DRL", url: "/catalog/products?collectionSlug=belsyningsignalsystem-lampor-och-lyktor-dagsfardsellampa", customFields: { image: "/images/megamenu/subcategories/DRL_dedicated.png" } },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_WIPER_BLADES",
        url: "/catalog/products?collectionSlug=vindruterengoring-torkarblad-gummi",
    },
    {
        title: "MENU_OILS_CAR_CARE",
        url: "/catalog/products?collectionSlug=kemiska-produkter",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        // Motorolja (Engine Oil)
                        {
                            title: "GROUP_ENGINE_OIL",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-motorolja",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/957_engine_oil.jpg"
                            },
                            links: [],
                        },
                        // Bilvård (Car Care/Detailing)
                        {
                            title: "GROUP_CAR_CARE",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-rengorings-underhallsmedel-utvandigt",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/1114_car_detailing.jpg"
                            },
                            links: [],
                        },
                        // Växellådsolja (Transmission Oil)
                        {
                            title: "GROUP_TRANSMISSION_OIL",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-vaxelladsolja",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/958_transmission_oil.jpg"
                            },
                            links: [],
                        },
                        // Hydraulolja (Hydraulic Oil)
                        {
                            title: "GROUP_HYDRAULIC_OIL",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-hydraulolja",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/873_oil.jpg"
                            },
                            links: [],
                        },
                        // Smörjmedel (Lubricants)
                        {
                            title: "GROUP_LUBRICANTS",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-smorjmedel",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/959_lubricants.jpg"
                            },
                            links: [],
                        },
                        // Bromsvätska (Brake Fluid)
                        {
                            title: "GROUP_BRAKE_FLUID",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-bromsvatskor",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/960_brake_fluid.jpg"
                            },
                            links: [],
                        },
                        // Servostyrningsolja (Power Steering Oil)
                        {
                            title: "GROUP_POWER_STEERING_OIL",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-servostyrningsolja",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/1110_power_steering_oil.jpg"
                            },
                            links: [],
                        },
                        // Kylarvätska (Coolant)
                        {
                            title: "GROUP_COOLANT",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-koldmedelkylmedelfrostskydd",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/961_coolant.jpg"
                            },
                            links: [],
                        },
                        // Bränsletillsatser (Fuel Additives)
                        {
                            title: "GROUP_FUEL_ADDITIVES",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-bransletillsatser",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/Fuel_additives.png"
                            },
                            links: [],
                        },
                        // AdBlue
                        {
                            title: "GROUP_ADBLUE",
                            url: "/catalog/products?collectionSlug=avgassystem-ureainsprutning-urea-amne",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/AdBlue_1.jpg"
                            },
                            links: [],
                        },
                        // Oljetillsatser (Oil Additives)
                        {
                            title: "GROUP_OIL_ADDITIVES",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-oljetillsatser",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/1075_oil_additives.jpg"
                            },
                            links: [],
                        },
                        // Lim (Adhesives and Sealants)
                        {
                            title: "GROUP_ADHESIVES_SEALANTS",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-klister-och-lim",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/963_adhesives_and_sealants.jpg"
                            },
                            links: [],
                        },
                        // Spolarvätska (Windshield Fluid)
                        {
                            title: "GROUP_WINDSHIELD_FLUID",
                            url: "/catalog/products?collectionSlug=kemiska-produkter-oljor-och-vatskor-spolarvatska",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/964_windshield_fluid.jpg"
                            },
                            links: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_CAR_ACCESSORIES",
        url: "/catalog/products?collectionSlug=tillbehor",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        // Elbilsladdning (EV Charging)
                        {
                            title: "GROUP_EV_CHARGING",
                            url: "/catalog/products?collectionSlug=hybrid-eldrift-laddare",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/evwc2t7g_1_1_.jpg"
                            },
                            links: [],
                        },
                        // Mobiltillbehör (Mobile Accessories)
                        {
                            title: "GROUP_MOBILE_ACCESSORIES",
                            url: "/catalog/products?collectionSlug=tillbehor-mobiltelefoni",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/71Qe9M9QfGL.jpg"
                            },
                            links: [],
                        },
                        // Extraljus (Additional Lights)
                        {
                            title: "GROUP_ADDITIONAL_LIGHTS",
                            url: "/catalog/products?collectionSlug=belsyningsignalsystem-extraljus-delar",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/additional_lightning.jpg"
                            },
                            links: [],
                        },
                        // Dragkrok och delar (Towbar Parts)
                        {
                            title: "GROUP_TOWBAR_PARTS",
                            url: "/catalog/products?collectionSlug=draganordning-delar",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/601_towbar_parts.jpg"
                            },
                            links: [],
                        },
                        // Bilmattor (Floor Mats)
                        {
                            title: "GROUP_FLOOR_MATS",
                            url: "/catalog/products?collectionSlug=tillbehor-bilmattor",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/968_floor_mats.jpg"
                            },
                            links: [],
                        },
                        // Bagagerumsmatta (Trunk Mats)
                        {
                            title: "GROUP_TRUNK_MATS",
                            url: "/catalog/products?collectionSlug=tillbehor-bagageskydd",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1054_trunk_mats.jpg"
                            },
                            links: [],
                        },
                        // Vintertillbehör (Winter Products)
                        {
                            title: "GROUP_WINTER_PRODUCTS",
                            url: "/catalog/products?collectionSlug=tillbehor-vintertillbehor",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/976_winter_products.jpg"
                            },
                            links: [],
                        },
                        // Snökedjor och snöstrumpor (Snow Chains)
                        {
                            title: "GROUP_SNOW_CHAINS",
                            url: "/catalog/products?collectionSlug=tillbehor-snokedjor-och-snostrumpor",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1019_snow_chains_and_socks.jpg"
                            },
                            links: [],
                        },
                        // Batteriladdare (Battery Chargers)
                        {
                            title: "GROUP_BATTERY_CHARGERS",
                            url: "/catalog/products?collectionSlug=tillbehor-batteriladdare",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/975_battery_chargers.jpg"
                            },
                            links: [],
                        },
                        // Hjälpstartare (Jump Starters)
                        {
                            title: "GROUP_JUMP_STARTERS",
                            url: "/catalog/products?collectionSlug=tillbehor-hjalpstartare",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/987_jump_starters.jpg"
                            },
                            links: [],
                        },
                        // Startkablar (Jump Start Cables)
                        {
                            title: "GROUP_JUMP_CABLES",
                            url: "/catalog/products?collectionSlug=tillbehor-startkablar",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/jump_start_cables.png"
                            },
                            links: [],
                        },
                        // Parkeringssensorer (Parking Sensors)
                        {
                            title: "GROUP_PARKING_SENSORS",
                            url: "/catalog/products?collectionSlug=tillbehor-parkeringssensorer",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1014_universal_parking_sensors.jpg"
                            },
                            links: [],
                        },
                        // Backkamera (Reversing Camera)
                        {
                            title: "GROUP_REVERSING_CAMERAS",
                            url: "/catalog/products?collectionSlug=tillbehor-backkamera",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1015_reversing_cameras.jpg"
                            },
                            links: [],
                        },
                        // Takräcken (Roof Bars)
                        {
                            title: "GROUP_ROOF_BARS",
                            url: "/catalog/products?collectionSlug=lastsystem-takracken-och-tillbehor",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1079_roof_bars_and_accessories.jpg"
                            },
                            links: [],
                        },
                        // Cykelhållare (Bike Carriers)
                        {
                            title: "GROUP_BIKE_CARRIERS",
                            url: "/catalog/products?collectionSlug=lastsystem-cykelhallare",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/979_bike_carriers.jpg"
                            },
                            links: [],
                        },
                        // Färdkameror (Dash Cameras)
                        {
                            title: "GROUP_DASH_CAMERAS",
                            url: "/catalog/products?collectionSlug=tillbehor-fardkamera",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1103_dash_cameras.jpg"
                            },
                            links: [],
                        },
                        // Växelriktare (Inverters)
                        {
                            title: "GROUP_INVERTERS",
                            url: "/catalog/products?collectionSlug=tillbehor-vaxelriktare",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1105_inverters.jpg"
                            },
                            links: [],
                        },
                        // Överdrag till fordon (Car Covers)
                        {
                            title: "GROUP_CAR_COVERS",
                            url: "/catalog/products?collectionSlug=tillbehor-overdrag-till-fordon",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/car_cover.jpg"
                            },
                            links: [],
                        },
                        // Navkapslar (Wheel Trims)
                        {
                            title: "GROUP_WHEEL_TRIMS",
                            url: "/catalog/products?collectionSlug=tillbehor-navkapslar",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/983_wheel_trims.jpg"
                            },
                            links: [],
                        },
                        // Batterier (Batteries)
                        {
                            title: "GROUP_BATTERIES",
                            url: "/catalog/products?collectionSlug=elsystem-batteri",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/123batt.jpeg"
                            },
                            links: [],
                        },
                        // Annan utrustning (Other Equipment)
                        {
                            title: "GROUP_OTHER_EQUIPMENT",
                            url: "/catalog/products?collectionSlug=tillbehor-annan-utrustning",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/985_other_equipment.jpg"
                            },
                            links: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: "MENU_TOOLS",
        url: "/catalog/products?collectionSlug=verktyg",
        submenu: {
            type: "megamenu",
            size: "nl",
            columns: [
                {
                    size: 12,
                    links: [
                        // Handverktyg (Hand Tools)
                        {
                            title: "GROUP_HAND_TOOLS",
                            url: "/catalog/products?collectionSlug=verktyg-handverktyg",
                            customFields: {
                                image: "/images/megamenu/verktyg/1041_hand_tools.jpg"
                            },
                            links: [],
                        },
                        // Bil service verktyg (Vehicle Service Tools)
                        {
                            title: "GROUP_VEHICLE_SERVICE_TOOLS",
                            url: "/catalog/products?collectionSlug=specialverktyg",
                            customFields: {
                                image: "/images/megamenu/verktyg/1033_vehicle_service_tools.jpg"
                            },
                            links: [],
                        },
                        // Elverktyg (Electric Tools)
                        {
                            title: "GROUP_ELECTRIC_TOOLS",
                            url: "/catalog/products?collectionSlug=verktyg-elverktyg",
                            customFields: {
                                image: "/images/megamenu/verktyg/1035_electric_tools.jpg"
                            },
                            links: [],
                        },
                        // Sladdlösa verktyg (Cordless Tools)
                        {
                            title: "GROUP_CORDLESS_TOOLS",
                            url: "/catalog/products?collectionSlug=verktyg-sladdlosa-verktyg",
                            customFields: {
                                image: "/images/megamenu/verktyg/2606-22ct.jpg"
                            },
                            links: [],
                        },
                        // Pneumatiska verktyg (Pneumatic Tools)
                        {
                            title: "GROUP_PNEUMATIC_TOOLS",
                            url: "/catalog/products?collectionSlug=verktyg-tryckluftverktyg",
                            customFields: {
                                image: "/images/megamenu/verktyg/1055_pneumatic_tools.jpg"
                            },
                            links: [],
                        },
                    ],
                },
            ],
        },
    },
];

export default dataHeaderCategoryMenu;
