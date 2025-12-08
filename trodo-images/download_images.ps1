# Trodo Category Images Download Script
# This script downloads all category images from the trodo.se megamenu

$outputDir = "E:\Fiverr Works\Autobutik\Autobutik-frontend\trodo-images\subcategories"
$bannerDir = "E:\Fiverr Works\Autobutik\Autobutik-frontend\trodo-images\banners"

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
New-Item -ItemType Directory -Force -Path $bannerDir | Out-Null

# Banner Images
$bannerUrls = @(
    "https://picdn.trodo.com/media/catalog/category/banner/252_brake_system.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/241_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/662_suspension_and_steering.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/4_engine.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/740_fuel_system.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/198_exhaust_system.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/198_exhaust_system_1.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/323_electrics.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/296_cooling_system.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/414_heater.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/443_body.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/3_car_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/814_transmission_and_gearing.jpg",
    "https://picdn.trodo.com/media/catalog/category/banner/895_lighting.jpg"
)

# Subcategory Images
$subcategoryUrls = @(
    # Main category icons from bildelar page
    "https://picdn.trodo.com/media/catalog/category_m2/135/252_brake_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/241_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/663_suspension.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/676_steering.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/606_windscreen_cleaning_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/4_engine.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/740_fuel_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/198_exhaust_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/323_electrics.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/296_cooling_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/414_heater.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/814_transmission_and_gearing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/443_body.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/lightning.jpg",
    
    # Bromssystem (Brake System)
    "https://picdn.trodo.com/media/catalog/category_m2/135/269_brake_discs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/268_brake_pads.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/257_brake_calipers.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/270_brake_parts_accessories.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/281_wear_indicator_brake_pads.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/256_brake_caliper_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/260_handbrake.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/274_brake_drums.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/273_brake_lining_shoe.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/279_wheel_cylinders.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/276_drum_brake_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/264_abs_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/254_brake_master_cylinder.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/261_brake_hoses.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/282_control_levers_cables.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1102_brake_line_fittings.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/253_brake_booster.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1100_brake_lines.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/265_vacuum_pump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/263_brake_power_regulator.jpg",
    
    # Filter
    "https://picdn.trodo.com/media/catalog/category_m2/135/242_oil_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/243_air_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/244_fuel_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/245_hydraulic_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/246_pollen_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/247_coolant_filters.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/248_filter_sets.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/685_filter_power_steering.jpg",
    
    # Dämpare och fjädrar (Suspension)
    "https://picdn.trodo.com/media/catalog/category_m2/135/665_shock_absorbers.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/708_stub_axle.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/702_wheel_hub.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/wheel_bearing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/738_wheel_nuts_bolts___studs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/717_stabilizer.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/Strut_boots.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/664_coil_springs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/10004_steering_knuckles_2.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/10003_spring_caps_2.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/668_suspension_strut_bearing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/723_ball_joint.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/710_repair_kit.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/733_track_widening.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/713_steering_links_control_arm_trailing_link_diagonal_arm.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/726_axle_beam.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/stabiliser_mount.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/674_pneumatic_suspension.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/666_ride_height_control_suspension_hydraulics.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/706_bearing_wheel_bearing_housing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/Pitman_arms.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/672_leaf_spring_suspension.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/719_twist_rod.jpg",
    
    # Styrning (Steering)
    "https://picdn.trodo.com/media/catalog/category_m2/135/687_steering_mounting.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/679_steering_damper.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/986_steering_gear.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/690_tie_rod_assembly.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/693_hydraulic_oil_expansion_tank.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/677_tie_rod.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/680_bellowseal.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/681_steering_column.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/678_steering_pump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/steering_lock.jpeg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/688_steering_linkage.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/686_steering_hose_pipe.jpg",
    
    # Vindrutetorkar system (Windscreen Wipers)
    "https://picdn.trodo.com/media/catalog/category_m2/135/607_windscreen_wipers.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/610_wiper_arm_bearing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/612_water_tank_pipe_windscreen.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/611_wiper_linkage_drive.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/955_headlight_washer_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/609_water_pump_windscreen_washing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/608_motor_windscreen_wipers.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/613_washer_fluid_jet.jpg",
    
    # Motordelar (Engine Parts)
    "https://picdn.trodo.com/media/catalog/category_m2/135/10051_engine_gaskets_and_seals.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/98_throttle_sensor.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/185_timing_belt_set.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/91_chargerparts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/86_intake_manifold.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/171_vbelt_set.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/138_exhaust_emission_control.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/25_timing_chain_set.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/47_lubrication.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/10036_tensioners_pulleys_and_dampers.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/72_cylinder_head_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/135_engine_mounting_bracket.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/227_turbocharger.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/95_charger_intake_hose.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/168_belt_drive.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/103_radiator_hoses.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/793_idle_control.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/790_cable_linkages.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/110_crankshaft_drive.jpg",
    
    # Bränslesystem (Fuel System)
    "https://picdn.trodo.com/media/catalog/category_m2/135/43_seals_fuel_circuit.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/352_gauges.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/744_fuel_pump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/235_sensor.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/231_dosage_module.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/788_injectornozzle_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/233_feed_module.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/232_injector_valve.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/787_injector_valvenozzlenozzle_holderui.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/792_fuel_line_distributionallocation.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/Fuel_Tank_Parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/746_repair_kit.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/755_water_sensor.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/753_fuel_pressure_regulator_switch.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/155_secondary_air_pump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/791_fuel_injection_pumphigh_pressure_pump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/799_valves__valve_unit.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/804_repair_kit_carburettor.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/795_repair_kit.jpg",
    
    # Avgassystem (Exhaust System)
    "https://picdn.trodo.com/media/catalog/category_m2/135/207_gasket.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/226_manifold.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/223_sootparticulate_filter.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/200_catalytic_converter.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/229_exhaust_gas_door.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/240_sensor_probe.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/222_exhaust_pipes.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/201_lambda_sensor.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/221_silencer.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/206_individual_assembly_parts.jpg",
    
    # Elsystem (Electrical System)
    "https://picdn.trodo.com/media/catalog/category_m2/135/356_starter.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/341_alternator.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/412_air_bag_system.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/326_ignition_coil.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/10035_switches.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/195_alternator_freewheel_clutch.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/328_glow_plugs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/366_sensors.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/325_ignition_distributor_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/329_ignition_cable_connectors.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/spark_plug_1.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/357_solenoid_switch.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/342_regulator.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/343_generator_alternator_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/349_airelectric_horn.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/360_control_units.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/355_starter_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/367_harness.jpg",
    
    # Kylsystem (Cooling System)
    "https://picdn.trodo.com/media/catalog/category_m2/135/299_water_pump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/320_antifreeze.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/308_flanges.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/312_radiator_mounting_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/316_radiator_fan.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/93_intercooler.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/313_oil_cooler.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/303_thermostat.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/44_seals_coolant_circuit.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/314_expansion_tank_engine_coolant.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/306_radiator_hoses.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/300_belt_pulley.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/310_radiator_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/315_sender_unit_coolant_temperature.jpg",
    
    # Luftkonditionering (Air Conditioning)
    "https://picdn.trodo.com/media/catalog/category_m2/135/425_compressor_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/311_heat_exchanger_interior_heating.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/418_blower_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/439_sensors.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/426_condenser.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/428_dryer.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/430_hoses_pipes.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/421_hosespipes.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/371_parking_heater.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/427_vaporizer.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/420_actuators.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/431_relay.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/423_valves_controls.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/429_valves.jpg",
    
    # Drivlina (Transmission)
    "https://picdn.trodo.com/media/catalog/category_m2/135/10007_idividual_clutch_parts.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/889_universal_joint.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/819_cv_joint__set.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/353_tachometer_shaft.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/832_flywheel.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/856_transmission_control.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/824_repair_kit_clutch_complete.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/890_propshaft.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/pusass_piedzinasvarpsta.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/836_master_cylinder.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/833_pilot_bearing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/881_radiator.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/818_tripod_hub.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/876_wet_sump.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/891_bearing_mounting.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/817_transmission_assembly_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/855_transmission_housing_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/854_transmission_mounting.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/886_differential.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/883_oil_change_parts_set.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/puteklu_sargs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/10052_transmission_gaskets_and_seals.png",
    
    # Karosseri (Body)
    "https://picdn.trodo.com/media/catalog/category_m2/135/10005_door_handles_and_locks.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/483_gas_springs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/Wing.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/454_mudguard.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/448_trimprotective_strips.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/469_mirrors.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/10006_interior_parts.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/478_bootcargo_area_flaplid.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/467_support_frame_engine_carrier.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/460_bumper_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/461_front_fairing_grille.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/457_footboard_door_pillar.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/463_licence_plate_holder_bracket.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/477_doors_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/456_floor_panel.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/492_bonnet_parts_silencing_material.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/472_window_seals.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/618_seats.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/402_aerial.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/164_engine_cover.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/604_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/622_window_lift.jpg",
    
    # Utvändig belysning (External Lighting)
    "https://picdn.trodo.com/media/catalog/category_m2/135/combination_rearlight.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/953_parts_headlight.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/951_headlights.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/915_combination_rearlight_parts.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/926_indicator.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1001_led_license_plate_lamps.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/1074_car_bulbs.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/921_auxiliary_stop_light.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/DRL_dedicated.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/931_licence_plate_light.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/LED_Conversion_Kits_1.png",
    "https://picdn.trodo.com/media/catalog/category_m2/135/rear_foglight1.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/939_reverse_light.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/fog_light-insert.jpg",
    "https://picdn.trodo.com/media/catalog/category_m2/135/Lighting_Switches.jpg"
)

Write-Host "Starting download of trodo.se category images..." -ForegroundColor Green

# Download banner images
Write-Host "`nDownloading banner images..." -ForegroundColor Yellow
$bannerCount = 0
foreach ($url in $bannerUrls) {
    $filename = [System.IO.Path]::GetFileName($url)
    $destination = Join-Path $bannerDir $filename
    try {
        Invoke-WebRequest -Uri $url -OutFile $destination -UseBasicParsing
        $bannerCount++
        Write-Host "  Downloaded: $filename" -ForegroundColor Gray
    } catch {
        Write-Host "  Failed: $filename - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Download subcategory images
Write-Host "`nDownloading subcategory images..." -ForegroundColor Yellow
$subcategoryCount = 0
foreach ($url in $subcategoryUrls) {
    $filename = [System.IO.Path]::GetFileName($url)
    $destination = Join-Path $outputDir $filename
    try {
        Invoke-WebRequest -Uri $url -OutFile $destination -UseBasicParsing
        $subcategoryCount++
        Write-Host "  Downloaded: $filename" -ForegroundColor Gray
    } catch {
        Write-Host "  Failed: $filename - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Download complete!" -ForegroundColor Green
Write-Host "Banner images: $bannerCount" -ForegroundColor Cyan
Write-Host "Subcategory images: $subcategoryCount" -ForegroundColor Cyan
Write-Host "Total: $($bannerCount + $subcategoryCount)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

