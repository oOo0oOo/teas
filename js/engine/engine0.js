class EnginePhase0 extends BaseEngine {
    constructor(save_state){
        super(save_state);

        this.farmers = [];
        this.composts = [];
        this.field = [];
        this.hq_coords = [0, 0];
        this.tile_size = 0;
        this.num_tiles = 0;
    }

    init_game(save_state){
        BaseEngine.prototype.init_game.call(this, save_state);

        // Composts
        if (this.state['game_phase'] == 0){
            var set = this.state['compost_set_active'];
            for (var i=0;i<3;i++){
                // Check if we have already fullfilled the project. This feels hacky...
                if (this.project_done("compost" + i)){
                    // hide all ui elements
                    var el = ["progress_compost", "btn_compost", "btn_set_compost", "compost_active", "price_compost"];
                    for (var j=0;j<3;j++){
                        $("#" + el[j] + i).hide();
                    }

                    // Show selectively
                    if (this.state['compost_ready'][i]){
                        $("#btn_set_compost" + i).show();
                    } else if (this.state['compost_timer'][i] > 0){
                        $("#progress_compost" + i).show();
                    } else if (set == i) {
                        $("#compost_active" + i).show();
                    } else {
                        $("#btn_compost" + i).show();
                        $("#price_compost" + i).show();
                    }
                }
            }
        }

        this.generate_level(true, true)

    }
    generate_level(give_extra_herbs=false, reset=true){
        var s = this.state;

        if (reset){
            this.farmers = [];
            // this.composts = [];
            this.field = [];
        }

        // Update the global size variables
        this.num_tiles = s['num_tiles'][s['garden_size']];

        // Resize the canvas
        var width = $("#map_container0").width();
        this.tile_size = width / this.num_tiles;
        width = this.tile_size * this.num_tiles;

        $("#map_container0").width(width);
        canvas.width = width;
        canvas.height = width;

        if (reset){
            // Give some extra herbs in the beginning
            var factor = 0.2;
            if (give_extra_herbs){
                factor = 0.5
            }

            var middle = this.num_tiles / 2;


            // Landscape
            for(var i = 0; i < this.num_tiles; i++){
                this.field.push(new Array());
                for(var j = 0; j < this.num_tiles; j++){
                    // Create terrain
                    var dist = Math.sqrt((i-middle)**2 + (j-middle)**2) / this.num_tiles;
                    this.field[i].push(factor + factor * dist * Math.random());
                }
            }

            // HQ
            var x = Math.floor(this.num_tiles * 0.7 + (this.num_tiles / 8) * (Math.random() - 0.5));
            var y = Math.floor(this.num_tiles * 0.7 + (this.num_tiles / 8) * (Math.random() - 0.5));
            this.hq_coords = [x, y];
            this.field[x][y] = 2;

            // Rivers
            var length_river1 = Math.floor(0.55 * this.num_tiles);
            var coords = [Math.round(0.3 * this.num_tiles), 0];
            var moves = [
                [0, 1], [0, 1], [0, 1], [0, 1], [0, 1],
                [1, 0],
                [-1, 0]
            ]

            // Down river
            var river = this.make_river(coords, moves, length_river1);
            for (var i = 0; i < river.length; i++){
                this.field[river[i][0]][river[i][1]] = 3;
            }

            // Side river
            if (this.num_tiles > 12){
                var side_start = Math.floor(0.8 * length_river1);
                var length_river2 = Math.floor(0.3 * this.num_tiles);
                var coords = river[side_start];
                if (coords != undefined){
                    coords[0] += 1;
                    var moves = [
                        [1, 0], [1, 0], [1, 0], [1, 0], [1, 0],
                        [0, -1],
                        [0, 1]
                    ]
                    var river = this.make_river(coords, moves, length_river2);
                    for (var i = 0; i < river.length; i++){
                        this.field[river[i][0]][river[i][1]] = 3;
                    }
                }
            }

            // Place all previously owned composts at a random valid location
            this.composts.forEach((item, ind) => {
                while(true){
                    var x = randrange(0, this.num_tiles);
                    var y = randrange(0, this.num_tiles);
                    if (this.valid_coords([x, y])){
                        this.composts[ind][0][0] = x;
                        this.composts[ind][0][1] = y;
                        break;
                    }
                }
            });
        }
        this.update_strategy();
        this.render_all_tiles();
    }

    tick(){
        BaseEngine.prototype.tick.call(this);
        var render_field = (this.time % this.state['farmer_delay']) == 0;

        if (render_field){
            this.update_farmers();
            this.update_constant_growth();
        }

        this.update_auto();
        this.update_compost_ui();
        this.update_compost();
        if (render_field){
            this.render_composts();
            this.render_farmers();
        };
    }

    perform_all_actions(){
        BaseEngine.prototype.perform_all_actions.call(this);
        for (var i=0;i<this.action_queue.length;i++){
            var action = this.action_queue[i];
            switch (action[0]){
                case 'make_teabag':
                    this.make_teabag();
                    break;
                case 'start_compost':
                    this.start_compost(action[1]);
                    break;
                case 'set_compost':
                    this.set_compost(action[1]);
                    break;
                case 'place_compost':
                    // Tile coords
                    var tx = Math.floor(this.num_tiles * (action[1][0] / canvas.width));
                    var ty = Math.floor(this.num_tiles * (action[1][1] / canvas.height));
                    this.place_compost(tx, ty);
                    break;
                case 'strategy_up':
                    this.state['coll_strategy'] = 'up';
                    this.update_strategy();
                    break;
                case 'strategy_down':
                    this.state['coll_strategy'] = 'down';
                    this.update_strategy();
                    break;
                case 'strategy_left':
                    this.state['coll_strategy'] = 'left';
                    this.update_strategy();
                    break;
                case 'strategy_right':
                    this.state['coll_strategy'] = 'right';
                    this.update_strategy();
                    break;
                case 'strategy_home':
                    this.state['coll_strategy'] = 'home';
                    this.update_strategy();
                    break;
                case 'strategy_random':
                    this.state['coll_strategy'] = 'random';
                    this.update_strategy();
                    break;
                case 'strategy_smart':
                    if (this.project_done('strategy1')){
                        this.state['coll_strategy'] = 'smart';
                        this.update_strategy();
                    }
                    break;
            };

        };
        this.action_queue = [];
    }



    // UTILITY
    make_river(coords, moves, length){
        var river = [[coords[0], coords[1]]];
        var step = 0;
        var sel = 0;
        while (step < length){
            if (sel > 4){
                sel = 0;
            } else {
                sel = Math.floor(Math.random() * moves.length);
            }
            if (sel < 5){
                step += 1;
            }
            var m = moves[sel];
            if (!this.valid_coords([coords[0] + m[0], coords[1] + m[1]])){
                sel = 0;
                continue
            }

            coords[0] += m[0];
            coords[1] += m[1];
            river.push([coords[0], coords[1]]);
        }
        return river
    }

    valid_coords(coords){
        if (coords[0] < this.num_tiles && coords[0] >=0){
            if (coords[1] < this.num_tiles && coords[1] >=0){
                var val = this.field[coords[0]][coords[1]];
                if (val != 2 && val != 3){
                    var on_compost = false;
                    for(var i = 0; i < this.composts.length; i++){
                        var comp = this.composts[i];
                        if (comp[0][0] == coords[0] && comp[0][1] == coords[1]){
                            on_compost = true
                            break
                        }
                    };
                    if (!on_compost){
                        return true
                    }
                }
            }
        }

        return false;
    }

    // FARMER MOVEMENT
    get_move_collector(coords, is_fertilizer = false){
        var strategy = this.state['coll_strategy'];
        if (is_fertilizer){strategy = 'fertilize'};

        var moves = [];
        for(var i=-1;i<2;i++){
            for(var j=-1;j<2;j++){
                var new_coords = [coords[0] + i, coords[1] + j];
                if (i==0 && j==0){}
                else if (this.valid_coords(new_coords)){
                    moves.push([new_coords, this.field[new_coords[0]][new_coords[1]]]);
                }
            }
        }

        if (strategy == 'random'){
            moves = shuffle(moves);
            return moves[Math.floor(Math.random() * moves.length)][0];
        }
        else if (strategy == 'home'){
            // Add steps towards hq
            var moves = [];
            for (var step=-1;step<2;step=step+2){
                for (var i=0;i<2;i++){
                    if ((step < 0 && coords[i] - 1 >= this.hq_coords[i]) ||
                        (step > 0 && coords[i] + 1 <= this.hq_coords[i])){

                        if (i==0){
                            var new_coords = [coords[0] + step, coords[1]];
                        } else {
                            var new_coords = [coords[0], coords[1] + step];
                        }
                        if (this.valid_coords(new_coords)){
                            for (var j=0;j<8;j++){
                                moves.push([new_coords, 0]);
                            }
                        }
                    }
                }
            };
            if (moves.length > 0){
                // Still pick randomly
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
        } else if (strategy == 'left'){
            var new_coords = [coords[0] - 1, coords[1]];
            if (this.valid_coords(new_coords)){
                for (var i=0;i<10;i++){
                    moves.push([new_coords, 0]);
                }
            }
            if (moves.length > 0){
                // Still pick randomly
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
        } else if (strategy == 'right'){
            var new_coords = [coords[0] + 1, coords[1]];
            if (this.valid_coords(new_coords)){
                for (var i=0;i<10;i++){
                    moves.push([new_coords, 0]);
                }
            }
            if (moves.length > 0){
                // Still pick randomly
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
        } else if (strategy == 'up'){
            var new_coords = [coords[0], coords[1] - 1];
            if (this.valid_coords(new_coords)){
                for (var i=0;i<10;i++){
                    moves.push([new_coords, 0]);
                }
            }
            if (moves.length > 0){
                // Still pick randomly
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
        } else if (strategy == 'down'){
            var new_coords = [coords[0], coords[1] + 1];
            if (this.valid_coords(new_coords)){
                for (var i=0;i<10;i++){
                    moves.push([new_coords, 0]);
                }
            }
            if (moves.length > 0){
                // Still pick randomly
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
        }
        else if (strategy == 'smart'){
            moves = shuffle(moves);
            var best = [[0,0], 0];

            for (var i = 0; i < moves.length; i++){
                if (moves[i][1] > best[1]){
                    best = moves[i];
                }
            }
            if (best[1] == 0){
                // Nothing = Random
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
            return best[0];
        }
        else if (strategy == 'fertilize'){
            moves = shuffle(moves);
            var best = [[0,0], 1000000];

            for (var i = 0; i < moves.length; i++){
                if (moves[i][1] < best[1]){
                    best = moves[i];
                }
            }
            if (best[1] == 0){
                // Nothing = Random
                return moves[Math.floor(Math.random() * moves.length)][0];
            }
            return best[0];
        }

        return false
    }

    update_farmers(){
        var s = this.state;

        var ratio = $("#map_fertilizer_ratio").val() / 100;

        // Some farmers are fertilizers (i know it's lazy to do this here)
        var num_farmers = this.farmers.length;
        var num_fertilizers = Math.floor(num_farmers * ratio);

        for(var i = 0; i < num_farmers; i++){
            var j = this.farmers.length - 1 - i;
            var is_fertilizer = i < num_fertilizers;

            // Move the farmer & render tile where it was previously standing
            var old_coords = this.farmers[j];
            var new_coords = this.get_move_collector(old_coords, is_fertilizer);
            if (new_coords === false){
                continue
            }
            this.farmers[j] = new_coords;
            this.render_tile(old_coords[0], old_coords[1]);

            // Explore land
            var new_land = this.field[new_coords[0]][new_coords[1]];
            if (new_land != 2){
                if (!is_fertilizer){
                    this.field[new_coords[0]][new_coords[1]] = 0;
                    s['herbs'] += s['coll_efficiency_speed'][s['coll_efficiency']] * Math.max(s['collection_min'], new_land);
                    this.render_tile(new_coords[0], new_coords[1]);
                } else {
                    // fertilize around the farmer
                   for (var x=-1;x<=1;x++){
                     for (var y=-1;y<=1;y++){
                        var coords = [new_coords[0] + x, new_coords[1] + y];
                        if (this.valid_coords([coords[0], coords[1]])){
                            var current = this.field[coords[0]][coords[1]];
                            var added = Math.random() * s['map_fertilizer_max'];
                            this.field[coords[0]][coords[1]] = Math.min(current + added, 1.0);
                            this.render_tile(coords[0], coords[1]);
                        }
                      }
                   }
                }
            }
        }

        var new_farmers = s['farmers'] - num_farmers;

        // Launch new collectors if needed
        for (var i=0;i < new_farmers;i++){
            this.farmers.push(this.hq_coords);
        }

        // // Remove excess collectors (only needed in game_phase 1)
        // for (var i=0;i < -1 * new_farmers;i++){
        //     this.farmers.splice(-1,1);
        // }
    }

    // FARM: Constantly grow the field a bit (game_phase 0 only)
    update_constant_growth(){
        var s = this.state;
        var num = Math.floor((this.num_tiles ** 2) / s['constant_num_divider']);
        for (var i = 0; i < num; i++){
            var found = false;
            while (!found){
                var x = Math.round(Math.random() * this.num_tiles);
                var y = Math.round(Math.random() * this.num_tiles);
                if (this.valid_coords([x, y])){
                    found = true;
                }
            }
            if (found){
                var amount = this.field[x][y] + Math.random() * s['constant_amount'];
                this.field[x][y] = Math.min(1, amount);
                this.render_tile(x, y);
            }
        }
    }

    // PROCESSING (Teabags game_phase 0)
    update_auto(){
        var s = this.state;
        // Convert from herbs to teabags\
        var amount = s['speed_auto_processing'] * s['processors'];

        if (amount > 0){
            amount *= s['proc_efficiency_speed'][s['proc_efficiency']];
            amount = Math.min(s['herbs'], amount);
            s['herbs'] -= amount;
            amount *= s['proc_efficiency_effect'][s['proc_efficiency']]
            s['teabags'] += amount
        };
    }

    make_teabag(num = 1){
        if (this.state['herbs'] >= num){
            this.state['herbs'] -= num;
            this.state['teabags'] += num;
        }
    }

    // COMPOST
    update_compost(){
        var s = this.state;
        var num_composts = this.composts.length;
        for(var i = 0; i < num_composts; i++){
            var j = num_composts - 1 - i;

            var pos = this.composts[j][0];
            var type = this.composts[j][1];

            // How many fields to fertilize
            var num = 0;
            var prob = s['compost_probability'][type];
            if (prob > 1){
                num = prob;
            } else if (Math.random() < prob){
                num = 1;
            }

            for (var ii = 0; ii < num; ii++){
                // Get coords
                var distance = s['compost_distance'][type];

                var coords = false;
                for (var jj = 0; jj < 8; jj++){
                    var r1 = randn_bm();
                    var r2 = randn_bm();
                    var x = Math.round(pos[0] + distance * r1);
                    var y = Math.round(pos[1] + distance * r2);

                    if (x != pos[0] || y != pos[1]){
                        if (this.valid_coords([x, y])){
                            if (this.field[x][y] < 1){
                                coords = [x, y];
                                break;
                            }
                        }
                    }
                }

                // FINALLY fertilize the ground & render
                if (coords){
                    var amount = s['compost_amount'][type];
                    amount *= (1 + Math.min(1, 0.5 * Math.abs(randn_bm())));
                    amount = Math.min(amount, 1);

                    var v = this.field[coords[0]][coords[1]];
                    this.field[coords[0]][coords[1]] = Math.min(1, v + amount);
                    this.render_tile(coords[0], coords[1]);
                }
            }

            // Reduce lifetime
            this.composts[j][2] -= 1;
            if (this.composts[j][2] <= 0){
                var pos = this.composts[j][0];
                this.field[pos[0]][pos[1]] = 1;
                this.composts.splice(j, 1);
                this.render_tile(pos[0], pos[1]);
            }
        }
    }

    start_compost(id, free=false){
        var s = this.state;
        if (s['compost_timer'][id] > 0 || s['compost_ready'][id]){
            return
        }

        var tb_required = s['compost_teabags'][id];
        if (s['teabags'] >= tb_required || free){
            // Hide button, show progress bar
            $("#btn_compost" + id).hide();
            $("#price_compost" + id).hide();
            $("#progress_compost" + id).show();
            var time_required = s['compost_times'][id];
            if (!free){
                this.state['teabags'] -= tb_required;
            }
            this.state['compost_timer'][id] = time_required

        }
    }

    update_compost_ui(){
        var s = this.state;
        for (var i = 0; i < 3; i++){
            // The timer ran out
            if (s['compost_timer'][i] == 1){
                this.state['compost_timer'][i] = 0;
                this.state['compost_ready'][i] = true;

                // Hide progress, show spade
                $("#progress_compost" + i).hide();
                $("#btn_set_compost" + i).show();
            }
            // The timer is running
            else if (s['compost_timer'][i] > 0){
                s['compost_timer'][i] -= 1;
                var perc = 100.0 * s['compost_timer'][i] / s['compost_times'][i];
                $("#meter_compost" + i).css('width', '' + perc + '%');
            } else if (s['compost_set_active'] == -1) {
                // If auto-compost is enabled and player has enough tea bags start a new compost
                var auto = $("#auto_compost" + i).prop('checked');
                if (auto && s['teabags'] >= s['compost_teabags'][i]){
                    this.start_compost(i);
                }
            }
        }
    }

    set_compost(id){
        var s = this.state;
        if (s['compost_ready'][id] && s['compost_set_active'] == -1){
            this.state['compost_set_active'] = id;
            s['compost_ready'][id] = false;
            $("#compost_active" + id).show();
            $("#btn_set_compost" + id).hide();
        }
    }

    place_compost(x, y){
        if (!this.valid_coords([x, y])){
            return
        };
        var s = this.state;
        var id = s['compost_set_active'];
        if (id === -1){
            return
        }
        this.composts.push([
            [x, y],
            id,
            s['compost_lifetime'][id],
        ]);
        this.state['compost_set_active'] = -1;
        // Hide click, show button again
        $("#compost_active" + id).hide();
        $("#btn_compost" + id).show();
        $("#price_compost" + id).show();
        this.render_tile(x, y);
    }


    update_strategy(){
        var strat = this.state['coll_strategy'];

        ['home', 'smart', 'random'].forEach(function(s){
            if (s == strat){
                $("#strategy-" + s).attr('src', 'static/' + s + '_selected.png');
            } else {
                $("#strategy-" + s).attr('src', 'static/' + s + '_unselected.png');
            }
        });

        ['up', 'down', 'left', 'right'].forEach(function(s){
            if (s == strat){
                $("#strategy-" + s).attr('src', 'static/arrow_selected.png');
            } else {
                $("#strategy-" + s).attr('src', 'static/arrow_unselected.png');
            }
        });
    }

    update_buy_btns(production_rates){
        var s = this.state;

        ["farmers", "processors", "proc_efficiency", "garden_size", "coll_efficiency"].forEach(function(item, index){
            // Check if purchase is possible
            var price = s['price_' + item][s[item]];
            var obj = $("#buy_" + item);
            if (s['teabags'] >= price){
                if (!obj.hasClass("buyable")){
                    obj.addClass("buyable");
                    obj.prop('title', 'You can buy this now!');
                };
            } else {
                var to_pay = price - s['teabags'];
                to_pay /= production_rates[1];
                obj.prop('title', 'You can buy this in ' + Math.round(to_pay) + ' seconds');
                if (obj.hasClass("buyable")){
                    obj.removeClass("buyable");
                };
            }
        });

        var price = s['compost_teabags'];
        [0, 1, 2].forEach(function(item){
            var obj = $("#btn_compost" + item);
            if (s['teabags'] >= price[item]){
                if (!obj.hasClass("buyable")){
                    obj.addClass("buyable");
                };
            } else {
                if (obj.hasClass("buyable")){
                    obj.removeClass("buyable");
                };
            }
        });
    }

    // RENDERING
    render_farmers(){
        var ratio = $("#map_fertilizer_ratio").val() / 100;
        var num_farmers = this.farmers.length;
        var num_fertilizers = Math.floor(num_farmers * ratio);

        var ts = this.tile_size;
        var c = MAP_COLORS['farmer'];
        ctx.fillStyle = "rgb("+ c[0] +","+ c[1] + "," + c[2] +")";

        for (var j = 0;j<num_farmers;j++){
            var coords = this.farmers[j];
            ctx.beginPath();
            var m = ts / 2;
            ctx.arc(coords[0] * ts + m, coords[1] * ts + m, ts / 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    render_composts(){
        var ts = this.tile_size;
        var lifetime =  this.state['compost_lifetime'];
        this.composts.forEach(function(compost){
            var value = lifetime[compost[1]] / compost[2];
            var c = [0, 0, 0];
            for (var i=0;i<3;i++){
                c[i] = (1.0 - value) * MAP_COLORS['compost_full'][i] + value * MAP_COLORS['compost_empty'][i]
            };
            ctx.fillStyle = "rgb("+ c[0] +","+ c[1] + "," + c[2] +")";
            ctx.fillRect(compost[0][0] * ts, compost[0][1] * ts, ts, ts);
        })
    }

    render_tile(x, y){
        var value = this.field[x][y];

        // Determine color
        var c = [0, 0, 0];
        if (value == 2){
            c = MAP_COLORS['house'];
        } else if (value == 3){
            c = MAP_COLORS['river'];
        } else {
            for (var i=0;i<3;i++){
                c[i] = (1.0 - value) * MAP_COLORS['field_no_herbs'][i] + value * MAP_COLORS['field_full_herbs'][i]
            };
        }
        ctx.fillStyle = "rgb("+ c[0] +","+ c[1] + "," + c[2] +")";
        ctx.fillRect(x*this.tile_size, y*this.tile_size, this.tile_size, this.tile_size);
    }

    render_all_tiles(){
        for(var i = 0; i < this.num_tiles; i++){
            for(var j = 0; j < this.num_tiles; j++){
                this.render_tile(i, j);
            }
        }
    }


    render_upgradable_text(){
        var s = this.state;
        // Upgrades
        var up = ['farmers', 'processors', 'garden_size', 'proc_efficiency', 'coll_efficiency'];
        var p;
        for (p in up){
            p = up[p];
            if (p !== 'proc_efficiency'){
                $("#" + p).html(num_to_mega(s[p]));
            } else {
                var t = "x" + s['proc_efficiency_speed'][s[p]] + " +" + Math.round(100 * (s['proc_efficiency_effect'][s[p]]-1)) + "%";
                $("#" + p).html(t);
            }
            $("#price_" + p).html(this.get_price(p));
        }

        for (p in [0, 1, 2]){
            $("#price_compost" + p).html(this.state["compost_teabags"][p] + ' <img src="static/tea_icon.png" class="tea-icon">');
        }
    }


    render_status_text(production_rates = false){
        var s = this.state;
        var game_phase = s['game_phase']

        // Teabag image
        // var tb_img = '&nbsp;&nbsp;&nbsp;<img src="static/teabag.png" width="40px"></img>'

        // Basic Resources
        $("#herbs").html(num_to_mega(s["herbs"]));
        $("#teabags").html(num_to_mega(s["teabags"]));

        // Rates
        if (production_rates !== false){
            // var tooltip = num_to_mega(production_rates[0]);
            $("#herbs_rate").html(num_to_mega(production_rates[0], true));
            $("#teabags_rate").html(num_to_mega(production_rates[1], true));
        }

    }
}
