class EnginePhase1 extends BaseEngine {
    constructor(save_state){
        super(save_state);

        this.focus_projects = [];
    }

    init_game(save_state){
        BaseEngine.prototype.init_game.call(this, save_state);

        this.reset_meditation();
        this.generate_level(true);
        this.update_free_workers();
    }

    generate_level(reset=true){
        var s = this.state;

        this.focus_projects = [];

        // Generate the initial focus_projects
        for(var i = 0; i < s['focus_projects_max']; i++){

            var project = this.generate_focus_project();
            this.focus_projects.push(project);

            $('#focus_project_slot' + i).empty();
            $('#focus_project_slot' + i).append(focus_project_template(project));
            $("#focus_project_slot" + i).foundation();
        }

        this.update_num_monks();
    }

    tick(){
        BaseEngine.prototype.tick.call(this);
        this.update_greenhouse();
        this.update_factory();
        this.update_monks();
        this.update_focus();
        this.update_season();
    }

    perform_all_actions(){
        BaseEngine.prototype.perform_all_actions.call(this);

        for (var i=0;i<this.action_queue.length;i++){
            var action = this.action_queue[i];
            switch (action[0]){
                case 'activate_focus_project':
                    this.activate_focus_project(action[1]);
                    break;
                case 'shift_worker':
                    this.shift_worker(action[1][0], action[1][1]);
                    this.update_free_workers();
                    break;
                case 'start_meditation':
                    this.start_meditation();
                    break;
                case 'try_meditation':
                    this.try_meditation(action[1]);
                    break;
            };
        };
        this.action_queue = [];
    }

    // Season
    update_season(){
        this.state['season_tick'] += 1;

        var season_state = this.state['season_tick'] / this.state['season_duration'];

        var remaining = season_state - Math.floor(season_state);
        $("#meter_season").css("width", (remaining * 100) + "%");

        this.state['season'] = Math.floor(season_state) % 4;

        // Show the warning during the first fall season
        if (this.state['season_tick'] == this.state['season_duration'] * 2.5){
            $("#season_popup").foundation('open');
        };
    }

    update_free_workers(){
        if (this.state['workers'] > 0){
            $("#free_workers_display").addClass("free_workers_highlight");
        } else {
            $("#free_workers_display").removeClass("free_workers_highlight");
        }
    }

    // GREENHOUSE (Herbs game_phase 1)
    update_greenhouse(){
        var s = this.state;

        // Use greenhouse speeds calc amount
        var amount = s['greenhouse_speeds'][s['greenhouse_speed']] * s['farmers'] * s['season_herbs'][s['season']];

        // Add boost from fertilizer
        amount *= 1. + s['fertilizer_effect'] * (s['fertilizer'] / s['fertilizer_max']);

        if (amount > 0){
            this.state['herbs'] += amount;
        };
    }

    // FACTORY (Teabags game_phase 1)
    update_factory(){
        var s = this.state;
        var amount = s['factory_speeds'][s['factory_speed']] * s['processors'];

        // Add boost and use up some power
        if (s['power'] > 0){
            amount *= 1. + s['power_effect'] * (s['power'] / s['power_max']);
        }

        if (amount > 0){
            amount = Math.min(this.state['herbs'], amount);
            this.state['herbs'] -= amount;
            this.state['teabags'] += amount * s['factory_efficiencies'][s['factory_efficiency']];
        };
    }


    update_monks(){
        var s = this.state;
        s['focus_action'] += s['monk_focus_action_generate'] * s['monks'];
        s['focus_action'] = Math.min(s['focus_action'], s['monks']);

        // Each monk has a separate progress bar

        // Loop through all monks
        for (var i=0;i<s['monks'];i++){
            if (s['focus_action'] >= i + 1){
                $("#monkfg" + i).css("height", "0%");
            } else if (s['focus_action'] >= i){
                let perc = (i + 1 - s['focus_action']) * 100;
                $("#monkfg" + i).css("height", perc + "%");
            } else {
                $("#monkfg" + i).css("height", "100%");
            }
        }
    }


    // FOCUS
    update_focus(){
        var s = this.state;

        // Update all focus projects
        var to_remove = [];
        for (var i=0;i<this.focus_projects.length;i++){
            var project = this.focus_projects[i];
            // Update lifetime
            project['lifetime'] -= 1;
            if (project['lifetime'] <= 0){
                to_remove.unshift(i);
                continue;
            }

            // Do the effect if possible
            if (project['active']){
                var eff = project['effect'];

                // Check if we can perform the effect
                var ok = true;
                for (var key in eff){
                    if (eff[key] < 0 && s[key] < -1 * eff[key]){
                        ok = false;
                        break
                    } else if (eff[key] > 0 && s[key] + eff[key] > s[key + '_max']){
                        ok = false;
                        break
                    }
                };

                if (ok){
                    for (var key in eff){
                        s[key] += eff[key];
                        if (key !== 'focus'){
                            s[key] = Math.min(s[key], s[key + '_max']);
                        }
                    }
                }
            }
        };

        // Remove project if lifetime is over
        for (var ind in to_remove){
            ind = to_remove[ind];
            var project = this.focus_projects[ind];

            // Generate new project to replace with
            var project = this.generate_focus_project();
            this.focus_projects.splice(ind, 1, project);

            var html = "<div class='fp-slot small-4 columns' id='focus_project_slot" + ind + "'>" + focus_project_template(project) + "</div>";
            $("#focus_project_slot" + ind).replaceWith(html);
            $("#focus_project_slot" + ind).foundation();
        }

        // Update the fertilizer and power (cult bonus)
        if (s['farmers'] > 0){
            var use = (s['fertilizer_use'] * s['greenhouse_uses'][s['greenhouse_use']]);
            s['fertilizer'] = Math.max(s['fertilizer'] - use, 0)
        }

        if (s['processors'] > 0){
            var use = (s['power_use'] * s['factory_uses'][s['factory_use']]);
            s['power'] = Math.max(s['power'] - use, 0)
        }

    }

    generate_focus_project(){

        var rand = Math.random();
        var s = this.state;
        var level = s['focus_project_level'];

        var possibilities = [];
        var all = [];
        for (var i=0;i<s['focus_projects'].length;i++){
            var project = s['focus_projects'][i];
            for (var j=0;j<project['level'].length;j++){
                if (project['level'][j].includes(level)){
                    all.push([i, j]);
                    if (project['rarity'][j] >= rand){
                        possibilities.push([i, j]);
                    }
                }
            }
        };

        var ind;
        if (possibilities.length == 0){
            ind = choice(all);
        } else {
            ind = choice(possibilities);
        }

        var proj = s['focus_projects'][ind[0]];
        var p = {
            'effect': {},
            'duration': proj['duration'][ind[1]],
            'focus_action': proj['focus_action'][ind[1]],
            'lifetime': randf(s['focus_project_disappear'][0], s['focus_project_disappear'][1]),
            'active': false,
            'ftype': 'generator',
            'id': Math.floor(Math.random() * 1e8).toString(),
        }

        Object.keys(proj['effect']).forEach(function(key) {
            p['effect'][key] = proj['effect'][key][ind[1]];
            if (p['effect'][key] < 0){
                p['ftype'] = 'converter';
            }
        });
        return p
    }

    activate_focus_project(id){
        // Get project
        var check = function(project) {
          return project['id'] == id;
        }
        var project = this.focus_projects.find(check);
        if (project){
            if (this.state['focus_action'] - project['focus_action'] >= 0 && !project['active']){
                project['active'] = true;
                this.state['focus_action'] -= project['focus_action'];
                $("#focus_swirl" + project['id']).show();
                $("#focus_project" + project['id']).css("color", "#ddd");
                $("#focus_monks" + project['id']).hide();
                $("#focus_btn" + project['id']).css("background-color", "#00000000");
                $("#focus_btn" + project['id']).css("border", "0px solid");
                project['lifetime'] = project['duration'];
            }
        }
    }

    // WORKER PLACEMENT
    shift_worker(type, amount){
        if (this.state['workers'] - amount >= 0){
            if (this.state[type] + amount >= 0 && this.state[type] + amount <= this.state[type + '_max']){
                this.state[type] += amount;
                this.state['workers'] -= amount;

                if (type == "monks") {
                    this.update_num_monks();
                }

                return true;
            }
        }
        return false;
    }

    update_num_monks(){
        for(var i=0;i<5;i++){
            if (i < this.state["monks"]){
                $("#monk" + i).show();
            } else {
                $("#monk" + i).hide();
            }
        }
    }

    // MEDITATION
    start_meditation(){
        var s = this.state;
        // Use 1 worker
        if (s['workers'] < 1 || s['meditation_active'] != -1 || s['focus'] < s['meditation_price']){
            return
        }

        s['workers'] -= 1;
        this.update_free_workers();
        s['focus'] -= s['meditation_price'];

        $("#meditation_target_container").show();

        // Set the target color
        var color = 0.2 + 0.6 * Math.random();
        s['meditation_target'] = color;
        s['meditation_current'] = [-1, -1, -1];

        var target = $("#meditation_target");
        target.css("margin-left", "" + 300 * color + "px");
        $("#meditation_try0").hide();
        $("#meditation_try1").hide();
        $("#meditation_try2").hide();

        target.width(s["meditation_width"] * 300 + "px");

        target.show();
        // $("#meditation_target_container").show();
        $("#start_meditation").hide();

        // Show price
        // var img = " <img src='static/focus_dark.png' class='img_project_resource'>"
        // $(".btn_try_meditation").html(s['meditation_price'] + img);

        // Start the first color cycle
        this.activate_meditation_box(0);
    }

    activate_meditation_box(id){
        this.state['meditation_active'] = id;

        // Start animation
        $('#meditation_box' + id).css('animation-play-state', 'running');
        $("#meditation_box_container" + id).show();
    }

    try_meditation(num_tries){
        var s = this.state;
        if (s['meditation_active'] == num_tries){

            // Stop animation
            var box = $('#meditation_box' + num_tries);
            box.css('animation-play-state', 'paused');

            // Update the current color
            var color = box.css("background-color");
            color = color.replace('rgb(', '').replace(')','' ).split(',').map(Number);
            var val = gradient_value(color);
            s['meditation_current'][num_tries] = val;

            if (num_tries == 0){
                $("#meditation_current").show();
            }

            // Hide the color box
            $("#btn_try_meditation" + num_tries).hide();
            var cur = this.update_meditation_current(val);
            
            $("#meditation_try" + num_tries).css("margin-left", 300 * val + "px").show();

            // Check if target is hit
            var diff = Math.abs(s['meditation_target'] - cur);

            if (diff < s['meditation_width'] / 2){

                var win_amount = s['meditation_win'] - (num_tries + 1) * s['meditation_try_cost'];
                s['focus'] += win_amount;

                $("#meditation_amount").html(win_amount);
                $(".meditation_box_container").hide();
                $("#meditation_win").show();

                // Reset in 3 seconds
                setTimeout(this.reset_meditation, 3000);

            } else if (num_tries !== 2) {
                this.activate_meditation_box(num_tries + 1);

            } else if (num_tries === 2) {
                $(".meditation_box_container").hide();
                $("#meditation_lose").show();

                // Reset in 3 seconds
                setTimeout(this.reset_meditation, 3000);
            }
        }
    }

    update_meditation_current(){
        var s = this.state;
        var num = 0;
        var tot = 0;
        for (var i=0;i<3;i++){
            var val = s['meditation_current'][i];
            if (val != -1){
                tot += val;
                num += 1;
            }
        }
        var color = tot / num;

        // Position
        var dist = color * 300;
        var el = $("#meditation_current");
        el.css("margin-left", "" + dist + "px");

        // Indicator color
        if (color > 0.5){
            el.css("background-color", "#303030");
        } else {
            el.css("background-color", "#ffe");
        }
        return tot / num;
    }

    reset_meditation() {
        // Reset the whole minigame (we need to use engine because this is sometimes called after timeout)

        // Return the workers
        if (engine.state['meditation_active'] !== -1){
            engine.state['workers'] += 1;
            engine.update_free_workers();
        }

        engine.state['meditation_active'] = -1;
        engine.state['meditation_current'] = [-1, -1, -1];

        $(".btn_try_meditation").show();
        $(".meditation_box_container").hide();
        $("#meditation_target").hide();
        $("#meditation_current").hide();
        $("#start_meditation").show();
        $("#meditation_win").hide();
        $("#meditation_lose").hide();
        $("#meditation_target_container").hide();

        
        // Write correct price in button
        var price = "1 Worker<br><br>" + engine.state['meditation_price'] + "<img src='static/focus_dark.png' style='width:24px'></img>";
        $("#start_meditation").html(price);
    }

    render_status_text(production_rates = false){
        var s = this.state;

        // Basic Resources
        $("#herbs1").html(num_to_mega(s["herbs"]));
        $("#teabags1").html(num_to_mega(s["teabags"]));
        $("#processors1").html(num_to_mega(s["processors"]));
        $("#farmers1").html(num_to_mega(s["farmers"]));
        $("#monks").html(num_to_mega(s["monks"]));
        $("#workers").html(num_to_mega(s["workers"]));
        $("#focus").html(num_to_mega(s["focus"]));

        $("#farmers_max").html(s["farmers_max"]);
        $("#processors_max").html(s["processors_max"]);
        $("#monks_max").html(s["monks_max"]);

        // Focus resources levels
        var fertilizer_perc = s['fertilizer'] / s['fertilizer_max'];
        $("#meter_fertilizer").css('width', 100.0 * fertilizer_perc + '%');

        var power_perc = s['power'] / s['power_max'];
        $("#meter_power").css('width', 100.0 * power_perc + '%');

        // Boni from focus projects
        var l = Math.round(100 * s['power_effect'] * power_perc);
        $("#factory_bonus").html("+" + l + "%");

        var l = Math.round(100 * s['fertilizer_effect'] * fertilizer_perc);
        $("#farm_bonus").html("+" + l + "%");

        // // Focus projects & progress bar
        for (var ind in this.focus_projects){
            var project = this.focus_projects[ind];

            var perc = 100.0 * project['lifetime'];
            if (!project['active']){
                perc /= s['focus_project_disappear'][1];
            } else {
                perc /= project['duration'];
            }
        }

        // Production Rates
        if (production_rates !== false){
            $("#herbs_rate1").html(num_to_mega(production_rates[0]));
            $("#teabags_rate1").html(num_to_mega(production_rates[1]));
        }

        // Season
        var current_season = ['spring', 'summer', 'fall', 'winter'][s['season']];
        $("#season").html(current_season);
    }

    render_upgradable_text(){
        var s = this.state;
        var p;
        // Greenhouse & Factory upgrades
        var up = ['greenhouse_speed', 'greenhouse_use', 'factory_speed', 'factory_efficiency', 'factory_use'];
        for (p in up){
            p = up[p];
            if (p === 'factory_efficiency'){
                var t = 100 * s['factory_efficiencies'][s[p]];
                t = Math.round(t);
                t = t + "%";
                $("#" + p).html(t);
            }
            else if (p.endsWith("_use")){
                var t = 100 * s[p + "s"][s[p]];
                t = t + "%";
                $("#" + p).html(t);
            }
            else {
                $("#" + p).html(num_to_mega(s[p]));
            }
            $("#price_" + p).html(this.get_price(p));
        }
    }
}
