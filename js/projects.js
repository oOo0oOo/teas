
var projects = [
	{
		id: "initial",
		title: "",
		trigger: function(state){
			if (state['teabags'] >= 10){
				$("#ui_projects").show();
				projects[0].status = 2;
			}
			return false;
		},
		cost_str: "",
		cost: function(state){return true},
		status: 0,
		effect: function(state){return state}
	},

	//================== phase 1 ==================//
	{
		id: "strategy0",
		title: "New Strategy: Directions",
		trigger: function(state){return project_done('initial')},
		cost_str: "12",
		cost: function(state){return state["teabags"] >= 12},
		status: 0,
		game_phase: 0,
		description: "Tell your workers where to go.",
		effect: function(state){
			state['teabags'] -= 12;
			$("#ui_coll_strategy").show();
			return state
		}
	},
	{
		id: "compost0",
		title: "Compost!",
		trigger: function(state){return project_done('initial')},
		cost_str: "25",
		cost: function(state){return state["teabags"] >= 25},
		status: 0,
		game_phase: 0,
		description: "What might happen if you reuse these herbs for a different purpose?",
		effect: function(state){
			state['teabags'] -= 25;
			$("#ui_garden").show();
			$("#ui_compost").show();
			engine.start_compost(0, true);
			return state
		}
	},
	{
		id: "time1",
		title: "Collector Speed 1",
		trigger: function(state){return project_done('compost0')},
		cost_str: "80",
		cost: function(state){return state["teabags"] >= 80},
		status: 0,
		game_phase: 0,
		description: "If you offer your workers some of your tea for free, they'll work faster.",
		effect: function(state){
			state['teabags'] -= 80;
			state['farmer_delay'] = 6;
			return state
		}
	},
	{
		id: "hiring",
		title: "Hire some people!",
		trigger: function(state){return project_done('strategy0')},
		cost_str: "60",
		cost: function(state){return state["teabags"] >= 60},
		status: 0,
		game_phase: 0,
		description: "Gardening together is more fun and faster.",
		effect: function(state){
			state['teabags'] -= 60;
			$("#ui_collectors").show();
			state['farmers'] += 1
			return state
		}
	},
	{
		id: "gardening1",
		title: "More Garden = More FUN!",
		trigger: function(state){return project_done('hiring')},
		cost_str: "100",
		cost: function(state){return state["teabags"] >= 100},
		status: 0,
		game_phase: 0,
		description: "Expand your territory.",
		effect: function(state){
			state['teabags'] -= 100;
			$("#ui_garden1").show();
			engine.buy_upgrade('garden_size', true);
			return state
		}
	},
	{
		id: "auto_processing",
		title: "Auto Processing",
		trigger: function(state){return project_done('compost0')},
		cost_str: "40",
		cost: function(state){return state["teabags"] >= 40},
		status: 0,
		game_phase: 0,
		description: "Why doing it all by hand?!",
		effect: function(state){
			state['teabags'] -= 40;
			state['processors'] += 1;
			$("#ui_processors1").show();
			return state
		}
	},
	{
		id: "statistics",
		title: "Statistics",
		trigger: function(state){return project_done("auto_processing")},
		cost_str: "30",
		cost: function(state){return state["teabags"] >= 30},
		status: 0,
		game_phase: 0,
		description: "After drinking a tea, you'll gain more insight into those changing numbers.",
		effect: function(state){
			state['teabags'] -= 30;
			$(".ui_rates").show();
			return state
		}
	},
	{
		id: "compost1",
		title: "Bigger Compost",
		trigger: function(state){return project_done('compost0') && project_done('gardening1')},
		cost_str: "120",
		cost: function(state){return state["teabags"] >= 120},
		status: 0,
		game_phase: 0,
		description: "Fertilizer is nice but you need more!",
		effect: function(state){
			state['teabags'] -= 120;
			$("#ui_compost1").show();
			engine.start_compost(1, true);
			return state
		}
	},
	{
		id: "time2",
		title: "Collector Speed 2",
		trigger: function(state){return project_done('time1') && project_done('gardening1')},
		cost_str: "220",
		cost: function(state){return state["teabags"] >= 220},
		status: 0,
		game_phase: 0,
		description: "Let your workers participate in your daily tea ceremonies, they'll work even faster.",
		effect: function(state){
			state['teabags'] -= 220;
			state['farmer_delay'] = 4;
			return state
		}
	},
	{
		id: "auto_processing2",
		title: "Processing Efficiency",
		trigger: function(state){return project_done('auto_processing') && project_done('time2')},
		cost_str: "220",
		cost: function(state){return state["teabags"] >= 220},
		status: 0,
		game_phase: 0,
		description: "Bag your herbs faster and more efficiently.",
		effect: function(state){
			state['teabags'] -= 220;
			state['proc_efficiency'] = 1;
			$("#ui_processors2").show();
			return state
		}
	},
	{
		id: "strategy1",
		title: "New Strategy: Half Smart",
		trigger: function(state){return project_done('strategy0') && project_done('time2') && project_done('compost1')},
		cost_str: "400",
		cost: function(state){return state["teabags"] >= 400},
		status: 0,
		game_phase: 0,
		description: "Regroup your workers and have a tea at home.",
		effect: function(state){
			state['teabags'] -= 400;
			$("#strategy-smart").css("opacity", 1.0);
			action('strategy_smart');
			return state
		}
	},
	{
		id: "map_fertilizer",
		title: "Train Gardeners",
		trigger: function(state){return project_done('collecting_efficiency')},
		cost_str: "500",
		cost: function(state){return state["teabags"] >= 500},
		status: 0,
		game_phase: 0,
		description: "Equip your farmers with fertilizer",
		effect: function(state){
			state['teabags'] -= 500;
			$("#ui_map_fertilizer").show();
			return state
		}
	},
	{
		id: "collecting_efficiency",
		title: "Collecting Tools",
		trigger: function(state){return project_done('auto_processing2') && project_done('strategy1')},
		cost_str: "420",
		cost: function(state){return state["teabags"] >= 420},
		status: 0,
		game_phase: 0,
		description: "Improve your herb collecting to new levels!",
		effect: function(state){
			state['teabags'] -= 420;
			state['coll_efficiency'] = 1;
			$("#ui_collectors2").show();
			return state
		}
	},
	{
		id: "compost2",
		title: "Even Bigger Compost",
		trigger: function(state){return project_done('strategy1')},
		cost_str: "900",
		cost: function(state){return state["teabags"] >= 900},
		status: 0,
		game_phase: 0,
		description: "Get a fertilizer-silo, this is the best option on the market.",
		effect: function(state){
			state['teabags'] -= 900;
			$("#ui_compost2").show();
			$("#ui_compost0").hide();
			engine.start_compost(2, true);
			return state
		}
	},
	{
		id: "time3",
		title: "Collector Speed 3",
		trigger: function(state){return project_done('time2') && project_done('auto_processing2')},
		cost_str: "2 k",
		cost: function(state){return state["teabags"] >= 2000},
		status: 0,
		game_phase: 0,
		description: "Teach your workers your newly discovered concentration method, they'll collect leaves at a higher rate.",
		effect: function(state){
			state['teabags'] -= 2000;
			state['farmer_delay'] = 2;
			return state
		}
	},
	{
		id: "time4",
		title: "Collector Speed 4",
		trigger: function(state){return project_done('time3')},
		cost_str: "4 k",
		cost: function(state){return state["teabags"] >= 4000},
		status: 0,
		game_phase: 0,
		description: "By letting your workers sleep in a room filled with the vapors of fresh tea, they'll collect leave like crazy!",
		effect: function(state){
			state['teabags'] -= 4000;
			state['farmer_delay'] = 1;
			return state
		}
	},

	//================== phase 2 ==================//
	{
		id: "worker_placement",
		title: "Greenhouse Technology",
		trigger: function(state){return project_done('initial')},
		cost_str: "15 k",
		cost: function(state){return state["teabags"] >= 15e3},
		status: 0,
		game_phase: 1,
		description: "You've heard about this ceremony, which needs a stupid amount of teabags. It is rumored that it has an unexpected positive influence on your teaproduction.",
		effect: function(state){
			switch_to_game_phase_1();
			return state
		}
	},
	{
		id: "focus",
		title: "Tea Ceremony",
		trigger: function(state){return project_done('worker_placement')},
		cost_str: "500",
		cost: function(state){return state["teabags"] >= 500},
		status: 0,
		game_phase: 1,
		description: "You gained more time to focus on the important aspects of tea - the ceremonies - and are now proud memeber of the tea-cult!",
		effect: function(state){
			state['teabags'] -= 500;
			state['workers'] += 1;
			$("#ui_focus").show();
			$("#ui_greenhouse_bonus").show();
			$("#ui_factory_bonus").show();
			return state
		}
	},
	{
		id: "focus_level2",
		title: "Focus Projects Level 2",
		trigger: function(state){return project_done('focus')},
		cost_str: "1",
		cost: function(state){return state["teabags"] >= 1},
		status: 0,
		game_phase: 1,
		description: "Focus Projects Level 2",
		effect: function(state){
			state['teabags'] -= 1;
			state['focus_project_level'] = 1;
			return state
		}
	},
	{
		id: "focus_level3",
		title: "Focus Projects Level 3",
		trigger: function(state){return project_done('focus_level2')},
		cost_str: "1",
		cost: function(state){return state["teabags"] >= 1},
		status: 0,
		game_phase: 1,
		description: "Focus Projects Level 3",
		effect: function(state){
			state['teabags'] -= 1;
			state['focus_project_level'] = 2;
			return state
		}
	},
	{
		id: "focus_level4",
		title: "Focus Projects Level 4",
		trigger: function(state){return project_done('focus_level3')},
		cost_str: "1",
		cost: function(state){return state["teabags"] >= 1},
		status: 0,
		game_phase: 1,
		description: "Focus Projects Level 4",
		effect: function(state){
			state['teabags'] -= 1;
			state['focus_project_level'] = 3;
			return state
		}
	},

	{
		id: "fertilizer_use",
		title: "Advanced Fertilizer",
		trigger: function(state){return project_done('focus')},
		cost_str: "20 {{focus}}&nbsp;&nbsp;1.5 k",
		cost: function(state){return state["teabags"] >= 1.5e3 && state['focus'] >= 20},
		status: 0,
		game_phase: 1,
		description: "Use the sacred tea from ceremonies to fertilize your greenhouses.",
		effect: function(state){
			state['teabags'] -= 1.5e3;
			state['focus'] -= 20;
			state['greenhouse_use'] += 1;

			$("#ui_greenhouse_use").show();

			engine.generate_level();
			return state
		}
	},
	{
		id: "power_use",
		title: "Advanced Power",
		trigger: function(state){return project_done('focus')},
		cost_str: "25 {{focus}}&nbsp;&nbsp;2 k",
		cost: function(state){return state["teabags"] >= 2e3 && state['focus'] >= 25},
		status: 0,
		game_phase: 1,
		description: "Use the sacred tea from ceremonies to fertilize your greenhouses.",
		effect: function(state){
			state['teabags'] -= 2e3;
			state['focus'] -= 25;
			state['factory_use'] += 1;

			$("#ui_factory_use").show();

			engine.generate_level();
			return state
		}
	},
	{
		id: "increase_farm",
		title: "Farm Size",
		trigger: function(state){return project_done('fertilizer_use')},
		cost_str: "20 {{focus}}&nbsp;&nbsp;2.5 k",
		cost: function(state){return state["teabags"] >= 2.5e3 && state['focus'] >= 20},
		status: 0,
		game_phase: 1,
		description: "More members of your tea cult can work on the farm.",
		effect: function(state){
			state['teabags'] -= 2.5e3;
			state['focus'] -= 20;
			state['farmers_max'] += 1;
			return state
		}
	},
	{
		id: "increase_factory",
		title: "Factory Size",
		trigger: function(state){return project_done('power_use')},
		cost_str: "20 {{focus}}&nbsp;&nbsp;3 k",
		cost: function(state){return state["teabags"] >= 3000 && state['focus'] >= 20},
		status: 0,
		game_phase: 1,
		description: "More members of your tea cult can work in the factory.",
		effect: function(state){
			state['teabags'] -= 3000;
			state['focus'] -= 20;
			state['processors_max'] += 1;
			return state
		}
	},
	{
		id: "increase_monks",
		title: "More Monks",
		trigger: function(state){return project_done('focus')},
		cost_str: "25 {{focus}}&nbsp;&nbsp;1 k",
		cost: function(state){return state["teabags"] >= 1000 && state['focus'] >= 25},
		status: 0,
		game_phase: 1,
		description: "Make room for an additional monk.",
		effect: function(state){
			state['teabags'] -= 1000;
			state['focus'] -= 25;
			state['monks_max'] += 1;
			return state
		}
	},
	{
		id: "greenhouse_manager",
		title: "Greenhouse Manager",
		trigger: function(state){return project_done('fertilizer_use')},
		cost_str: "30 {{focus}}&nbsp;&nbsp;5 k",
		cost: function(state){return state["teabags"] >= 5e3 && state['focus'] >= 30},
		status: 0,
		game_phase: 1,
		description: "By introducing a new manager, who is also part of the tea-cult, your collectors will work more efficient.",
		effect: function(state){
			state['teabags'] -= 5e3;
			state['focus'] -= 30;
			state['greenhouse_speed'] += 1;
			$("#ui_greenhouse_speed").show();
			return state
		}
	},
	{
		id: "factory_manager",
		title: "Factory Manager",
		trigger: function(state){return project_done('power_use')},
		cost_str: "35 {{focus}}&nbsp;&nbsp;7 k",
		cost: function(state){return state["teabags"] >= 7e3 && state['focus'] >= 35},
		status: 0,
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to inrcease the output per herb for all your factories.",
		effect: function(state){
			state['teabags'] -= 7e3;
			state['focus'] -= 35;
			state['factory_speed'] += 1;
			$("#ui_factory_speed").show();
			$("#ui_factory_efficiency").show();
			return state
		}
	},
	{
		id: "fertilizer_bonus_max",
		title: "Fertilizer bonus",
		trigger: function(state){return project_done('greenhouse_manager') && project_done('factory_manager')},
		cost_str: "50 {{focus}}&nbsp;&nbsp;30 k",
		cost: function(state){return state["teabags"] >= 30e3 && state['focus'] >= 50},
		status: 0,
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['teabags'] -= 30e3;
			state['focus'] -= 50;
			state['fertilizer_effect'] = 7;
			return state
		}
	},
	{
		id: "fertilizer_bonus_max2",
		title: "Fertilizer bonus 2",
		trigger: function(state){return project_done('fertilizer_bonus_max')},
		cost_str: "75 {{focus}}&nbsp;&nbsp;1 M",
		cost: function(state){return state["teabags"] >= 1e6 && state['focus'] >= 75},
		status: 0,
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['teabags'] -= 1e6;
			state['focus'] -= 75;
			state['fertilizer_effect'] = 10;
			return state
		}
	},
	{
		id: "power_bonus_max",
		title: "Power bonus",
		trigger: function(state){return project_done('greenhouse_manager') && project_done('factory_manager')},
		cost_str: "50 {{focus}}&nbsp;&nbsp;30 k",
		cost: function(state){return state["teabags"] >= 30e3 && state['focus'] >= 50},
		status: 0,
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['teabags'] -= 30e3;
			state['focus'] -= 50;
			state['power_effect'] = 6;
			return state
		}
	},
	{
		id: "power_bonus_max2",
		title: "Power bonus 2",
		trigger: function(state){return project_done('power_bonus_max')},
		cost_str: "75 {{focus}}&nbsp;&nbsp;1 M",
		cost: function(state){return state["teabags"] >= 1e6 && state['focus'] >= 75},
		status: 0,
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['teabags'] -= 1e6;
			state['focus'] -= 75;
			state['power_effect'] = 9;
			return state
		}
	},
	{
		id: "increase_workers_both",
		title: "Break Room",
		trigger: function(state){return project_done('increase_farm') && project_done('increase_factory') && project_done('fertilizer_bonus_max') && project_done('power_bonus_max')},
		cost_str: "50 {{focus}}&nbsp;&nbsp;50 k",
		cost: function(state){return state["teabags"] >= 50e3 && state['focus'] >= 50},
		status: 0,
		game_phase: 1,
		description: "A break room increases the number of workers, the farm and factory can use.",
		effect: function(state){
			state['teabags'] -= 50e3;
			state['focus'] -= 50;
			state['farmers_max'] += 1;
			state['processors_max'] += 1;
			return state
		}
	},	
	{
		id: "increase_monks2",
		title: "Spiritual Leader",
		trigger: function(state){return project_done('increase_workers_both')},
		cost_str: "80 {{focus}}&nbsp;&nbsp;50 k",
		cost: function(state){return state["teabags"] >= 50e3 && state['focus'] >= 80},
		status: 0,
		game_phase: 1,
		description: "You become a spiritual leader and increase meditation group.",
		effect: function(state){
			state['teabags'] -= 50e3;
			state['focus'] -= 80;
			state['monks_max'] += 1;
			return state
		}
	},
	{
		id: "more_focus_projects",
		title: "Better focus",
		trigger: function(state){return project_done('greenhouse_manager') && project_done('factory_manager')},
		cost_str: "75 {{focus}}",
		cost: function(state){return state['focus'] >= 75},
		status: 0,
		game_phase: 1,
		description: "Due to repeated ceremonies, your consciousness expands and more focus options are available.",
		effect: function(state){
			state['focus'] -= 75;
			state['focus_projects_max'] = 5;
			state['focus_middle_generator'] = 1.0;
			engine.generate_level();
			return state
		}
	},
	{
		id: "more_workers",
		title: "Add Worker",
		trigger: function(state){return project_done('worker_placement')},
		cost_str: "25 {{focus}}&nbsp;&nbsp;5 k",
		cost: function(state){return state["teabags"] >= 5e3 && state['focus'] >= 25},
		status: 0,
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['teabags'] -= 5e3;
			state['focus'] -= 25;
			state['workers'] += 1;
			return state
		}
	},
	{
		id: "more_workers2",
		title: "Add Worker",
		trigger: function(state){return project_done('more_workers')},
		cost_str: "50 {{focus}}&nbsp;&nbsp;12 k",
		cost: function(state){return state["teabags"] >= 12e3 && state['focus'] >= 50},
		status: 0,
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['teabags'] -= 12e3;
			state['focus'] -= 50;
			state['workers'] += 1;
			return state
		}
	},
	{
		id: "more_workers3",
		title: "Add Worker",
		trigger: function(state){return project_done('more_workers2') && project_done('meditation')},
		cost_str: "50 {{focus}}&nbsp;&nbsp;25 k",
		cost: function(state){return state["teabags"] >= 25e3 && state['focus'] >= 50},
		status: 0,
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['teabags'] -= 25e3;
			state['focus'] -= 50;
			state['workers'] += 1;
			return state
		}
	},
	{
		id: "more_workers4",
		title: "Add Two Workers",
		trigger: function(state){return project_done('more_workers3')},
		cost_str: "150 {{focus}}&nbsp;&nbsp;1 M",
		cost: function(state){return state["teabags"] >= 1e6 && state['focus'] >= 150},
		status: 0,
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['teabags'] -= 1e6;
			state['focus'] -= 150;
			state['workers'] += 2;
			return state
		}
	},
	{
		id: "meditation",
		title: "Meditation",
		trigger: function(state){return project_done('more_workers') && project_done('factory_manager') && project_done('greenhouse_manager')},
		cost_str: "75 {{focus}}",
		cost: function(state){return state['focus'] >= 75},
		status: 0,
		game_phase: 1,
		description: "The master of the tea-cult, wants to show you some secret techniques - for devoted members only!",
		effect: function(state){
			state['focus'] -= 75;
			$("#ui_meditation").show();
            reset_meditation();
			return state
		}
	},
	{
		id: "meditation2",
		title: "Meditation 2",
		trigger: function(state){return project_done('meditation')},
		cost_str: "100 {{focus}}&nbsp;&nbsp;1 M",
		cost: function(state){return state["teabags"] >= 1e6 && state['focus'] >= 100},
		status: 0,
		game_phase: 1,
		description: "Your master's secret-techniques start to make more sense.",
		effect: function(state){
			state['teabags'] -= 1e6;
			state['focus'] -= 100;
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
		trigger: function(state){return project_done('meditation2')},
		cost_str: "150 {{focus}}&nbsp;&nbsp;10 M",
		cost: function(state){return state["teabags"] >= 10e6 && state['focus'] >= 150},
		status: 0,
		game_phase: 1,
		description: "Your master's secret-techniques start to make more sense.",
		effect: function(state){
			state['teabags'] -= 10e6;
			state['focus'] -= 150;
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
		trigger: function(state){return state['game_phase'] == 1}, //project_done('meditation3') && project_done('power_bonus_max2')  && project_done('fertilizer_bonus_max2')},
		cost_str: "500 {{focus}}&nbsp;&nbsp;2.5 G",
		cost: function(state){return state["teabags"] >= 2.5e9 && state['focus'] >= 500},
		status: 0,
		game_phase: 1,
		description: "It's time for a change! Become master of your own tea-cult.",
		effect: function(state){
			switch_to_game_phase_2();
			return state
		}
	}

]


function project_done(id){
	var project = projects.find(x => x.id === id);
	return project.status == 2;
}
