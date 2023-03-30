
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
		id: "home",
		title: "Come Home!",
		trigger: function(state){return engine.project_done('hiring') && engine.project_done('compost0')},
        cost: {teabags: 50},
		game_phase: 0,
		description: "Regroup your farmers at home.",
		effect: function(state){
			$("#strategy-home").css("opacity", 1.0);
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
		trigger: function(state){return engine.project_done('hiring') && engine.project_done('home')},
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
		trigger: function(state){return engine.project_done('collecting_efficiency') && engine.project_done('compost2')},
        cost: {teabags: 2500},
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

			// Hide bucket and unset checkbox
			$("#ui_compost0").css("opacity", 0.0);
			$("#auto_compost0").prop("checked", false);
			
			engine.start_compost(2, true);
			return state
		}
	},
	{
		id: "time3",
		title: "Farmer Focus",
		trigger: function(state){return engine.project_done('time2') && engine.project_done('auto_processing2') && engine.project_done('compost2')},
        cost: {teabags: 20000},
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
        cost: {teabags: 80000},
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
		trigger: function(state){return engine.project_done('initial') && state["teabags"] >= 80000},
        cost: {teabags:500000},
		game_phase: 0,
		description: "You've heard about this ceremony, which needs a stupid amount of teas. It is rumored that it leads to unexpected influences on your tea production. Are you sure?!",
		effect: function(state){
			// Open tutorial popup (reveal)
			$("#intro_popup_phase1").foundation('open');
			return state
		}
	},






	//================== phase 2 ==================//
	{
		id: "focus",
		title: "Tea Ceremony",
		trigger: function(state){return engine.project_done('worker_placement') && state["game_phase"] == 1},
        cost: {teabags: 50000},
		game_phase: 1,
		description: "You gained more time to focus on the important aspects of tea - the ceremonies - and are now proud member of a tea-cult!",
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			$("#ui_focus").show();
			$("#worker_monks").show();
			return state
		}
	},
	{
		id: "focus_level2",
		title: "Monk Focus",
		trigger: function(state){return engine.project_done('focus')},
        cost: {focus: 15, teabags: 150000},
		game_phase: 1,
		description: "Your monks discover new ceremonies to improve tea production.",
		effect: function(state){
			state['focus_project_level'] = 1;
			$("#ui_greenhouse_bonus").css('display', 'flex');
			$("#ui_factory_bonus").css('display', 'flex');
			return state
		}
	},
	{
		id: "more_workers",
		title: "Add Worker",
		trigger: function(state){return engine.project_done('focus')},
        cost: {focus: 25, teabags: 250000},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			return state
		}
	},
	{
		id: "temple_leader",
		title: "Temple Leader",
		trigger: function(state){return engine.project_done('focus_level2')},
        cost: {focus: 40},
		game_phase: 1,
		description: "A temple leader will help your monks to focus on the right projects.",
		effect: function(state){
			$("#worker_leaders").show();
			$(".leader_box").css("display", "flex");
			$(".leader_box").hide();

			state['workers'] += 1;
			update_free_workers();

			return state
		}
	},
	{
		id: "fertilizer_use",
		title: "Advanced Tea Growth",
		trigger: function(state){return engine.project_done('focus_level2')},
        cost: {focus: 20, teabags: 400000},
		game_phase: 1,
		description: "Use the sacred tea from your ceremonies to fertilize the greenhouses.",
		effect: function(state){
			state['greenhouse_use'] += 1;
			$("#ui_greenhouse_use").show();
			engine.generate_level();
			return state
		}
	},
	{
		id: "power_use",
		title: "Brewing Power",
		trigger: function(state){return engine.project_done('focus_level2')},
        cost: {focus: 25, teabags: 300000},
		game_phase: 1,
		description: "Use divine fumes to boost your brewing process.",
		effect: function(state){
			state['factory_use'] += 1;

			$("#ui_factory_use").show();

			engine.generate_level();
			return state
		}
	},
	{
		id: "increase_monks",
		title: "Temple Expansion",
		trigger: function(state){return engine.project_done('temple_leader') && engine.project_done('more_workers')},
        cost: {focus: 45},
		game_phase: 1,
		description: "Make room for an additional monk.",
		effect: function(state){
			state['monks_max'] += 1;
			return state
		}
	},
	{
		id: "increase_farm",
		title: "New Field",
		trigger: function(state){return engine.project_done('fertilizer_use')},
        cost: {teabags: 600000},
		game_phase: 1,
		description: "More members of your tea cult can work on the farm.",
		effect: function(state){
			state['farmers_max'] += 1;
			return state
		}
	},
	{
		id: "increase_factory",
		title: "Extra Brewing Room",
		trigger: function(state){return engine.project_done('power_use')},
        cost: {teabags: 700000},
		game_phase: 1,
		description: "The brew house has room for an extra worker.",
		effect: function(state){
			state['processors_max'] += 1;
			return state
		}
	},
	{
		id: "more_focus_projects",
		title: "Better Focus",
		trigger: function(state){return engine.project_done('temple_leader')},
        cost: {focus: 50},
		game_phase: 1,
		description: "Due to repeated ceremonies, your consciousness expands and more focus options are available.",
		effect: function(state){
			state['focus_projects_max'] = 5;
			engine.generate_level();
			return state
		}
	},
	{
		id: "more_workers1_a_half",
		title: "Add Another Worker",
		trigger: function(state){return engine.project_done('more_workers') && engine.project_done('fertilizer_use') && engine.project_done('power_use')},
        cost: {focus: 45, teabags: 500000},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			return state
		}
	},
	{
		id: "focus_level3",
		title: "Techniques of Focus",
		trigger: function(state){return engine.project_done('temple_leader') && engine.project_done('fertilizer_use') && engine.project_done('power_use') && engine.project_done('increase_monks')},
        cost: {focus: 40, teabags: 500000},
		game_phase: 1,
		description: "Can you believe it? Your monks have found even more ceremonies to improve tea production!",
		effect: function(state){
			state['focus_project_level'] = 2;
			return state
		}
	},
	{
		id: "temple_leader_focus",
		title: "Temple Leader Focus",
		trigger: function(state){return engine.project_done('temple_leader') && engine.project_done('focus_level3')},
        cost: {focus: 50, teabags: 500000},
		game_phase: 1,
		description: "Your temple leader can now decide a focus for all your ceremonies.",
		effect: function(state){
			$("#leader_strategies_box").css("opacity", "1");
			return state
		}
	},
	{
		id: "greenhouse_manager",
		title: "Greenhouse Manager",
		trigger: function(state){return engine.project_done('increase_farm') && engine.project_done('power_use') && engine.project_done('focus_level3')},
        cost: {focus: 45, teabags: 800000},
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
		title: "Brew Specialist",
		trigger: function(state){return engine.project_done('increase_factory') && engine.project_done('fertilizer_use') && engine.project_done('focus_level3')},
        cost: {focus: 50, teabags: 1000000},
		game_phase: 1,
		description: "In the tea-cult you met this guy, who claims to increase the output per herb for all your factories.",
		effect: function(state){
			state['factory_speed'] += 1;
			$("#ui_factory_speed").show();
			$("#ui_factory_efficiency").show();
			return state
		}
	},
	{
		id: "more_focus_projects2",
		title: "Laser Focus",
		trigger: function(state){return engine.project_done('more_focus_projects')},
        cost: {focus: 75},
		game_phase: 1,
		description: "Due to your incredible tea experiments, your monks will have even more focus options.",
		effect: function(state){
			state['focus_projects_max'] = 6;
			state['focus_middle_generator'] = 1.0;
			engine.generate_level();
			return state
		}
	},
	{
		id: "meditation",
		title: "Meditation",
		trigger: function(state){return engine.project_done('factory_manager') && engine.project_done('greenhouse_manager') && engine.project_done('more_focus_projects')},
        cost: {focus: 80},
		game_phase: 1,
		description: "You discover secret tea techniques - for devoted members only!",
		effect: function(state){
			$("#ui_meditation").show();
			$("#worker_meditators").show();
            reset_meditation();
			return state
		}
	},
	{
		id: "power_bonus_max",
		title: "Brewing Dance",
		trigger: function(state){return engine.project_done('greenhouse_manager') && engine.project_done('factory_manager')},
        cost: {focus: 40, teabags: 3000000},
		game_phase: 1,
		description: "Get more brewing done with your cult bonus.",
		effect: function(state){
			state['power_effect'] = 6;
			return state
		}
	},
	{
		id: "fertilizer_bonus_max",
		title: "Herb Circle",
		trigger: function(state){return engine.project_done('greenhouse_manager') && engine.project_done('factory_manager')},
        cost: {focus: 30, teabags: 4000000},
		game_phase: 1,
		description: "This fertilizer ritual increases effect of your cult on the herb production.",
		effect: function(state){
			state['fertilizer_effect'] = 7;
			return state
		}
	},
	{
		id: "more_workers2",
		title: "Add Two Workers",
		trigger: function(state){return engine.project_done('more_workers1_a_half')},
        cost: {focus: 50, teabags: 1500000},
		game_phase: 1,
		description: 'You gain control over some more "normal" humans.',
		effect: function(state){
			state['workers'] += 2;
            update_free_workers();
			return state
		}
	},
	{
		id: "focus_level4",
		title: "Library of Focus",
		trigger: function(state){return engine.project_done('meditation') && engine.project_done('more_focus_projects')},
        cost: {focus: 80, teabags: 2500000},
		game_phase: 1,
		description: "As your tea knowledge grows you can establish a library with even more tea ceremonies.",
		effect: function(state){
			state['focus_project_level'] = 3;
			return state
		}
	},	
	{
		id: "increase_monks2",
		title: "Spiritual Leader",
		trigger: function(state){return engine.project_done('focus_level4')},
        cost: {focus: 120, teabags: 5000000},
		game_phase: 1,
		description: "You become a spiritual leader and increase the number of monks.",
		effect: function(state){
			state['monks_max'] += 1;
			return state
		}
	},
	{
		id: "fertilizer_bonus_max2",
		title: "Fertilizer Ceremony",
		trigger: function(state){return engine.project_done('fertilizer_bonus_max')},
        cost: {focus: 90, teabags: 100000000},
		game_phase: 1,
		description: "Further increase the effects of your ceremonies on herb production.",
		effect: function(state){
			state['fertilizer_effect'] = 10;
			return state
		}
	},
	{
		id: "power_bonus_max2",
		title: "Brewing Ritual",
		trigger: function(state){return engine.project_done('power_bonus_max')},
        cost: {focus: 85, teabags: 100000000},
		game_phase: 1,
		description: "The effect of your cult bonus on the brewing process is increased.",
		effect: function(state){
			state['power_effect'] = 9;
			return state
		}
	},
	{
		id: "more_workers3",
		title: "Add Worker",
		trigger: function(state){return engine.project_done('more_workers2') && engine.project_done('meditation')},
        cost: {focus: 90, teabags: 2500000},
		game_phase: 1,
		description: 'You gain control over one more "normal" human.',
		effect: function(state){
			state['workers'] += 1;
            update_free_workers();
			return state
		}
	},
	{
		id: "increase_workers_both",
		title: "Break Room",
		trigger: function(state){return engine.project_done('more_workers2') && engine.project_done('fertilizer_bonus_max') && engine.project_done('power_bonus_max')},
        cost: {focus: 100, teabags: 5000000},
		game_phase: 1,
		description: "A break room increases the number of workers in both the farm and the brew house.",
		effect: function(state){
			state['farmers_max'] += 1;
			state['processors_max'] += 1;
			return state
		}
	},
	{
id: "meditation2",
		title: "Trance Meditation",
		trigger: function(state){return engine.project_done('focus_level4')},
        cost: {focus: 170, teabags: 200000000},
		game_phase: 1,
		description: "Your master's secret meditation techniques start to make more sense.",
		effect: function(state){
			state['meditators_max'] = 2;
            reset_meditation();
			return state
		}
	},
	{
id: "more_workers4",
		title: "Add Two Workers",
		trigger: function(state){return engine.project_done('more_workers3')},
        cost: {focus: 200, teabags: 100000000},
		game_phase: 1,
		description: 'You gain control over two more "normal" human.',
		effect: function(state){
			state['workers'] += 2;
            update_free_workers();
			return state
		}
	},
	{
		id: "meditation3",
		title: "Enlightenment Meditation",
		trigger: function(state){return engine.project_done('meditation2')},
        cost: {focus: 250, teabags: 1000000000},
		game_phase: 1,
		description: "You are now ready to reach the highest level of meditation.",
		effect: function(state){
			state['meditators_max'] = 3;
            reset_meditation();
			return state
		}
	},
	{
		id: "nirvana",
		title: "Nirvana",
		trigger: function(state){return engine.project_done('meditation3') && state["teabags"] >= 30000000000},
        cost: {focus: 700, teabags: 350000000000},
		game_phase: 1,
		description: "It's time for a change! Become master of your own tea-cult.",
		effect: function(state){
			switch_to_game_phase_2();
			return state
		}
	}
]
