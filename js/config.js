var TICK_TIME = 50;     // Delay between ticks: 50 ms --> max 20 ticks/second

var MEGA_AMOUNTS = [1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24];
var MEGA_UNITS = [' k', ' M', ' G', ' T', ' P', ' E', ' Z', ' Y'];

var MAP_COLORS = {
    'field_no_herbs': [72, 180, 108],
    'field_full_herbs': [32, 80, 48],
    'house': [70, 70, 70],
    'river': [70, 100, 255],
    'farmer': [170, 120, 65],
    'compost_full': [75, 50, 25],
    'compost_empty': [150, 100, 50]
}

var START_STATE = {
    'game_phase': -1,   // -1 = intro, others

    // Core variables, dont change
    'herbs': 0,
    'teabags': 0,
    'farmers': 1,
    'processors': 0,
    'coll_strategy': 'random',

    'farmer_delay': 10,                             // Walking delay of farmers: this is changed in projects
    'proc_efficiency': 0,
    'coll_efficiency': 0,
    'speed_auto_processing': 0.045,                  // Constant speed multiplier for auto_processing (make teabags)
    'garden_size': 0,

    'collection_min': 0.1,

    // Compost variables, dont change...
    'compost_ready': [false, false, false],
    'compost_timer': [0, 0, 0],
    'compost_set_active': -1,

    // Garden size in tiles
    'num_tiles': [12, 18, 26, 40, 60, 92, 136],

    // Farming & processing efficiency
    'coll_efficiency_speed': [1, 2, 3, 4, 5, 6, 7],
    'proc_efficiency_speed': [1, 2, 3, 5, 9, 18, 27, 36, 50, 72, 95],

    // Processing efficiency gives bonus herbs
    'proc_efficiency_effect': [1.0, 1.1, 1.2, 1.35, 1.5, 1.75, 2.0, 2.25, 2.5, 3, 3.5, 4],      // Create bonus teabags when processing herbs


    // The field is constantly grown
    'constant_num_divider': 20,                     // How many fields are constant boosted = number_of_fields / constant_num_divider
    'constant_amount': 0.015,                       // Every tick, every field that is constant boosted

    // Compost (there are three different ones)
    'compost_times': [120, 500, 700],               // Time to charge compost
    'compost_teabags': [15, 80, 700],               // Cost of compost in teabags
    'compost_lifetime': [900, 1200, 2000],         // How long does the compost stay on the map
    'compost_probability': [0.3, 0.5, 2],           // How many fields does the compost fertilize per tick
    'compost_distance': [2, 3, 10],               // Distance is a normal distribution: this is one standard deviation (68% of fields fertilized)
    'compost_amount': [0.125, 0.125, 0.2],             // Fertilize = random([1 - 2]) * amount

    // Prices
    'price_coll_efficiency': [1, 700, 2500, 15000, 90000, 150000], //tools
    'price_proc_efficiency': [1, 150, 360, 900, 2500, 7500, 12000, 30000, 80000, 120000],
    'price_farmers': [0, 0, 50, 90, 180, 500, 2000, 5000, 15000, 40000, 70000, 100000],
    'price_processors': [0, 45, 60, 80, 150, 230, 800, 3500, 6000, 12500, 35000, 60000, 110000],
    'price_garden_size': [0, 200, 420, 900, 6000, 13000],

    // Some dudes are fertilizers
    'map_fertilizer_ratio': 0.5,                            // The slider value
    'map_fertilizer_max': 0.1,                              // How much fertilizer can a dude spread...


    // WORKER PLACEMENT GAME PHASE (1)
    'workers': 3,
    'monks': 0,
    'meditators': 0,
    'leaders': 0,

    'monks_max': 2,
    'farmers_max': 3,
    'processors_max': 3,
    'meditators_max': 1,
    'leaders_max': 1,

    'factory_speed': 0,
    'factory_efficiency': 0,
    'factory_use': 0,
    'factory_uses': [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5],          // Use less power, factor for 'power_use' (cult bonus)
    'factory_speeds': [55, 110, 220, 440, 880, 1760, 3520, 7040, 14080, 28160],             // How much is processed per processor
    'factory_efficiencies': [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 3, 5],      // Make more teabags then use up herbs

    'greenhouse_speed': 0,
    'greenhouse_use': 0,
    'greenhouse_uses': [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5],  // Use less fertilizer, factor for 'fertilizer_use' (cult bonus)
    'greenhouse_speeds': [50, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600],       // How much is collected per farmer

    // 'greenhouse_num': [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],               // How many farmers per worker

    // Monks
    'focus_action': 0.0,
    'monk_focus_action_generate': 0.0013,             // Focus action generated per monk per tick

    'price_greenhouse_speed':       [1e5, 5e5, 8e5, 32e5, 185e5, 520e5, 1.1e8, 12e8, 110e8],
    'price_factory_speed':          [1e5, 5e5, 8e5, 32e5, 185e5, 520e5, 1.1e8, 12e8, 110e8],
    'price_factory_efficiency':     [3e5, 5e5, 7e5, 30e5, 180e5, 500e5, 1e8, 10e8],
    'price_greenhouse_use':         [1e5, 1.5e5, 7e5, 30e5, 180e5, 500e5, 1e8, 10e8],
    'price_factory_use':            [1e5, 1.5e5, 7e5, 30e5, 180e5, 500e5, 1e8, 10e8],

    // OLD prices
    // [1e3, 2e3, 10e3, 50e3, 250e3, 1e6, 5e6, 50e6, 1e9],

    // Cult bonuses (current value, max_value, effect, use)
    'fertilizer': 0,
    'fertilizer_max': 25,
    'fertilizer_effect': 2,              // If resource at max: amount_harvested *= (1 + effect)
    'fertilizer_use': 0.0025,             // How much of the resource is used per tick (if more than one worker)

    'power': 0,
    'power_max': 25,
    'power_effect': 1.8,                // If resource at max: amount_harvested *= (1 + effect)
    'power_use': 0.002,                 // How much of the resource is used per tick (if more than one worker)

    'focus': 0,
    'focus_max': 1e9,

    // Focus Projects
    'focus_project_level': 0,               // 5 project levels: 0 - 4
    'focus_projects_max': 4,                // Number of focus projects available

    'focus_project_disappear': [900, 1100],             // Ticks

    'focus_project_refresh_cost': 2,        // How many focus points are needed to replace a project
    
    'focus_projects': [
        {
            'name': 'Focus generator',
            'effect': {
                'focus': [0.01, 0.02, 0.04]
            },
            'duration': [700, 800, 600],                  // Ticks (20 / s)
            'focus_action': [1, 2, 4],
            'rarity': [0.8, 0.6, 0.2],
            'level': [
                [0, 1, 2],
                [1, 2, 3, 4],
                [3, 4]
            ],
        },
        {
            'name': 'Nature generator',
            'effect': {
                'fertilizer': [0.008, 0.013, 0.02],
            },
            'duration': [600, 700, 800],                  // Ticks (20 / s)
            'focus_action': [1, 2, 3],
            'rarity': [0.3, 0.3, 0.3],
            'level': [
                [1,2],
                [1, 2, 3],
                [2, 3, 4]
            ],
        },
        {
            'name': 'Processing generator',
            'effect': {
                'power': [0.007, 0.011, 0.02],
            },
            'duration': [600, 700, 800],                  // Ticks (20 / s)
            'focus_action': [1, 2, 3],
            'rarity': [0.3, 0.3, 0.4],
            'level': [
                [1,2],
                [1, 2, 3],
                [2, 3, 4]
            ],
        },
        {
            'name': 'Generate focus and nature',
            'effect': {
                'focus': [0.01, 0.02],
                'fertilizer': [0.01, 0.02],
            },
            'duration': [700, 800],                  // Ticks (20 / s)
            'focus_action': [3, 4],
            'rarity': [0.2, 0.2],
            'level': [
                [2, 3],
                [3, 4]
            ],
        },
        {
            'name': 'Generate focus and processing',
            'effect': {
                'focus': [0.01, 0.02],
                'power': [0.01, 0.03],
            },
            'duration': [700, 800],                  // Ticks (20 / s)
            'focus_action': [3, 4],
            'rarity': [0.2, 0.2],
            'level': [
                [2, 3],
                [3, 4]
            ],
        },
        {
            'name': 'Focus to nature',
            'effect': {
                'focus': [-0.005, -0.006],
                'fertilizer': [0.015, 0.025],
            },
            'duration': [700, 800],                  // Ticks (20 / s)
            'focus_action': [1, 2],
            'rarity': [0.5, 0.5],
            'level': [
                [2, 3],
                [2, 3, 4]
            ],
        },
        {
            'name': 'Focus to processing',
            'effect': {
                'focus': [-0.005, -0.006],
                'power': [0.015, 0.025],
            },
            'duration': [700, 800],                  // Ticks (20 / s)
            'focus_action': [2, 3],
            'rarity': [0.3, 0.3],
            'level': [
                [2, 3],
                [3, 4]
            ],
        },
        {
            'name': 'Nature to processing',
            'effect': {
                'fertilizer': [-0.005, -0.006],
                'power': [0.015, 0.025],
            },
            'duration': [700, 800],                  // Ticks (20 / s)
            'focus_action': [1, 2],
            'rarity': [0.1, 0.1],
            'level': [
                [2, 3],
                [3, 4]
            ],
        },
        {
            'name': 'Processing to Nature',
            'effect': {
                'fertilizer': [0.015, 0.025],
                'power': [-0.005, -0.006],
            },
            'duration': [700, 800],                  // Ticks (20 / s)
            'focus_action': [1, 2],
            'rarity': [0.1, 0.1],
            'level': [
                [2, 3],
                [3, 4]
            ],
        },
    ],

    // MEDITATION
    'meditation_width': [0.24, 0.21, 0.19],                // How wide is the meditation target window
    'meditation_price': [30, 60, 75],                 // Focus to stop a wheel
    'meditation_win': [60, 125, 155],                   // Focus to win if within target
    'meditation_try_cost': [10, 20, 25],              // How much do you lose for each time you try

    'meditation_practice': false,
    'meditation_active': -1,
    'meditation_target': 0,
 
    // SEASON
    'season': 0,                            // 0 = Spring, 1 = Summer, 2 = Autumn, 3 = Winter
    'season_duration': 180 * 20,            // Ticks (20 / s)  ! Make sure this is an even number!
    'season_tick': 0,
    'season_herbs': [0.8, 1.0, 0.8, 0.2],
    

    // GAME PHASE 3 (Bag building & press your luck)
    'ceremony_state': 0, // 0 = Pick Ceremony, 1 = Select Pets, 2 = Fight (3 = Reward)
    'current_ceremony': 0,
    'selection_min': 12,
    'selection_max': 12,
    'zoo': [0,1,2,3,4,5,6,7,8,9,9,9,9,9,10,11,12,13,14,15,16,17,18,19,20,21],

    'selected': [],
    'picked': [],

    'explosion_max': 10,

    'fire': 0,
    'nature': 0,
    'water': 0,
    'explosion': 0,

    'moral': 50,
    'moral_effect_min': 1, // Moral influences how many explosion points a teapet generates
    'moral_effect_max': -1,

    // Teabageria
    'teabageria_speed': 0,
    'teabageria_use': 0,
    'teabageria_uses': [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5],  // Use less fertilizer, factor for 'fertilizer_use'
    'teabageria_speeds': [1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e15, 1e18, 1e21, 1e24, 1e30, 1e45, 1e75, 1e100],       // How much is collected per farmer

    'price_teabageria_speed': [1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 10e3, 11e3, 12e3, 13e3, 14e3, 15e3, 16e3, 17e3],
    'price_teabageria_use': [1e3, 2e3, 3e3, 4e3, 5e3, 6e3, 7e3, 8e3, 9e3, 10e3, 11e3, 12e3, 13e3, 14e3, 15e3, 16e3, 17e3],


    // Focus Resources (current value, max_value, effect, use)
    'teabageria_base_use': 0.005,
    'teabageria': 0,
    'teabageria_max': 25,
    'teabageria_effect': 4,              // If resource at max: amount_harvested *= (1 + effect)
}
