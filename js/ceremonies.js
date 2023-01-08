
var ceremonies = [
    {
        id: "fire1",
        title: "Lizard Dance",
        description: "Fire 1",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'fire': 70},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 123;
            return state
        }
    },

     {
        id: "fire2",
        title: "Rite of the Phoenix",
        description: "Fire 2",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'fire': 80, 'water': 50},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 12345;
            return state
        }
    },
    {
        id: "fire3",
        title: "Lava Toad Ritual",
        description: "Fire 2",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'fire': 250},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 1234567;
            return state
        }
    },
    {
        id: "fire3",
        title: "Dragon's Breath",
        description: "Fire 2",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'fire': 1e203},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 1234567;
            return state
        }
    },

    // WATER
    {
        title: "Spring water revitalization",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'water': 70},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 123;
            return state
        }
    },

     {
        title: "Pineapple falls",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'water': 120},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 12345;
            return state
        }
    },

    {
        title: "Frozen cave",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'water': 250},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['focus'] += 12345;
            return state
        }
    },

    // NATURE
    {
        title: "Plant nursery",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'nature': 5},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['teabags'] *= 1.5;
            return state
        }
    },
    {
        title: "Fertilizer of LIFE",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'nature': 10},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['teabags'] *= 2;
            return state
        }
    },
    {
        title: "Garden cloche",
        trigger: function(state){return state['game_phase'] == 2},
        cost_str: "10 {{teas}}",
        cost: function(state){return state["teabags"] >= 10},
        condition: {'nature': 15},
        status: 1,
        game_phase: 2,
        tries_left: -1,
        type: "ceremony",
        effect: function(state){
            state['teabags'] *= 10;
            return state
        }
    },
]

function ceremony_done(id){
    var c = ceremonies.find(x => x.id === id);
    return c.status == 2;
}

// projects = projects.concat(ceremonies);
// conditions as a function
