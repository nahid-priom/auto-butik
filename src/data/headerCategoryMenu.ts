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
                            url: "/catalog/products?category=brake-system",
                            customFields: {
                                image: "/images/megamenu/subcategories/252_brake_system.jpg"
                            },
                            links: [
                                { title: "LINK_BRAKE_DISCS", url: "/catalog/products?category=brake-discs", customFields: { image: "/images/megamenu/subcategories/269_brake_discs.jpg" } },
                                { title: "LINK_BRAKE_PADS", url: "/catalog/products?category=brake-pads", customFields: { image: "/images/megamenu/subcategories/268_brake_pads.jpg" } },
                                { title: "LINK_BRAKE_CALIPER", url: "/catalog/products?category=brake-calipers", customFields: { image: "/images/megamenu/subcategories/257_brake_calipers.jpg" } },
                                { title: "LINK_BRAKE_ACCESSORIES", url: "/catalog/products?category=brake-accessories", customFields: { image: "/images/megamenu/subcategories/270_brake_parts_accessories.jpg" } },
                                { title: "LINK_WEAR_INDICATORS", url: "/catalog/products?category=wear-indicators", customFields: { image: "/images/megamenu/subcategories/281_wear_indicator_brake_pads.jpg" } },
                                { title: "LINK_BRAKE_CALIPER_REPAIR", url: "/catalog/products?category=brake-caliper-repair", customFields: { image: "/images/megamenu/subcategories/256_brake_caliper_parts.jpg" } },
                                { title: "LINK_HAND_BRAKES", url: "/catalog/products?category=handbrake", customFields: { image: "/images/megamenu/subcategories/260_handbrake.jpg" } },
                                { title: "LINK_BRAKE_DRUMS", url: "/catalog/products?category=brake-drums", customFields: { image: "/images/megamenu/subcategories/274_brake_drums.jpg" } },
                                { title: "LINK_BRAKE_SHOES", url: "/catalog/products?category=brake-shoes", customFields: { image: "/images/megamenu/subcategories/273_brake_lining_shoe.jpg" } },
                                { title: "LINK_WHEEL_CYLINDERS", url: "/catalog/products?category=wheel-cylinders", customFields: { image: "/images/megamenu/subcategories/279_wheel_cylinders.jpg" } },
                                { title: "LINK_DRUM_BRAKE_PARTS", url: "/catalog/products?category=drum-brake-parts", customFields: { image: "/images/megamenu/subcategories/276_drum_brake_parts.jpg" } },
                                { title: "LINK_ABS_PARTS", url: "/catalog/products?category=abs-parts", customFields: { image: "/images/megamenu/subcategories/264_abs_parts.jpg" } },
                                { title: "LINK_BRAKE_MASTER_CYLINDER", url: "/catalog/products?category=brake-master-cylinder", customFields: { image: "/images/megamenu/subcategories/254_brake_master_cylinder.jpg" } },
                                { title: "LINK_BRAKE_HOSES", url: "/catalog/products?category=brake-hoses", customFields: { image: "/images/megamenu/subcategories/261_brake_hoses.jpg" } },
                                { title: "LINK_PARKING_BRAKE_CABLES", url: "/catalog/products?category=parking-brake-cables", customFields: { image: "/images/megamenu/subcategories/282_control_levers_cables.jpg" } },
                                { title: "LINK_BRAKE_LINE_FITTINGS", url: "/catalog/products?category=brake-line-fittings", customFields: { image: "/images/megamenu/subcategories/1102_brake_line_fittings.jpg" } },
                                { title: "LINK_BRAKE_BOOSTER", url: "/catalog/products?category=brake-booster", customFields: { image: "/images/megamenu/subcategories/253_brake_booster.jpg" } },
                                { title: "LINK_BRAKE_POWER_REGULATOR", url: "/catalog/products?category=brake-power-regulator", customFields: { image: "/images/megamenu/subcategories/263_brake_power_regulator.jpg" } },
                            ],
                        },
                        // Filter
                        {
                            title: "GROUP_FILTERS",
                            url: "/catalog/products?category=filters",
                            customFields: {
                                image: "/images/megamenu/subcategories/241_filters.jpg"
                            },
                            links: [
                                { title: "LINK_OIL_FILTERS", url: "/catalog/products?category=oil-filters", customFields: { image: "/images/megamenu/subcategories/242_oil_filters.jpg" } },
                                { title: "LINK_AIR_FILTERS", url: "/catalog/products?category=air-filters", customFields: { image: "/images/megamenu/subcategories/243_air_filters.jpg" } },
                                { title: "LINK_FUEL_FILTERS", url: "/catalog/products?category=fuel-filters", customFields: { image: "/images/megamenu/subcategories/244_fuel_filters.jpg" } },
                                { title: "LINK_HYDRAULIC_FILTERS", url: "/catalog/products?category=hydraulic-filters", customFields: { image: "/images/megamenu/subcategories/245_hydraulic_filters.jpg" } },
                                { title: "LINK_CABIN_FILTERS", url: "/catalog/products?category=cabin-filters", customFields: { image: "/images/megamenu/subcategories/246_pollen_filters.jpg" } },
                                { title: "LINK_COOLANT_FILTERS", url: "/catalog/products?category=coolant-filters", customFields: { image: "/images/megamenu/subcategories/247_coolant_filters.jpg" } },
                                { title: "LINK_FILTER_SETS", url: "/catalog/products?category=filter-sets", customFields: { image: "/images/megamenu/subcategories/248_filter_sets.jpg" } },
                                { title: "LINK_POWER_STEERING_FILTERS", url: "/catalog/products?category=power-steering-filters", customFields: { image: "/images/megamenu/subcategories/685_filter_power_steering.jpg" } },
                            ],
                        },
                        // Dämpare och fjädrar (Suspension)
                        {
                            title: "GROUP_SUSPENSION",
                            url: "/catalog/products?category=suspension",
                            customFields: {
                                image: "/images/megamenu/subcategories/663_suspension.jpg"
                            },
                            links: [
                                { title: "LINK_SHOCK_ABSORBERS", url: "/catalog/products?category=shock-absorbers", customFields: { image: "/images/megamenu/subcategories/665_shock_absorbers.jpg" } },
                                { title: "LINK_COIL_SPRINGS", url: "/catalog/products?category=coil-springs", customFields: { image: "/images/megamenu/subcategories/664_coil_springs.jpg" } },
                                { title: "LINK_BALL_JOINTS", url: "/catalog/products?category=ball-joints", customFields: { image: "/images/megamenu/subcategories/723_ball_joint.jpg" } },
                                { title: "LINK_CONTROL_ARMS", url: "/catalog/products?category=control-arms", customFields: { image: "/images/megamenu/subcategories/713_steering_links_control_arm_trailing_link_diagonal_arm.jpg" } },
                                { title: "LINK_STABILIZER", url: "/catalog/products?category=stabilizer", customFields: { image: "/images/megamenu/subcategories/717_stabilizer.jpg" } },
                                { title: "LINK_WHEEL_BEARINGS", url: "/catalog/products?category=wheel-bearings", customFields: { image: "/images/megamenu/subcategories/wheel_bearing.jpg" } },
                                { title: "LINK_WHEEL_HUBS", url: "/catalog/products?category=wheel-hubs", customFields: { image: "/images/megamenu/subcategories/702_wheel_hub.jpg" } },
                                { title: "LINK_STRUT_MOUNTS", url: "/catalog/products?category=strut-mounts", customFields: { image: "/images/megamenu/subcategories/668_suspension_strut_bearing.jpg" } },
                                { title: "LINK_STRUT_BOOTS", url: "/catalog/products?category=strut-boots", customFields: { image: "/images/megamenu/subcategories/Strut_boots.jpg" } },
                                { title: "LINK_WHEEL_NUTS_BOLTS", url: "/catalog/products?category=wheel-nuts-bolts", customFields: { image: "/images/megamenu/subcategories/738_wheel_nuts_bolts___studs.jpg" } },
                                { title: "LINK_AXLE_BEAM", url: "/catalog/products?category=axle-beam", customFields: { image: "/images/megamenu/subcategories/726_axle_beam.jpg" } },
                                { title: "LINK_AIR_SUSPENSION", url: "/catalog/products?category=air-suspension", customFields: { image: "/images/megamenu/subcategories/674_pneumatic_suspension.jpg" } },
                            ],
                        },
                        // Styrning (Steering)
                        {
                            title: "GROUP_STEERING",
                            url: "/catalog/products?category=steering",
                            customFields: {
                                image: "/images/megamenu/subcategories/676_steering.jpg"
                            },
                            links: [
                                { title: "LINK_TIE_RODS", url: "/catalog/products?category=tie-rods", customFields: { image: "/images/megamenu/subcategories/677_tie_rod.jpg" } },
                                { title: "LINK_TIE_ROD_ENDS", url: "/catalog/products?category=tie-rod-ends", customFields: { image: "/images/megamenu/subcategories/690_tie_rod_assembly.jpg" } },
                                { title: "LINK_POWER_STEERING_PUMPS", url: "/catalog/products?category=power-steering-pumps", customFields: { image: "/images/megamenu/subcategories/678_steering_pump.jpg" } },
                                { title: "LINK_STEERING_RACKS", url: "/catalog/products?category=steering-racks", customFields: { image: "/images/megamenu/subcategories/986_steering_gear.jpg" } },
                                { title: "LINK_STEERING_COLUMN", url: "/catalog/products?category=steering-column", customFields: { image: "/images/megamenu/subcategories/681_steering_column.jpg" } },
                                { title: "LINK_STEERING_DAMPER", url: "/catalog/products?category=steering-damper", customFields: { image: "/images/megamenu/subcategories/679_steering_damper.jpg" } },
                                { title: "LINK_STEERING_BOOTS", url: "/catalog/products?category=steering-boots", customFields: { image: "/images/megamenu/subcategories/680_bellowseal.jpg" } },
                                { title: "LINK_STEERING_HOSES", url: "/catalog/products?category=steering-hoses", customFields: { image: "/images/megamenu/subcategories/686_steering_hose_pipe.jpg" } },
                                { title: "LINK_STEERING_LINKAGE", url: "/catalog/products?category=steering-linkage", customFields: { image: "/images/megamenu/subcategories/688_steering_linkage.jpg" } },
                                { title: "LINK_STEERING_RESERVOIR", url: "/catalog/products?category=steering-reservoir", customFields: { image: "/images/megamenu/subcategories/693_hydraulic_oil_expansion_tank.jpg" } },
                            ],
                        },
                        // Vindrutetorkar system (Windscreen Wipers)
                        {
                            title: "GROUP_WIPERS",
                            url: "/catalog/products?category=wipers",
                            customFields: {
                                image: "/images/megamenu/subcategories/606_windscreen_cleaning_system.jpg"
                            },
                            links: [
                                { title: "LINK_WIPER_BLADES", url: "/catalog/products?category=wiper-blades", customFields: { image: "/images/megamenu/subcategories/607_windscreen_wipers.jpg" } },
                                { title: "LINK_WIPER_MOTORS", url: "/catalog/products?category=wiper-motors", customFields: { image: "/images/megamenu/subcategories/608_motor_windscreen_wipers.jpg" } },
                                { title: "LINK_WASHER_PUMPS", url: "/catalog/products?category=washer-pumps", customFields: { image: "/images/megamenu/subcategories/609_water_pump_windscreen_washing.jpg" } },
                                { title: "LINK_WIPER_LINKAGE", url: "/catalog/products?category=wiper-linkage", customFields: { image: "/images/megamenu/subcategories/611_wiper_linkage_drive.jpg" } },
                                { title: "LINK_WASHER_RESERVOIR", url: "/catalog/products?category=washer-reservoir", customFields: { image: "/images/megamenu/subcategories/612_water_tank_pipe_windscreen.jpg" } },
                                { title: "LINK_WASHER_JETS", url: "/catalog/products?category=washer-jets", customFields: { image: "/images/megamenu/subcategories/613_washer_fluid_jet.jpg" } },
                                { title: "LINK_HEADLIGHT_WASHER", url: "/catalog/products?category=headlight-washer", customFields: { image: "/images/megamenu/subcategories/955_headlight_washer_system.jpg" } },
                            ],
                        },
                        // Motordelar (Engine Parts)
                        {
                            title: "GROUP_ENGINE_PARTS",
                            url: "/catalog/products?category=engine-parts",
                            customFields: {
                                image: "/images/megamenu/subcategories/4_engine.jpg"
                            },
                            links: [
                                { title: "LINK_TIMING_BELT_KITS", url: "/catalog/products?category=timing-belt-kits", customFields: { image: "/images/megamenu/subcategories/185_timing_belt_set.jpg" } },
                                { title: "LINK_TIMING_CHAIN_KITS", url: "/catalog/products?category=timing-chain-kits", customFields: { image: "/images/megamenu/subcategories/25_timing_chain_set.jpg" } },
                                { title: "LINK_TURBOCHARGERS", url: "/catalog/products?category=turbochargers", customFields: { image: "/images/megamenu/subcategories/227_turbocharger.jpg" } },
                                { title: "LINK_ENGINE_MOUNTS", url: "/catalog/products?category=engine-mounts", customFields: { image: "/images/megamenu/subcategories/135_engine_mounting_bracket.jpg" } },
                                { title: "LINK_INTAKE_MANIFOLD", url: "/catalog/products?category=intake-manifold", customFields: { image: "/images/megamenu/subcategories/86_intake_manifold.jpg" } },
                                { title: "LINK_DRIVE_BELTS", url: "/catalog/products?category=drive-belts", customFields: { image: "/images/megamenu/subcategories/171_vbelt_set.jpg" } },
                                { title: "LINK_TENSIONERS_PULLEYS", url: "/catalog/products?category=tensioners-pulleys", customFields: { image: "/images/megamenu/subcategories/10036_tensioners_pulleys_and_dampers.png" } },
                                { title: "LINK_CYLINDER_HEAD", url: "/catalog/products?category=cylinder-head", customFields: { image: "/images/megamenu/subcategories/72_cylinder_head_parts.jpg" } },
                                { title: "LINK_CRANKSHAFT_PARTS", url: "/catalog/products?category=crankshaft-parts", customFields: { image: "/images/megamenu/subcategories/110_crankshaft_drive.jpg" } },
                                { title: "LINK_ENGINE_GASKETS", url: "/catalog/products?category=engine-gaskets", customFields: { image: "/images/megamenu/subcategories/10051_engine_gaskets_and_seals.png" } },
                                { title: "LINK_THROTTLE_BODY", url: "/catalog/products?category=throttle-body", customFields: { image: "/images/megamenu/subcategories/98_throttle_sensor.jpg" } },
                                { title: "LINK_LUBRICATION", url: "/catalog/products?category=lubrication", customFields: { image: "/images/megamenu/subcategories/47_lubrication.jpg" } },
                            ],
                        },
                        // Bränslesystem (Fuel System)
                        {
                            title: "GROUP_FUEL_SYSTEM",
                            url: "/catalog/products?category=fuel-system",
                            customFields: {
                                image: "/images/megamenu/subcategories/740_fuel_system.jpg"
                            },
                            links: [
                                { title: "LINK_FUEL_PUMPS", url: "/catalog/products?category=fuel-pumps", customFields: { image: "/images/megamenu/subcategories/744_fuel_pump.jpg" } },
                                { title: "LINK_FUEL_INJECTORS", url: "/catalog/products?category=fuel-injectors", customFields: { image: "/images/megamenu/subcategories/787_injector_valvenozzlenozzle_holderui.jpg" } },
                                { title: "LINK_FUEL_PRESSURE_REGULATOR", url: "/catalog/products?category=fuel-pressure-regulator", customFields: { image: "/images/megamenu/subcategories/753_fuel_pressure_regulator_switch.jpg" } },
                                { title: "LINK_FUEL_TANK_PARTS", url: "/catalog/products?category=fuel-tank-parts", customFields: { image: "/images/megamenu/subcategories/Fuel_Tank_Parts.jpg" } },
                                { title: "LINK_FUEL_LINES", url: "/catalog/products?category=fuel-lines", customFields: { image: "/images/megamenu/subcategories/792_fuel_line_distributionallocation.jpg" } },
                                { title: "LINK_HIGH_PRESSURE_PUMP", url: "/catalog/products?category=high-pressure-pump", customFields: { image: "/images/megamenu/subcategories/791_fuel_injection_pumphigh_pressure_pump.jpg" } },
                                { title: "LINK_FUEL_SENSORS", url: "/catalog/products?category=fuel-sensors", customFields: { image: "/images/megamenu/subcategories/235_sensor.jpg" } },
                                { title: "LINK_FUEL_GAUGES", url: "/catalog/products?category=fuel-gauges", customFields: { image: "/images/megamenu/subcategories/352_gauges.jpg" } },
                            ],
                        },
                        // Avgassystem (Exhaust System)
                        {
                            title: "GROUP_EXHAUST_SYSTEM",
                            url: "/catalog/products?category=exhaust-system",
                            customFields: {
                                image: "/images/megamenu/subcategories/198_exhaust_system.jpg"
                            },
                            links: [
                                { title: "LINK_CATALYTIC_CONVERTERS", url: "/catalog/products?category=catalytic-converters", customFields: { image: "/images/megamenu/subcategories/200_catalytic_converter.jpg" } },
                                { title: "LINK_MUFFLERS", url: "/catalog/products?category=mufflers", customFields: { image: "/images/megamenu/subcategories/221_silencer.jpg" } },
                                { title: "LINK_EXHAUST_PIPES", url: "/catalog/products?category=exhaust-pipes", customFields: { image: "/images/megamenu/subcategories/222_exhaust_pipes.jpg" } },
                                { title: "LINK_EXHAUST_MANIFOLD", url: "/catalog/products?category=exhaust-manifold", customFields: { image: "/images/megamenu/subcategories/226_manifold.jpg" } },
                                { title: "LINK_DPF_FILTER", url: "/catalog/products?category=dpf-filter", customFields: { image: "/images/megamenu/subcategories/223_sootparticulate_filter.jpg" } },
                                { title: "LINK_LAMBDA_SENSORS", url: "/catalog/products?category=lambda-sensors", customFields: { image: "/images/megamenu/subcategories/201_lambda_sensor.jpg" } },
                                { title: "LINK_EXHAUST_GASKETS", url: "/catalog/products?category=exhaust-gaskets", customFields: { image: "/images/megamenu/subcategories/207_gasket.jpg" } },
                                { title: "LINK_EGR_VALVE", url: "/catalog/products?category=egr-valve", customFields: { image: "/images/megamenu/subcategories/229_exhaust_gas_door.jpg" } },
                            ],
                        },
                        // Elsystem (Electrical System)
                        {
                            title: "GROUP_ELECTRICAL_SYSTEM",
                            url: "/catalog/products?category=electrical-system",
                            customFields: {
                                image: "/images/megamenu/subcategories/323_electrics.jpg"
                            },
                            links: [
                                { title: "LINK_STARTERS", url: "/catalog/products?category=starters", customFields: { image: "/images/megamenu/subcategories/356_starter.jpg" } },
                                { title: "LINK_ALTERNATORS", url: "/catalog/products?category=alternators", customFields: { image: "/images/megamenu/subcategories/341_alternator.jpg" } },
                                { title: "LINK_IGNITION_COILS", url: "/catalog/products?category=ignition-coils", customFields: { image: "/images/megamenu/subcategories/326_ignition_coil.jpg" } },
                                { title: "LINK_SPARK_PLUGS", url: "/catalog/products?category=spark-plugs", customFields: { image: "/images/megamenu/subcategories/spark_plug_1.jpg" } },
                                { title: "LINK_GLOW_PLUGS", url: "/catalog/products?category=glow-plugs", customFields: { image: "/images/megamenu/subcategories/328_glow_plugs.jpg" } },
                                { title: "LINK_SENSORS", url: "/catalog/products?category=sensors", customFields: { image: "/images/megamenu/subcategories/366_sensors.jpg" } },
                                { title: "LINK_SWITCHES", url: "/catalog/products?category=switches", customFields: { image: "/images/megamenu/subcategories/10035_switches.png" } },
                                { title: "LINK_CONTROL_UNITS", url: "/catalog/products?category=control-units", customFields: { image: "/images/megamenu/subcategories/360_control_units.jpg" } },
                                { title: "LINK_HORN", url: "/catalog/products?category=horn", customFields: { image: "/images/megamenu/subcategories/349_airelectric_horn.jpg" } },
                                { title: "LINK_WIRING_HARNESS", url: "/catalog/products?category=wiring-harness", customFields: { image: "/images/megamenu/subcategories/367_harness.jpg" } },
                            ],
                        },
                        // Kylsystem (Cooling System)
                        {
                            title: "GROUP_COOLING_SYSTEM",
                            url: "/catalog/products?category=cooling-system",
                            customFields: {
                                image: "/images/megamenu/subcategories/296_cooling_system.jpg"
                            },
                            links: [
                                { title: "LINK_WATER_PUMPS", url: "/catalog/products?category=water-pumps", customFields: { image: "/images/megamenu/subcategories/299_water_pump.jpg" } },
                                { title: "LINK_THERMOSTATS", url: "/catalog/products?category=thermostats", customFields: { image: "/images/megamenu/subcategories/303_thermostat.jpg" } },
                                { title: "LINK_RADIATORS", url: "/catalog/products?category=radiators", customFields: { image: "/images/megamenu/subcategories/310_radiator_parts.jpg" } },
                                { title: "LINK_RADIATOR_FANS", url: "/catalog/products?category=radiator-fans", customFields: { image: "/images/megamenu/subcategories/316_radiator_fan.jpg" } },
                                { title: "LINK_COOLANT_HOSES", url: "/catalog/products?category=coolant-hoses", customFields: { image: "/images/megamenu/subcategories/306_radiator_hoses.jpg" } },
                                { title: "LINK_EXPANSION_TANKS", url: "/catalog/products?category=expansion-tanks", customFields: { image: "/images/megamenu/subcategories/314_expansion_tank_engine_coolant.jpg" } },
                                { title: "LINK_INTERCOOLER", url: "/catalog/products?category=intercooler", customFields: { image: "/images/megamenu/subcategories/93_intercooler.jpg" } },
                                { title: "LINK_OIL_COOLER", url: "/catalog/products?category=oil-cooler", customFields: { image: "/images/megamenu/subcategories/313_oil_cooler.jpg" } },
                                { title: "LINK_COOLANT_TEMP_SENSOR", url: "/catalog/products?category=coolant-temp-sensor", customFields: { image: "/images/megamenu/subcategories/315_sender_unit_coolant_temperature.jpg" } },
                            ],
                        },
                        // Luftkonditionering (Air Conditioning)
                        {
                            title: "GROUP_AIR_CONDITIONING",
                            url: "/catalog/products?category=air-conditioning",
                            customFields: {
                                image: "/images/megamenu/subcategories/414_heater.jpg"
                            },
                            links: [
                                { title: "LINK_AC_COMPRESSOR", url: "/catalog/products?category=ac-compressor", customFields: { image: "/images/megamenu/subcategories/425_compressor_parts.jpg" } },
                                { title: "LINK_AC_CONDENSER", url: "/catalog/products?category=ac-condenser", customFields: { image: "/images/megamenu/subcategories/426_condenser.jpg" } },
                                { title: "LINK_AC_EVAPORATOR", url: "/catalog/products?category=ac-evaporator", customFields: { image: "/images/megamenu/subcategories/427_vaporizer.jpg" } },
                                { title: "LINK_AC_DRYER", url: "/catalog/products?category=ac-dryer", customFields: { image: "/images/megamenu/subcategories/428_dryer.jpg" } },
                                { title: "LINK_HEATER_CORE", url: "/catalog/products?category=heater-core", customFields: { image: "/images/megamenu/subcategories/311_heat_exchanger_interior_heating.jpg" } },
                                { title: "LINK_BLOWER_MOTOR", url: "/catalog/products?category=blower-motor", customFields: { image: "/images/megamenu/subcategories/418_blower_parts.jpg" } },
                                { title: "LINK_AC_HOSES", url: "/catalog/products?category=ac-hoses", customFields: { image: "/images/megamenu/subcategories/430_hoses_pipes.jpg" } },
                                { title: "LINK_PARKING_HEATER", url: "/catalog/products?category=parking-heater", customFields: { image: "/images/megamenu/subcategories/371_parking_heater.jpg" } },
                            ],
                        },
                        // Drivlina (Transmission)
                        {
                            title: "GROUP_TRANSMISSION",
                            url: "/catalog/products?category=transmission",
                            customFields: {
                                image: "/images/megamenu/subcategories/814_transmission_and_gearing.jpg"
                            },
                            links: [
                                { title: "LINK_CLUTCH_KITS", url: "/catalog/products?category=clutch-kits", customFields: { image: "/images/megamenu/subcategories/824_repair_kit_clutch_complete.jpg" } },
                                { title: "LINK_CLUTCH_PARTS", url: "/catalog/products?category=clutch-parts", customFields: { image: "/images/megamenu/subcategories/10007_idividual_clutch_parts.png" } },
                                { title: "LINK_FLYWHEEL", url: "/catalog/products?category=flywheel", customFields: { image: "/images/megamenu/subcategories/832_flywheel.jpg" } },
                                { title: "LINK_CV_JOINTS", url: "/catalog/products?category=cv-joints", customFields: { image: "/images/megamenu/subcategories/819_cv_joint__set.jpg" } },
                                { title: "LINK_DRIVE_SHAFTS", url: "/catalog/products?category=drive-shafts", customFields: { image: "/images/megamenu/subcategories/pusass_piedzinasvarpsta.jpg" } },
                                { title: "LINK_PROPSHAFT", url: "/catalog/products?category=propshaft", customFields: { image: "/images/megamenu/subcategories/890_propshaft.jpg" } },
                                { title: "LINK_DIFFERENTIAL", url: "/catalog/products?category=differential", customFields: { image: "/images/megamenu/subcategories/886_differential.jpg" } },
                                { title: "LINK_TRANSMISSION_MOUNTS", url: "/catalog/products?category=transmission-mounts", customFields: { image: "/images/megamenu/subcategories/854_transmission_mounting.jpg" } },
                                { title: "LINK_CLUTCH_MASTER_CYLINDER", url: "/catalog/products?category=clutch-master-cylinder", customFields: { image: "/images/megamenu/subcategories/836_master_cylinder.jpg" } },
                            ],
                        },
                        // Karosseri (Body)
                        {
                            title: "GROUP_BODY",
                            url: "/catalog/products?category=body",
                            customFields: {
                                image: "/images/megamenu/subcategories/443_body.jpg"
                            },
                            links: [
                                { title: "LINK_MIRRORS", url: "/catalog/products?category=mirrors", customFields: { image: "/images/megamenu/subcategories/469_mirrors.jpg" } },
                                { title: "LINK_DOOR_PARTS", url: "/catalog/products?category=door-parts", customFields: { image: "/images/megamenu/subcategories/477_doors_parts.jpg" } },
                                { title: "LINK_DOOR_HANDLES_LOCKS", url: "/catalog/products?category=door-handles-locks", customFields: { image: "/images/megamenu/subcategories/10005_door_handles_and_locks.png" } },
                                { title: "LINK_WINDOW_REGULATORS", url: "/catalog/products?category=window-regulators", customFields: { image: "/images/megamenu/subcategories/622_window_lift.jpg" } },
                                { title: "LINK_GAS_STRUTS", url: "/catalog/products?category=gas-struts", customFields: { image: "/images/megamenu/subcategories/483_gas_springs.jpg" } },
                                { title: "LINK_BUMPER_PARTS", url: "/catalog/products?category=bumper-parts", customFields: { image: "/images/megamenu/subcategories/460_bumper_parts.jpg" } },
                                { title: "LINK_GRILLES", url: "/catalog/products?category=grilles", customFields: { image: "/images/megamenu/subcategories/461_front_fairing_grille.jpg" } },
                                { title: "LINK_FENDERS", url: "/catalog/products?category=fenders", customFields: { image: "/images/megamenu/subcategories/Wing.jpg" } },
                                { title: "LINK_HOOD_PARTS", url: "/catalog/products?category=hood-parts", customFields: { image: "/images/megamenu/subcategories/492_bonnet_parts_silencing_material.jpg" } },
                                { title: "LINK_INTERIOR_PARTS", url: "/catalog/products?category=interior-parts", customFields: { image: "/images/megamenu/subcategories/10006_interior_parts.png" } },
                            ],
                        },
                        // Utvändig belysning (External Lighting)
                        {
                            title: "GROUP_LIGHTING",
                            url: "/catalog/products?category=lighting",
                            customFields: {
                                image: "/images/megamenu/subcategories/lightning.jpg"
                            },
                            links: [
                                { title: "LINK_HEADLIGHTS", url: "/catalog/products?category=headlights", customFields: { image: "/images/megamenu/subcategories/951_headlights.jpg" } },
                                { title: "LINK_TAIL_LIGHTS", url: "/catalog/products?category=tail-lights", customFields: { image: "/images/megamenu/subcategories/combination_rearlight.jpg" } },
                                { title: "LINK_FOG_LIGHTS", url: "/catalog/products?category=fog-lights", customFields: { image: "/images/megamenu/subcategories/fog_light-insert.jpg" } },
                                { title: "LINK_TURN_SIGNALS", url: "/catalog/products?category=turn-signals", customFields: { image: "/images/megamenu/subcategories/926_indicator.jpg" } },
                                { title: "LINK_LICENSE_PLATE_LIGHTS", url: "/catalog/products?category=license-plate-lights", customFields: { image: "/images/megamenu/subcategories/931_licence_plate_light.jpg" } },
                                { title: "LINK_REVERSE_LIGHTS", url: "/catalog/products?category=reverse-lights", customFields: { image: "/images/megamenu/subcategories/939_reverse_light.jpg" } },
                                { title: "LINK_BRAKE_LIGHTS", url: "/catalog/products?category=brake-lights", customFields: { image: "/images/megamenu/subcategories/921_auxiliary_stop_light.jpg" } },
                                { title: "LINK_CAR_BULBS", url: "/catalog/products?category=car-bulbs", customFields: { image: "/images/megamenu/subcategories/1074_car_bulbs.jpg" } },
                                { title: "LINK_LED_KITS", url: "/catalog/products?category=led-kits", customFields: { image: "/images/megamenu/subcategories/LED_Conversion_Kits_1.png" } },
                                { title: "LINK_DRL", url: "/catalog/products?category=drl", customFields: { image: "/images/megamenu/subcategories/DRL_dedicated.png" } },
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
                    size: 12,
                    links: [
                        // Motorolja (Engine Oil)
                        {
                            title: "GROUP_ENGINE_OIL",
                            url: "/catalog/products?category=engine-oil",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/957_engine_oil.jpg"
                            },
                            links: [],
                        },
                        // Bilvård (Car Care/Detailing)
                        {
                            title: "GROUP_CAR_CARE",
                            url: "/catalog/products?category=car-care",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/1114_car_detailing.jpg"
                            },
                            links: [],
                        },
                        // Växellådsolja (Transmission Oil)
                        {
                            title: "GROUP_TRANSMISSION_OIL",
                            url: "/catalog/products?category=transmission-oil",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/958_transmission_oil.jpg"
                            },
                            links: [],
                        },
                        // Hydraulolja (Hydraulic Oil)
                        {
                            title: "GROUP_HYDRAULIC_OIL",
                            url: "/catalog/products?category=hydraulic-oil",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/873_oil.jpg"
                            },
                            links: [],
                        },
                        // Smörjmedel (Lubricants)
                        {
                            title: "GROUP_LUBRICANTS",
                            url: "/catalog/products?category=lubricants",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/959_lubricants.jpg"
                            },
                            links: [],
                        },
                        // Bromsvätska (Brake Fluid)
                        {
                            title: "GROUP_BRAKE_FLUID",
                            url: "/catalog/products?category=brake-fluid",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/960_brake_fluid.jpg"
                            },
                            links: [],
                        },
                        // Servostyrningsolja (Power Steering Oil)
                        {
                            title: "GROUP_POWER_STEERING_OIL",
                            url: "/catalog/products?category=power-steering-oil",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/1110_power_steering_oil.jpg"
                            },
                            links: [],
                        },
                        // Kylarvätska (Coolant)
                        {
                            title: "GROUP_COOLANT",
                            url: "/catalog/products?category=coolant",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/961_coolant.jpg"
                            },
                            links: [],
                        },
                        // Bränsletillsatser (Fuel Additives)
                        {
                            title: "GROUP_FUEL_ADDITIVES",
                            url: "/catalog/products?category=fuel-additives",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/Fuel_additives.png"
                            },
                            links: [],
                        },
                        // AdBlue
                        {
                            title: "GROUP_ADBLUE",
                            url: "/catalog/products?category=adblue",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/AdBlue_1.jpg"
                            },
                            links: [],
                        },
                        // Oljetillsatser (Oil Additives)
                        {
                            title: "GROUP_OIL_ADDITIVES",
                            url: "/catalog/products?category=oil-additives",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/1075_oil_additives.jpg"
                            },
                            links: [],
                        },
                        // Lim (Adhesives and Sealants)
                        {
                            title: "GROUP_ADHESIVES_SEALANTS",
                            url: "/catalog/products?category=adhesives-sealants",
                            customFields: {
                                image: "/images/megamenu/oils-bilvard/963_adhesives_and_sealants.jpg"
                            },
                            links: [],
                        },
                        // Spolarvätska (Windshield Fluid)
                        {
                            title: "GROUP_WINDSHIELD_FLUID",
                            url: "/catalog/products?category=windshield-fluid",
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
        url: "/catalog/products?category=accessories",
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
                            url: "/catalog/products?category=ev-charging",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/evwc2t7g_1_1_.jpg"
                            },
                            links: [],
                        },
                        // Mobiltillbehör (Mobile Accessories)
                        {
                            title: "GROUP_MOBILE_ACCESSORIES",
                            url: "/catalog/products?category=mobile-accessories",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/71Qe9M9QfGL.jpg"
                            },
                            links: [],
                        },
                        // Extraljus (Additional Lights)
                        {
                            title: "GROUP_ADDITIONAL_LIGHTS",
                            url: "/catalog/products?category=additional-lights",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/additional_lightning.jpg"
                            },
                            links: [],
                        },
                        // Dragkrok och delar (Towbar Parts)
                        {
                            title: "GROUP_TOWBAR_PARTS",
                            url: "/catalog/products?category=towbar-parts",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/601_towbar_parts.jpg"
                            },
                            links: [],
                        },
                        // Bilmattor (Floor Mats)
                        {
                            title: "GROUP_FLOOR_MATS",
                            url: "/catalog/products?category=floor-mats",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/968_floor_mats.jpg"
                            },
                            links: [],
                        },
                        // Bagagerumsmatta (Trunk Mats)
                        {
                            title: "GROUP_TRUNK_MATS",
                            url: "/catalog/products?category=trunk-mats",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1054_trunk_mats.jpg"
                            },
                            links: [],
                        },
                        // Vintertillbehör (Winter Products)
                        {
                            title: "GROUP_WINTER_PRODUCTS",
                            url: "/catalog/products?category=winter-products",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/976_winter_products.jpg"
                            },
                            links: [],
                        },
                        // Snökedjor och snöstrumpor (Snow Chains)
                        {
                            title: "GROUP_SNOW_CHAINS",
                            url: "/catalog/products?category=snow-chains",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1019_snow_chains_and_socks.jpg"
                            },
                            links: [],
                        },
                        // Batteriladdare (Battery Chargers)
                        {
                            title: "GROUP_BATTERY_CHARGERS",
                            url: "/catalog/products?category=battery-chargers",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/975_battery_chargers.jpg"
                            },
                            links: [],
                        },
                        // Hjälpstartare (Jump Starters)
                        {
                            title: "GROUP_JUMP_STARTERS",
                            url: "/catalog/products?category=jump-starters",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/987_jump_starters.jpg"
                            },
                            links: [],
                        },
                        // Startkablar (Jump Start Cables)
                        {
                            title: "GROUP_JUMP_CABLES",
                            url: "/catalog/products?category=jump-cables",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/jump_start_cables.png"
                            },
                            links: [],
                        },
                        // Parkeringssensorer (Parking Sensors)
                        {
                            title: "GROUP_PARKING_SENSORS",
                            url: "/catalog/products?category=parking-sensors",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1014_universal_parking_sensors.jpg"
                            },
                            links: [],
                        },
                        // Backkamera (Reversing Camera)
                        {
                            title: "GROUP_REVERSING_CAMERAS",
                            url: "/catalog/products?category=reversing-cameras",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1015_reversing_cameras.jpg"
                            },
                            links: [],
                        },
                        // Takräcken (Roof Bars)
                        {
                            title: "GROUP_ROOF_BARS",
                            url: "/catalog/products?category=roof-bars",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1079_roof_bars_and_accessories.jpg"
                            },
                            links: [],
                        },
                        // Cykelhållare (Bike Carriers)
                        {
                            title: "GROUP_BIKE_CARRIERS",
                            url: "/catalog/products?category=bike-carriers",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/979_bike_carriers.jpg"
                            },
                            links: [],
                        },
                        // Färdkameror (Dash Cameras)
                        {
                            title: "GROUP_DASH_CAMERAS",
                            url: "/catalog/products?category=dash-cameras",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1103_dash_cameras.jpg"
                            },
                            links: [],
                        },
                        // Växelriktare (Inverters)
                        {
                            title: "GROUP_INVERTERS",
                            url: "/catalog/products?category=inverters",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/1105_inverters.jpg"
                            },
                            links: [],
                        },
                        // Överdrag till fordon (Car Covers)
                        {
                            title: "GROUP_CAR_COVERS",
                            url: "/catalog/products?category=car-covers",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/car_cover.jpg"
                            },
                            links: [],
                        },
                        // Navkapslar (Wheel Trims)
                        {
                            title: "GROUP_WHEEL_TRIMS",
                            url: "/catalog/products?category=wheel-trims",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/983_wheel_trims.jpg"
                            },
                            links: [],
                        },
                        // Batterier (Batteries)
                        {
                            title: "GROUP_BATTERIES",
                            url: "/catalog/products?category=batteries",
                            customFields: {
                                image: "/images/megamenu/biltillbehor/123batt.jpeg"
                            },
                            links: [],
                        },
                        // Annan utrustning (Other Equipment)
                        {
                            title: "GROUP_OTHER_EQUIPMENT",
                            url: "/catalog/products?category=other-equipment",
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
        url: "/catalog/products?category=tools",
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
                            url: "/catalog/products?category=hand-tools",
                            customFields: {
                                image: "/images/megamenu/verktyg/1041_hand_tools.jpg"
                            },
                            links: [],
                        },
                        // Bil service verktyg (Vehicle Service Tools)
                        {
                            title: "GROUP_VEHICLE_SERVICE_TOOLS",
                            url: "/catalog/products?category=vehicle-service-tools",
                            customFields: {
                                image: "/images/megamenu/verktyg/1033_vehicle_service_tools.jpg"
                            },
                            links: [],
                        },
                        // Elverktyg (Electric Tools)
                        {
                            title: "GROUP_ELECTRIC_TOOLS",
                            url: "/catalog/products?category=electric-tools",
                            customFields: {
                                image: "/images/megamenu/verktyg/1035_electric_tools.jpg"
                            },
                            links: [],
                        },
                        // Sladdlösa verktyg (Cordless Tools)
                        {
                            title: "GROUP_CORDLESS_TOOLS",
                            url: "/catalog/products?category=cordless-tools",
                            customFields: {
                                image: "/images/megamenu/verktyg/2606-22ct.jpg"
                            },
                            links: [],
                        },
                        // Pneumatiska verktyg (Pneumatic Tools)
                        {
                            title: "GROUP_PNEUMATIC_TOOLS",
                            url: "/catalog/products?category=pneumatic-tools",
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
