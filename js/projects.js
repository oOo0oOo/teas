
var projects = [
	{
		id: "initial",
		title: "Enjoy the Moment",
		trigger: function(state){
			if (state['teabags'] >= 8){
				$("#ui_projects").show();
                return true;
			}
			return false;
		},
        cost: {teabags: 3},
		game_phase: 0,
		description: "This tea is so refreshing.",
		effect: function(state){
            $(".menu-box").show();
            return state
        }
	},

	//================== phase 1 ==================//
	{
		id: "strategy0",
		title: "New Strategy: Directions",
		trigger: function(state){return engine.project_done('initial')},
        cost: {teabags: 12},
		game_phase: 0,
		description: "Tell your farmers where to go.",
		effect: function(state){
			$("#ui_coll_strategy").show();
			return state
		}
	},
	{
		id: "compost0",
		title: "Compost!",
		trigger: function(state){return engine.project_done('initial')},
        cost: {teabags: 25},
		game_phase: 0,
		description: "What might happen if you reuse these herbs for a different purpose?",
		effect: function(state){
			$("#ui_garden").show();
			$("#ui_compost").show();
			engine.start_compost(0, true);
			return state
		}
	},
	{
		id: "time1",
		title: "Farmer Speed",
		trigger: function(state){return engine.project_done('compost0')},
        cost: {teabags: 80},
		game_phase: 0,
		description: "If you offer your farmers some of your tea for free, they'll work faster.",
		effect: function(state){
			state['farmer_delay'] = 6;
			return state
		}
	},
	{
		id: "hiring",
		title: "Hire Some People",
		trigger: function(state){return engine.project_done('strategy0')},
        cost: {teabags: 60},
		game_phase: 0,
		description: "Gardening together is more fun.",
		effect: function(state){
			$("#ui_collectors").show();
			state['farmers'] += 1
			return state
		}
	},
	{
		id: "gardening1",
		title: "More Garden, More Fun",
		trigger: function(state){return engine.project_done('hiring')},
        cost: {teabags: 100},
		game_phase: 0,
		description: "Expand your territory.",
		effect: function(state){
			$("#ui_garden1").show();
			engine.buy_upgrade('garden_size', true);
			return state
		}
	},
	{
		id: "auto_processing",
		title: "Auto Brewing",
		trigger: function(state){return engine.project_done('compost0')},
        cost: {teabags: 40},
		game_phase: 0,
		description: "Why are you doing it by hand?!",
		effect: function(state){
			state['processors'] += 1;
			$("#ui_processors1").show();
			return state
		}
	},
	{
		id: "statistics",
		title: "Statistics",
		trigger: function(state){return engine.project_done("auto_processing")},
        cost: {teabags: 30},
		game_phase: 0,
		description: "After drinking some tea, you gain more insight into those changing numbers.",
		effect: function(state){
			$(".ui_rates").show();
			return state
		}
	},
	{
		id: "compost1",
		title: "Bigger Compost",
		trigger: function(state){return engine.project_done('compost0') && engine.project_done('gardening1')},
        cost: {teabags: 120},
		game_phase: 0,
		description: "A bucket is nice but you need more!",
		effect: function(state){
			$("#ui_compost1").show();
			engine.start_compost(1, true);
			return state
		}
	},	
    {
		id: "auto_compost",
		title: "Auto Compost",
		trigger: function(state){return engine.project_done('auto_processing') && engine.project_done('compost1')},
        cost: {teabags: 100},
		game_phase: 0,
		description: "Automatically buy composts if possible!",
		effect: function(state){
			$("#auto_compost_box0").show();
			$("#auto_compost_box1").show();
			$("#auto_compost_box2").show();
			return state
		}
	},
	{
		id: "time2",
		title: "Farmer Speed Up",
		trigger: function(state){return engine.project_done('time1') && engine.project_done('gardening1')},
        cost: {teabags: 220},
		game_phase: 0,
		description: "Let your farmers participate in your daily tea ceremonies, they'll work even faster.",
		effect: function(state){
			state['farmer_delay'] = 4;
			return state
		}
	},
	{
		id: "auto_processing2",
		title: "Brewing Efficiency",
		trigger: function(state){return engine.project_done('auto_processing') && engine.project_done('time2')},
        cost: {teabags: 220},
		game_phase: 0,
		description: "Brew your teas faster and more efficiently.",
		effect: function(state){
			state['proc_efficiency'] = 1;
			$("#ui_processors2").show();
			return state
		}
	},
	{
		id: "strategy1",
		title: "New Strategy: Smart",
		trigger: function(state){return engine.project_done('strategy0') && engine.project_done('time2') && engine.project_done('compost1')},
        cost: {teabags: 400},
		game_phase: 0,
		description: "Teach your farmers to spot good tea bushes.",
		effect: function(state){
			$("#strategy-smart").css("opacity", 1.0);
			action('strategy_smart');
			return state
		}
	},
	{
		id: "map_fertilizer",
		title: "Train Gardeners",
		trigger: function(state){return engine.project_done('collecting_efficiency')},
        cost: {teabags: 500},
		game_phase: 0,
		description: "Equip your farmers with fertilizer",
		effect: function(state){
			$("#ui_map_fertilizer").show();
			return state
		}
	},
	{
		id: "collecting_efficiency",
		title: "Collecting Tools",
		trigger: function(state){return engine.project_done('auto_processing2') && engine.project_done('strategy1')},
        cost: {teabags: 420},
		game_phase: 0,
		description: "Improve your herb collection by using tools!",
		effect: function(state){
			state['coll_efficiency'] = 1;
			$("#ui_collectors2").show();
			return state
		}
	},
	{
		id: "compost2",
		title: "Even Bigger Compost",
		trigger: function(state){return engine.project_done('strategy1')},
        cost: {teabags: 900},
		game_phase: 0,
		description: "Get a fertilizer-silo! This is the best option on the market.",
		effect: function(state){
			$("#ui_compost2").show();
			$("#ui_compost0").hide();
			engine.start_compost(2, true);
			return state
		}
	},
	{
		id: "time3",
		title: "Farmer Focus",
		trigger: function(state){return engine.project_done('time2') && engine.project_done('auto_processing2')},
        cost: {teabags: 2000},
		game_phase: 0,
		description: "Teach your farmers your newly discovered focus method, they'll collect leaves faster.",
		effect: function(state){
			state['farmer_delay'] = 2;
			return state
		}
	},
	{
		id: "time4",
		title: "Farmer Tea Ceremony",
		trigger: function(state){return engine.project_done('time3')},
        cost: {teabags: 4000},
		game_phase: 0,
		description: "By letting your workers sleep in a room filled with fresh tea vapors, they'll collect leaves like crazy!",
		effect: function(state){
			state['farmer_delay'] = 1;
			return state
		}
	},
	{
		id: "worker_placement",
		title: "Greenhouse Technology",
		trigger: function(state){return engine.project_done('initial') && state["teabags"] >= 3000},
        cost: {teabags: 15000},
		game_phase: 0,
		description: "You've heard about this ceremony, which needs a stupid amount of teas. It is rumored that it leads to unexpected influences on your tea production.",
		effect: function(state){
			switch_to_game_phase_1();
			return state
		}
	},

	//================== phase 2 ==================//
	{
		id: "focus",
		title: "Tea Ceremony",
		trigger: function(state){return engine.project_done('worker_placement')},
        cost: {teabags: 500},
		game_phase: 1,
		description: "You gained more time to focus on the important aspects of tea - the ceremonies - and are now proud member of a tea-cult!",
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			$("#ui_focus").show();
			$("#ui_greenhouse_bonus").show();
			$("#ui_factory_bonus").show();
			return state
		}
	},
	{
		id: "focus_level2",
		title: "Focus Projects Level 2",
		trigger: function(state){return engine.project_done('focus')},
        cost: {teabags: 100},
		game_phase: 1,
		description: "Focus Projects Level 2",
		effect: function(state){
			state['focus_project_level'] = 1;
			return state
		}
	},
	{
		id: "focus_level3",
		title: "Focus Projects Level 3",
		trigger: function(state){return engine.project_done('focus_level2')},
        cost: {teabags: 100},
		game_phase: 1,
		description: "Focus Projects Level 3",
		effect: function(state){
			state['focus_project_level'] = 2;
			return state
		}
	},
	{
		id: "focus_level4",
		title: "Focus Projects Level 4",
		trigger: function(state){return engine.project_done('focus_level3')},
        cost: {teabags: 100},
		game_phase: 1,
		description: "Focus Projects Level 4",
		effect: function(state){
			state['focus_project_level'] = 3;
			return state
		}
	},
	{
		id: "fertilizer_use",
		title: "Advanced Fertilizer",
		trigger: function(state){return engine.project_done('focus')},
        cost: {focus: 20, teabags: 1500},
		game_phase: 1,
		description: "Use the sacred tea from ceremonies to fertilize your greenhouses.",
		effect: function(state){
			state['greenhouse_use'] += 1;
			$("#ui_greenhouse_use").show();
			engine.generate_level();
			return state
		}
	},
	{
		id: "power_use",
		title: "Advanced Power",
		trigger: function(state){return engine.project_done('focus')},
        cost: {focus: 25, teabags: 2000},
		game_phase: 1,
		description: "Use the sacred tea from ceremonies to fertilize your greenhouses.",
		effect: function(state){
			state['factory_use'] += 1;

			$("#ui_factory_use").show();

			engine.generate_level();
			return state
		}
	},
	{
		id: "increase_farm",
		title: "Farm Size",
		trigger: function(state){return engine.project_done('fertilizer_use')},
        cost: {focus: 20, teabags: 2500},
		game_phase: 1,
		description: "More members of your tea cult can work on the farm.",
		effect: function(state){
			state['farmers_max'] += 1;
			return state
		}
	},
	{
		id: "increase_factory",
		title: "Brew House Size",
		trigger: function(state){return engine.project_done('power_use')},
        cost: {focus: 20, teabags: 3000},
		game_phase: 1,
		description: "More members of your tea cult can work in the brew house.",
		effect: function(state){
			state['processors_max'] += 1;
			return state
		}
	},
	{
		id: "increase_monks",
		title: "More Monks",
		trigger: function(state){return engine.project_done('focus')},
        cost: {focus: 25, teabags: 1000},
		game_phase: 1,
		description: "Make room for an additional monk.",
		effect: function(state){
			state['monks_max'] += 1;
			return state
		}
	},
	{
		id: "greenhouse_manager",
		title: "Greenhouse Manager",
		trigger: function(state){return engine.project_done('fertilizer_use')},
        cost: {focus: 30, teabags: 5000},
		game_phase: 1,
		description: "By introducing a new manager, who is also part of the tea-cult, your collectors will work more efficient.",
		effect: function(state){
			state['greenhouse_speed'] += 1;
			$("#ui_greenhouse_speed").show();
			return state
		}
	},
	{
		id: "factory_manager",
		title: "Factory Manager",
		trigger: function(state){return engine.project_done('power_use')},
        cost: {focus: 35, teabags: 7000},
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to inrcease the output per herb for all your factories.",
		effect: function(state){
			state['factory_speed'] += 1;
			$("#ui_factory_speed").show();
			$("#ui_factory_efficiency").show();
			return state
		}
	},
	{
		id: "fertilizer_bonus_max",
		title: "Fertilizer bonus",
		trigger: function(state){return engine.project_done('greenhouse_manager') && engine.project_done('factory_manager')},
        cost: {focus: 50, teabags: 30000},
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['fertilizer_effect'] = 7;
			return state
		}
	},
	{
		id: "fertilizer_bonus_max2",
		title: "Fertilizer bonus 2",
		trigger: function(state){return engine.project_done('fertilizer_bonus_max')},
        cost: {focus: 75, teabags: 1e6},
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['fertilizer_effect'] = 10;
			return state
		}
	},
	{
		id: "power_bonus_max",
		title: "Power bonus",
		trigger: function(state){return engine.project_done('greenhouse_manager') && engine.project_done('factory_manager')},
        cost: {focus: 50, teabags: 30000},
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['power_effect'] = 6;
			return state
		}
	},
	{
		id: "power_bonus_max2",
		title: "Power bonus 2",
		trigger: function(state){return engine.project_done('power_bonus_max')},
        cost: {focus: 75, teabags: 1e6},
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['power_effect'] = 9;
			return state
		}
	},
	{
		id: "increase_workers_both",
		title: "Break Room",
		trigger: function(state){return engine.project_done('increase_farm') && engine.project_done('increase_factory') && engine.project_done('fertilizer_bonus_max') && engine.project_done('power_bonus_max')},
        cost: {focus: 50, teabags: 50000},
		game_phase: 1,
		description: "A break room increases the number of workers in the farm and brew house.",
		effect: function(state){
			state['farmers_max'] += 1;
			state['processors_max'] += 1;
			return state
		}
	},	
	{
		id: "increase_monks2",
		title: "Spiritual Leader",
		trigger: function(state){return engine.project_done('increase_workers_both')},
        cost: {focus: 80, teabags: 50000},
		game_phase: 1,
		description: "You become a spiritual leader and increase meditation group.",
		effect: function(state){
			state['monks_max'] += 1;
			return state
		}
	},
	{
		id: "more_focus_projects",
		title: "Better focus",
		trigger: function(state){return engine.project_done('greenhouse_manager') && engine.project_done('factory_manager')},
        cost: {focus: 75},
		game_phase: 1,
		description: "Due to repeated ceremonies, your consciousness expands and more focus options are available.",
		effect: function(state){
			state['focus_projects_max'] = 5;
			state['focus_middle_generator'] = 1.0;
			engine.generate_level();
			return state
		}
	},
	{
		id: "more_workers",
		title: "Add Worker",
		trigger: function(state){return engine.project_done('worker_placement')},
        cost: {focus: 25, teabags: 5000},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			return state
		}
	},
	{
		id: "more_workers2",
		title: "Add Worker",
		trigger: function(state){return engine.project_done('more_workers')},
        cost: {focus: 50, teabags: 12e3},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			return state
		}
	},
	{
		id: "more_workers3",
		title: "Add Worker",
		trigger: function(state){return engine.project_done('more_workers2') && engine.project_done('meditation')},
        cost: {focus: 50, teabags: 25e3},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			return state
		}
	},
	{
		id: "more_workers4",
		title: "Add Two Workers",
		trigger: function(state){return engine.project_done('more_workers3')},
        cost: {focus: 150, teabags: 1e6},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 2;
            update_free_workers();
			return state
		}
	},
	{
		id: "meditation",
		title: "Meditation",
		trigger: function(state){return engine.project_done('more_workers') && engine.project_done('factory_manager') && engine.project_done('greenhouse_manager')},
        cost: {focus: 75},
		game_phase: 1,
		description: "The master of the tea-cult, wants to show you some secret techniques - for devoted members only!",
		effect: function(state){
			$("#ui_meditation").show();
            reset_meditation();
			return state
		}
	},
	{
		id: "meditation2",
		title: "Meditation 2",
		trigger: function(state){return engine.project_done('meditation')},
        cost: {focus: 100, teabags: 1e6},
		game_phase: 1,
		description: "Your master's secret-techniques start to make more sense.",
		effect: function(state){
			state['meditation_width'] = 0.25;
			state['meditation_price'] = 60;
			state['meditation_try_cost'] = 20;
			state['meditation_win'] = 125;
            reset_meditation();
			return state
		}
	},
	{
		id: "meditation3",
		title: "Meditation 3",
		trigger: function(state){return engine.project_done('meditation2')},
        cost: {focus: 150, teabags: 10e6},
		game_phase: 1,
		description: "Your master's secret-techniques start to make more sense.",
		effect: function(state){
			state['meditation_width'] = 0.26;
			state['meditation_price'] = 75;
			state['meditation_try_cost'] = 25;
			state['meditation_win'] = 155;
            reset_meditation();
			return state
		}
	},
	{
		id: "nirvana",
		title: "Nirvana",
		trigger: function(state){return state['game_phase'] == 1},
        cost: {focus: 500, teabags: 2.5e9},
		game_phase: 1,
		description: "It's time for a change! Become master of your own tea-cult.",
		effect: function(state){
			switch_to_game_phase_2();
			return state
		}
	}
]
