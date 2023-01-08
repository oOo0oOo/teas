class BaseEngine{
    constructor(state){
        this.state = false;

        // Keep track of resources to calculate production rates [Mint, Teabags]
        this.last_resources = [0, 0];
        this.last_time = 0;

        // Time and user action queue
        this.action_queue = [];
        this.time = 0;
    }

    init_game(save_state){
        var s = save_state;
        this.state = s['state'];
        var old_tb = this.state['teabags'];
        var old_focus = this.state['focus'];

        if (s['projects'][0] == 2){
            $("#ui_projects").show();
        }

        this.farmers = s['farmers'];
        this.field = s['field'];
        this.composts = s['composts'];
        this.focus_projects = s['focus_projects'];

        // Give a lot of cash, then execute all necessary projects
        this.state['teabags'] = 1e10;
        this.state['focus'] = 1e10;

        for (var i=0;i<s['projects'].length;i++){
            var project = projects[i];
            var status = s['projects'][i];
            if (project['game_phase'] == this.state['game_phase']) {
                if (status == 1){
                    $("#project_" + project["id"]).show();
                } else if (status == 2){
                    this.state = project.effect(this.state);
                    $("#project_" + project["id"]).hide();
                }
            } else {
                $("#project_" + project["id"]).hide();
            }
            projects[i]['status'] = status;
        }

        this.state['teabags'] = old_tb;
        this.state['focus'] = old_focus;
    }

    tick(){
        var production_rates = (this.time % (1000 / TICK_TIME)) == 0;
        if (production_rates){
            var t = Date.now();
            var duration = (t - this.last_time) / 1000;
            production_rates = [
                Math.round(10.0 * ((this.state['herbs'] - this.last_resources[0]) / duration)) / 10.0,
                Math.round(10.0 * ((this.state['teabags'] - this.last_resources[1]) / duration)) / 10.0,
            ];

            this.last_resources = [this.state['herbs'], this.state['teabags']];
            this.last_time = t;

            // Also in the slow update we do the buy btns
            if (this.state['game_phase'] == 0){
                this.update_buy_btns(production_rates);
            }
            this.update_projects();
            this.render_upgradable_text();
        }

        this.perform_all_actions();
        this.render_status_text(production_rates);


        // Save periodically
        if ((this.time % 600) == 0 && this.time !== 0){
            this.save_game();
        }

        this.time += 1;
    }

    // USER ACTIONS
    add_action(type, params){
        this.action_queue.push([type, params]);
    }

    perform_all_actions(){
        for (var i=0;i<this.action_queue.length;i++){
            var action = this.action_queue[i];
            switch (action[0]){
                case 'buy_upgrade':
                    this.buy_upgrade(action[1]);
                    break;
                case 'buy_project':
                    this.buy_project(action[1]);
                    break;
            };
        };
    }

    // PROJECTS & UPGRADES
    update_projects(){
        for (var i=0; i < projects.length; i++){
            var project = projects[i];

            // Add a project
            var obj = $("#project_" + project["id"]);
            if (project['status'] == 0 && project.trigger(this.state)){
                project.status = 1;
                obj.show();
            } else if(project['status'] == 1){
                if (project.cost(this.state)){
                    if (!obj.hasClass('buyable')){
                        obj.addClass('buyable');
                    }
                } else if (obj.hasClass('buyable')){
                    obj.removeClass('buyable');
                }
            }
        }
    }

    buy_project(id){
        var project = projects.find(x => x.id === id);
        if (project.cost(this.state)){
            this.state = project.effect(this.state);
            project.status = 2;
            $("#project_" + id).hide();
        }
        this.render_status_text();
        this.update_projects();
        this.render_upgradable_text();
    }

    buy_upgrade(type, free=false){
        var s = this.state;

        // Can we still upgrade?
        if (s[type] >= s['price_' + type].length){
            return false;
        }

        // Enough resources?
        var price;
        if (free){
            price = 0;
        } else {
            price = s['price_' + type][s[type]];
        }
        var account = s['teabags'];
        if (s['game_phase'] == 2){
            account = s['focus'];
        }

        if (account < price){
            return false;
        }

        // Do the upgrade
        if (s['game_phase'] == 2){
            s['focus'] -= price;
        } else {
            s['teabags'] -= price;
        }
        s[type] += 1;

        if (type == 'garden_size'){
            // Need to regenerate the level
            this.generate_level();
        }

        this.render_status_text(false);
        this.render_upgradable_text();
        this.update_projects();
        return true
    }

    get_price(param, focus=false){
        var price = this.state["price_" + param][this.state[param]];
        if (price) {
            if (focus){
                return num_to_mega(price) + " F";
            } else {
                return num_to_mega(price) + ' <img src="static/tea_icon.png" class="tea-icon">';
            }
        }
        else {
            return 'MAX'
        }
    }

    serialize(){
        var proj = [];
        for (var i=0;i<projects.length;i++){
            var p = projects[i];
            proj.push(p['status']);
        };

        var s = {
            'state': this.state,
            'farmers': this.farmers,
            'composts': this.composts,
            'field': this.field,
            'focus_projects': this.focus_projects,
            'projects': proj
        };
        return s
    }

    save_game(){
        var s = this.serialize();
        localStorage.setItem("teabagSave",JSON.stringify(s));
        console.log("Saved Game!");
    }
}
