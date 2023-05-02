import { BaseEngine } from "./base.js";
import { num_to_mega, gradient_value, randf, choice, to_css_id } from "../utils";
import { engine } from "../game.js";  // TODO: remove this dependency


export class EnginePhase1 extends BaseEngine {
    constructor(save_state){
        super(save_state);

        this.focus_projects = [];

        // Compile the template for the focus projects
        var source = $("#focus-project-template").html();
        this.focus_project_template = Handlebars.compile(source);
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

            $('#focus-project-slot' + i).empty();
            $('#focus-project-slot' + i).append(this.focus_project_template(project));
            $("#focus-project-slot" + i).foundation();
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
                case 'start_practice':
                    this.start_meditation(true);
                    break;
                case 'try_meditation':
                    this.try_meditation(action[1]);
                    break;
                case 'refresh_focus_project':
                    this.refresh_focus_project();
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
        $("#meter-season").css("width", (remaining * 100) + "%");

        this.state['season'] = Math.floor(season_state) % 4;

        // Show the warning during the first fall season
        if (this.state['season_tick'] == this.state['season_duration'] * 2.5){
            $("#season-popup").foundation('open');
        };
    }

    update_free_workers(){
        if (this.state['workers'] > 0){
            $("#free-workers-display").addClass("free-workers-highlight");
        } else {
            $("#free-workers-display").removeClass("free-workers-highlight");
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

        // Loop through all monks
        for (var i=0;i<s['monks'];i++){
            if (s['focus_action'] >= i + 1){
                $("#monkfg" + i).css("height", "0%");
                $("#full-charge" + i).css("opacity", "1");
            } else if (s['focus_action'] >= i){
                let perc = (i + 1 - s['focus_action']) * 100;
                $("#monkfg" + i).css("height", perc + "%");
                $("#full-charge" + i).css("opacity", "0");
            } else {
                $("#monkfg" + i).css("height", "100%");
                $("#full-charge" + i).css("opacity", "0");
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
            } else {
                // Check if this project is possible now
                if (s['focus_action'] >= project['focus_action']){
                    $("#focus-btn" + project["id"]).removeClass("inactive");
                } else {
                    $("#focus-btn" + project["id"]).addClass("inactive");
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

            var html = "<div class='fp-slot small-4 columns' id='focus-project-slot" + ind + "'>" + this.focus_project_template(project) + "</div>";
            $("#focus-project-slot" + ind).replaceWith(html);
            $("#focus-project-slot" + ind).foundation();
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
        var s = this.state;
        var level = s['focus_project_level'];

        // The temple leader can change the rarities of the projects
        var leader_focus = "none";
        if (s['leaders'] > 0 && this.project_done('temple_leader_focus')) {
            // Get the value of the leader_strategy input radio group
            leader_focus = $("input[name='leader_strategy']:checked").val();
        }

        var rand = Math.random();

        var possibilities = [];
        var all = [];
        for (var i=0;i<s['focus_projects'].length;i++){
            var project = s['focus_projects'][i];

            var always_select = false;
            if (leader_focus !== "none"){
                // Check if any of the effects of the project are the leader focus
                // (They are always selected)
                for (var key in project['effect']){
                    if (key == leader_focus && project['effect'][key][0] > 0){
                        always_select = true;
                        break;
                    }
                }
            }

            for (var j=0;j<project['level'].length;j++){
                if (project['level'][j].includes(level)){
                    all.push([i, j]);

                    if (always_select){
                        // Always select
                        possibilities.push([i, j]);
                    } else if (leader_focus != "none"){
                        // Make less likely
                        if (project['rarity'][j] * 0.6 >= rand){
                            possibilities.push([i, j]);
                        };
                    } else if (project['rarity'][j] >= rand){
                        // Normal probability
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
                $("#focus-swirl" + project['id']).show();
                $("#focus-project" + project['id']).css("color", "#ddd");
                $("#focus-monks" + project['id']).hide();
                $("#focus-btn" + project['id']).css("background-color", "#00000000");
                $("#focus-btn" + project['id']).css("border", "0px solid");
                project['lifetime'] = project['duration'];
            }
        }
    }

    refresh_focus_project(){
        // Check if enough focus points
        if (this.state['focus'] < this.state['focus_project_refresh_cost']){
            return;
        }

        this.state['focus'] -= this.state['focus_project_refresh_cost'];

        // Remove two random focus projects (set lifetime to 0)
        for (var i=0;i<2;i++){
            var ok = false;
            var ind;
            for (var i=0;i<100;i++){
                ind = Math.floor(Math.random() * this.focus_projects.length);
                var project = this.focus_projects[ind];
                if (!project['active'] && project['lifetime'] > 0){
                    ok = true;
                    break
                }
            }

            if (ok){
                var project = this.focus_projects[ind];
                project['lifetime'] = 0;
            }
        }
    }

    // WORKER PLACEMENT
    shift_worker(type, amount){
        if (this.state['workers'] - amount >= 0){
            if (this.state[type] + amount >= 0 && this.state[type] + amount <= this.state[type + '_max']){
                
                // Only allow shifting meditators if meditation is not active
                if (type == "meditators" && this.state['meditation_active'] != -1){
                    return false;
                }
                
                this.state[type] += amount;
                this.state['workers'] -= amount;

                if (type == "monks") {
                    this.update_num_monks();
                }

                // Update the meditation box depending on the number of meditators
                if (type == "meditators"){
                    if (this.state['meditators'] > 0){
                        $("#start-meditation").show();
                        $("#meditation-inactive").hide();

                        // Update the meditation price
                        var price = this.state['meditation_price'][this.state['meditators'] - 1];
                        $("#meditation-price").html(price);

                    } else {
                        $("#start-meditation").hide();
                        $("#meditation-inactive").show();
                    }
                }

                // Only show the leader box if you have a leader
                if (type == "leaders"){
                    if (this.state['leaders'] > 0){
                        $(".leader-box").show();
                    } else {
                        $(".leader-box").hide();
                    }
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
    start_meditation(practice=false){
        var s = this.state;
        if (!practice && s['focus'] < s['meditation_price'][s['meditators'] - 1]){
            return
        }

        if (!practice){
            s['focus'] -= s['meditation_price'][s['meditators'] - 1];
        }

        s['meditation_practice'] = practice;

        $("#meditation-target-container").show();

        // Set the target color
        var color = 0.2 + 0.6 * Math.random();
        s['meditation_target'] = color;
        s['meditation_current'] = [-1, -1, -1];

        var target = $("#meditation-target");
        target.css("margin-left", "" + 300 * color + "px");
        $("#meditation-try0").hide();
        $("#meditation-try1").hide();
        $("#meditation-try2").hide();

        target.width(s["meditation_width"][s["meditators"] - 1] * 300 + "px");

        target.show();
        $("#start-meditation").hide();

        // Start the first color cycle
        this.activate_meditation_box(0);
    }

    activate_meditation_box(id){
        this.state['meditation_active'] = id;

        // Start animation
        $('#meditation-box' + id).css('animation-play-state', 'running');
        $("#meditation-box-container" + id).show();
    }

    try_meditation(num_tries){
        var s = this.state;
        if (s['meditation_active'] == num_tries){

            // Stop animation
            var box = $('#meditation-box' + num_tries);
            box.css('animation-play-state', 'paused');

            // Update the current color
            var color = box.css("background-color");
            color = color.replace('rgb(', '').replace(')','' ).split(',').map(Number);
            var val = gradient_value(color);
            s['meditation_current'][num_tries] = val;

            if (num_tries == 0){
                $("#meditation-current").show();
            }

            if (num_tries >= 1){
                var line = $("#meditation-line");
                // Draw the line from the lowest try to the highest
                var arr = s['meditation_current'].slice(0, num_tries + 1);
                var min = Math.min(...arr);
                var max = Math.max(...arr);
                var left = 300 * min;
                var right = 300 * max;
                line.css("margin-left", left + "px");
                line.width(right - left + "px");
                line.show();
            }

            // Hide the monk on the button
            $("#meditation-try-monk" + num_tries).hide();

            // Add the done class to the box
            box.addClass("done");

            // Hide the color box
            $("#btn-try-meditation" + num_tries).hide();
            var cur = this.update_meditation_current(val);
            
            $("#meditation-try" + num_tries).css("margin-left", 300 * val + "px").show();

            // Check if target is hit
            var diff = Math.abs(s['meditation_target'] - cur);

            if (diff < s['meditation_width'][s["meditators"] - 1] / 2){

                var win_amount = s['meditation_win'][s['meditators'] - 1] - (num_tries + 1) * s['meditation_try_cost'][s['meditators'] - 1];
                
                if(s['meditation_practice']){
                    win_amount = 0;
                };
                
                s['focus'] += win_amount;

                $("#meditation-amount").html(win_amount);
                $(".meditation-box-container").hide();
                $("#meditation-win").show();

                // Reset in 3 seconds
                setTimeout(this.reset_meditation, 3000);

            } else if (num_tries !== 2) {
                this.activate_meditation_box(num_tries + 1);

            } else if (num_tries === 2) {
                $(".meditation-box-container").hide();
                $("#meditation-lose").show();

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
        var el = $("#meditation-current");
        el.css("margin-left", "" + dist + "px");

        return tot / num;
    }

    reset_meditation() {
        // Reset the whole minigame (we need to use engine because this is sometimes called after timeout)
        if (engine.state['meditators'] > 0){
            $("#start-meditation").show();
            $("#meditation-inactive").hide();

            // Update the meditation price
            var price = engine.state['meditation_price'][engine.state['meditators'] - 1];
            $("#meditation-price").html(price);
        } else {
            $("#start-meditation").hide();
            $("#meditation-inactive").show();
        }

        engine.state['meditation_active'] = -1;
        engine.state['meditation_current'] = [-1, -1, -1];

        $(".btn-try-meditation").show();
        $(".meditation-box-container").hide();
        $("#meditation-target").hide();
        $("#meditation-current").hide();
        $("#meditation-win").hide();
        $("#meditation-lose").hide();
        $("#meditation-target-container").hide();

        // Show all the monks
        $("#meditation-try-monk0").show();
        $("#meditation-try-monk1").show();
        $("#meditation-try-monk2").show();

        // Hide the meditation line
        $("#meditation-line").hide();

        // Remove done class from all meditation boxes
        $(".meditation-box").removeClass("done");
        
        // Write correct price in button
        $("#meditation-price").html(engine.state['meditation_price'][engine.state['meditators'] - 1]);
    }

    render_status_text(production_rates = false){
        var s = this.state;

        // Basic Resources
        $("#herbs1").html(num_to_mega(s["herbs"]));
        $("#teabags1").html(num_to_mega(s["teabags"]));
        $("#processors1").html(num_to_mega(s["processors"]));
        $("#farmers1").html(num_to_mega(s["farmers"]));
        $("#monks").html(num_to_mega(s["monks"]));
        $("#meditators").html(num_to_mega(s["meditators"]));
        $("#leaders").html(num_to_mega(s["leaders"]));
        $("#workers").html(num_to_mega(s["workers"]));
        $("#focus").html(num_to_mega(s["focus"]));

        $("#farmers-max").html(s["farmers_max"]);
        $("#processors-max").html(s["processors_max"]);
        $("#monks-max").html(s["monks_max"]);
        $("#meditators-max").html(s["meditators_max"]);
        $("#leaders-max").html(s["leaders_max"]);

        // Focus resources levels
        var fertilizer_perc = s['fertilizer'] / s['fertilizer_max'];
        $("#meter-fertilizer").css('width', 100.0 * fertilizer_perc + '%');

        var power_perc = s['power'] / s['power_max'];
        $("#meter-power").css('width', 100.0 * power_perc + '%');

        // Boni from focus projects
        var l = Math.round(100 * s['power_effect'] * power_perc);
        $("#factory-bonus").html("+" + l + "%");

        var l = Math.round(100 * s['fertilizer_effect'] * fertilizer_perc);
        $("#farm-bonus").html("+" + l + "%");

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
            $("#herbs-rate1").html(num_to_mega(production_rates[0]));
            $("#teabags-rate1").html(num_to_mega(production_rates[1]));
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
                $("#" + to_css_id(p)).html(t);
            }
            else if (p.endsWith("_use")){
                var t = 100 * s[p + "s"][s[p]];
                t = t + "%";
                $("#" + to_css_id(p)).html(t);
            }
            else {
                $("#" + to_css_id(p)).html(num_to_mega(s[p]));
            }
            $("#price-" + to_css_id(p)).html(this.get_price(p));
        }
    }
}
