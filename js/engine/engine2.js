class EnginePhase2 extends BaseEngine {
    constructor(save_state){
        super(save_state);
        this.current_ceremony;
        this.current_teapet;
    }

    init_game(save_state){
        BaseEngine.prototype.init_game.call(this, save_state);
        this.generate_level()
    }

    generate_level(){
        var s = this.state;
        $("#ui_map").hide();
        $("#ui_selection").hide();
        $("#ui_fight").hide();
        $("#ui_reward").hide();

        switch(s['ceremony_state']){
            case 0:
                $("#ui_map").show();
                break;
            case 1:
                $("#ui_selection").show();
                this.render_selection();
                break;
            case 2:
                $("#ui_fight").show();
                this.render_utensils();
                break;
            case 3:
                $("#ui_reward").show();
                break;
        }


        this.update_ceremony();

        this.current_ceremony = ceremonies[s['current_ceremony']];
        this.render_ceremony_requirements();
        this.render_ceremonies();
    }

    tick(){
        BaseEngine.prototype.tick.call(this);
        this.update_teabageria();
    }

    perform_all_actions(){
        BaseEngine.prototype.perform_all_actions.call(this);

        for (var i=0;i<this.action_queue.length;i++){
            var action = this.action_queue[i];
            switch (action[0]){
                case 'pick_bag':
                    this.pick_bag();
                    break;
                case 'start_ceremony':
                    this.start_ceremony();
                    break;
                case 'start_selection':
                    this.start_selection(action[1]);
                    break;
                case 'return_to_map':
                    this.return_to_map();
                    break;
                case 'abort_ceremony':
                    this.abort_ceremony();
                    break;
                case 'select_teapet':
                    this.select_teapet(action[1]);
                    break;
                case 'cancel_selection':
                    this.return_to_map();
                    break;
            };

        };
        this.action_queue = [];
    }

    // TEABAGERIA
    update_teabageria(){
        var s = this.state;

        // Give some teabags
        var amount = s['teabageria_speeds'][s['teabageria_speed']];
        amount *= 1. + s['teabageria_effect'] * (s['teabageria'] / s['teabageria_max']);

        if (amount > 0){
            this.state['teabags'] += amount;
        };

        // Update the bonus
        var use = (s['teabageria_base_use'] * s['teabageria_uses'][s['teabageria_use']]);
        var new_tb = s['teabageria'] - use;
        if (new_tb > s['teabageria_max']){
            s['teabageria'] = s['teabageria_max'];
        } else if (new_tb >= 0){
            s['teabageria'] = new_tb;
        } else {
            s['teabageria'] = 0;
        }
    }

    // // GAME PHASE 2 (Bag Building)
    start_selection(ceremony_id) {
        if (this.state['ceremony_state'] == 0){
            this.state['ceremony_state'] = 1;

            // Preload ceremony
            this.state['current_ceremony'] = ceremony_id;
            this.current_ceremony = ceremonies[ceremony_id];

            this.render_ceremony_requirements();
            this.render_selection();
            $("#ui_map").hide();
            $("#ui_selection").show();
        }
    }

    select_teapet(ind){
        var s = this.state;
        var sel_ind = this.state['selected'].indexOf(ind);
        if (this.state['ceremony_state'] == 1){
            // Remove the teapet
            if (sel_ind >= 0) {
                this.state['selected'].splice(sel_ind, 1);
                $("#teapet" + ind).removeClass('teapet-selected');

            // Add the teapet if max number is not reached
            } else if (this.state['selected'].length < this.state['selection_max']){
                this.state['selected'].push(ind)
                $("#teapet" + ind).addClass('teapet-selected');
            }

        // Trigger utensil
        } else if (this.state['ceremony_state'] == 2){
            var tp = teapets[s['zoo'][s['selected'][sel_ind]]];
            if (tp.type === 'utensil'){
                if (tp.possible(s)){
                    this.state = tp.effect(s);
                    this.update_ceremony();

                    var v = this;
                    setTimeout(function() { v.finish_pick(); }, 1500);
                }
            }
        }
    }

    start_ceremony() {
        var s = this.state;
        if (s['ceremony_state'] == 1){
            this.state['ceremony_state'] = 2;
            this.state['picked'] = [];
            this.state['fire'] = 0;
            this.state['water'] = 0;
            this.state['nature'] = 0;
            this.state['explosion'] = 0;

            this.update_ceremony();
            this.render_utensils();

            $("#ui_selection").hide();
            $("#ui_fight").show();
            $("#picked_teapet_text").html("<br>");
            $("#ceremony_running").hide();
            $("#picked_teapet_img").attr({ "src": "" });
        }
    }

    abort_ceremony() {
        this.state['teabags'] *= 0.5;
        this.state['moral'] -= 1;
        var txt = 'Lol! You just lost ' + this.state['teabags'] + ' teabags...'
        this.end_fight(txt);
    }

    end_fight(txt) {
        if (this.state['ceremony_state'] == 2){
            this.state['ceremony_state'] = 3;
            $("#reward_text").html(txt);
            $("#ui_fight").hide();
            $("#ui_reward").show();
        }
    }

    return_to_map() {
        this.state['ceremony_state'] = 0;
        $("#ui_selection").hide();
        $("#ui_fight").hide();
        $("#ui_reward").hide();
        $("#ui_map").show();
    }

    pick_bag(){
        var s = this.state;
        // Select a random bag_item
        var ind;
        var teapet;
        var l = this.state['selected'].length;
        var i = 0;
        while (true){
            i += 1;
            if (i > 25){break};
            var e = Math.floor(Math.random()*l);
            if (!this.state['picked'].includes(e)){
                teapet = teapets[s['zoo'][s['selected'][e]]];
                if (teapet.type !== 'utensil'){
                    ind = e;
                    break;
                }
            }
        }

        if (!teapet){
            console.log('not found');
            return
        }

        var strength = Math.random();
        this.current_teapet = teapet;
        this.state['picked'].push(ind);

        // The teapet image
        $("#picked_teapet_img").attr({ "src": "static/img/teapets/" + teapet.icon + ".png" });

        $("#picked_teapet_text").html(teapet.title)

        $("#pick_bag").hide();
        $("#abort_ceremony").hide();

        this.start_ceremony_animation(strength);
    }

    finish_pick(){
        $("#waterfall").hide();
        var s = this.state;
        $("#ceremony_running").hide();

        this.update_ceremony();

        $("#pick_bag").show();
        $("#abort_ceremony").show();

        // Exploded
        if (s['explosion'] > s['explosion_max']){
            this.state['moral'] -= 10;
            this.end_fight('EEEXXXXPLLLOOOOOOODE!');
        } else {
            // Check if is fulfilled
            var condition = this.current_ceremony['condition'];
            var keys = Object.keys(condition);
            var success = true;
            for (const k in keys){
                var key = keys[k]
                if (s[key] < condition[key]){
                    success = false;
                    break;
                }
            };
            if (success){
                this.state = this.current_ceremony.effect(this.state);

                var txt = 'YESSSSSS! SUCH A WINNER!';

                if (s['nature'] > 0){
                    this.state['teabageria'] += s['nature'];
                    txt += '<br><br>Gained ' + s['nature'] + ' nature bonus!'
                }

                if (s['fire'] > s['nature'] && s['fire'] > s['water']){
                    this.state['moral'] += 10;
                    txt += '<br><br>Fire wins: Moral bonus!'
                }

                if (s['water'] > s['nature'] && s['water'] > s['fire']){
                    this.state['focus'] += 10;
                    txt += '<br><br>Water wins: Extra focus points!'
                }

                this.end_fight(txt);

            }
        }

    }

    start_ceremony_animation(strength){
        $("#ceremony_running").show();
        var v = this;

        var tp = $("#picked_teapet");

        // Initial state of the teapet
        tp.css("left", '-10%');
        tp.css("top", '40%');
        tp.css("transform", 'scale(0.25)');
        tp.removeClass("animate0").removeClass("animate1").removeClass("animate2");

        // Teapet moves in
        tp.animate({left: '40%'}, 1100, "swing",
            function(){
                v.animate_ceremony2(strength);
        });


        // setTimeout(function() { v.finish_pick(); }, 3000);
    }

    animate_ceremony2(strength){
        // Water falls down and teapets swells
        var tp = $("#picked_teapet");
        var anim_strength = Math.floor(strength * 3);
        if (anim_strength===3){anim_strength=2};
        tp.addClass('animate' + anim_strength);
        var v = this;
        $("#waterfall").show();

        // Perform the effect
        this.state = this.current_teapet.effect(this.state, strength);

        // Apply moral
        var s = this.state;
        var moral_effect = (s['moral'] / 100) * (s['moral_effect_max'] - s['moral_effect_min']) + s['moral_effect_min'];
        this.state['explosion'] += moral_effect;

        this.update_ceremony();
        setTimeout(function() { v.finish_pick(); }, 3000);
    }

    update_ceremony() {
        var s = this.state;
        $("#fire").html(num_to_mega(s["fire"]));
        $("#nature").html(num_to_mega(s["nature"]));
        $("#water").html(num_to_mega(s["water"]));
        // $("#explosion").html(num_to_mega(s["explosion"]));

        var expl = s['explosion'] / s['explosion_max'];
        var expl = Math.min(expl, 1);
        $("#meter_explosion").css('width', 100.0 * expl + '%');
    }

    render_ceremonies() {
        var s = this.state;
        var content = '';
        for (var i in ceremonies){
            var ceremony = ceremonies[i];
            ceremony.list_id = i;
            content += ceremony_template(ceremony);
        }
        $("#ceremonies").html(content);

        $(document).foundation();
    }

    render_selection() {
        var s = this.state;
        var content = '';
        for (var i in s['zoo']){
            var teapet = teapets[s['zoo'][i]];
            teapet.zoo_id = i;
            content += teapet_template(teapet);
        }
        $("#selection_container").html(content);

        // Mark all selected teapets
        for (var i of this.state['selected']){
            $("#teapet" + i).addClass('teapet-selected');
        }

        $(document).foundation();
    }

    render_ceremony_requirements() {
        // The ceremony requirements
        var condition = this.current_ceremony.condition;
        for (var key of ['fire', 'nature', 'water']) {
            if (condition.hasOwnProperty(key)) {
                $("." + key + "_require").html(condition[key]);
            } else {
                $("." + key + "_require").html('0');
            }
        }
        // $(".explosion_max").html(this.state['explosion_max']);
    }

    render_utensils() {
        var content = '';
        for (var ind of this.state['selected']){
            var tp = teapets[this.state['zoo'][ind]];
            if (tp.type == 'utensil'){
                tp.zoo_id = ind;
                content += teapet_template(tp);
            }
        };
        $("#utensil_container").html(content)
    }


    // RENDERING
    render_status_text(production_rates = false){
        var s = this.state;

        $("#teabags2").html(num_to_mega(s["teabags"]));
        $("#focus2").html(num_to_mega(s["focus"]));

        $("#moral").html(num_to_mega(s["moral"]));

        // Production Rates
        if (production_rates !== false){
            $("#herbs_rate2").html(num_to_mega(production_rates[0]));
            $("#teabags_rate2").html(num_to_mega(production_rates[1]));
        }

        // Focus resources levels
        var teabageria_perc = s['teabageria'] / s['teabageria_max'];
        $("#meter_teabageria").css('width', 100.0 * teabageria_perc + '%');

    }

    render_upgradable_text(){
        var s = this.state;
        var p;
        // Greenhouse & Factory upgrades
        var up = ['teabageria_speed', 'teabageria_use'];
        for (p in up){
            p = up[p];
            if (p.endsWith("_use")){
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
