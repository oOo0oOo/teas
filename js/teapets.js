
var teapets = [
    // FIRE
    {
        title: "Miniflame",
        icon: "TP_Firecat",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['fire'] += lerp(strength, 30, 50);
            state['explosion'] += lerp(strength, 3, 0);
            return state
        }
    },
    {
        title: "Firebolt",
        icon: "TP_Firecat",
        possible: function(state){return true},
        type: 'teapet',
        max_own: 3,
        effect: function(state, strength){
            state['fire'] += lerp(strength, 50, 101);
            state['explosion'] += lerp(strength, 4, 1);
            return state
        }
    },
    {
        title: "Volcanor",
        icon: "TP_wasp",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['fire'] += lerp(strength, 100, 200);
            state['explosion'] += lerp(strength, 4, 1);
            return state
        }
    },

    // WATER
    {
        title: "Fishboner",
        icon: "TP_Jellyfish",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['water'] += lerp(strength, 20, 35);
            state['nature'] += lerp(strength, 5, 10);
            state['fire'] -= lerp(strength, 0, 15);
            state['explosion'] += lerp(strength, 3, 0);
            return state
        }
    },
    {
        title: "Garden Fountainer",
        icon: "TP_Jellyfish",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['water'] += lerp(strength, 50, 70);
            state['nature'] += lerp(strength, 30, 50);
            state['fire'] -= lerp(strength, 0, 20);
            state['explosion'] += lerp(strength, 4, 1);
            return state
        }
    },
    {
        title: "Tsunamir",
        icon: "TP_Fish",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['water'] += lerp(strength, 120, 180);
            state['nature'] += lerp(strength, 30, 50);
            state['fire'] -= lerp(strength, 20, 40);
            state['explosion'] += lerp(strength, 3, 0);
            return state
        }
    },

    // NATURE
    {
        title: "Ant-o",
        icon: "TP_snail",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['nature'] += lerp(strength, 2, 6);
            state['explosion'] += lerp(strength, 2, 0);
            return state
        }
    },
    {
        title: "Danger Mole",
        icon: "TP_mushroom",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['nature'] += lerp(strength, 3, 10);
            state['explosion'] += lerp(strength, 2, 0);
            return state
        }
    },


// MULTIPLIERS

    {
        id: "firex3",
        title: "Fire x 3",
        tooltip: "Fire x 3",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        max_own: 3,
        effect: function(state, strength){
            state['fire'] *= 3;
            state['explosion'] += lerp(strength, 3, 1);
            return state
        }
    },

    {
        title: "Fire ^ 2",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        max_own: 3,
        effect: function(state, strength){
            state['fire'] = Math.pow(state['fire'], 2);
            state['explosion'] += lerp(strength, 4, 2);
            return state
        }
    },

    {
        id: "waterx3",
        title: "Water x 3",
        tooltip: "Water x 3",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        max_own: 3,
        effect: function(state, strength){
            state['water'] *= 3;
            state['explosion'] += lerp(strength, 3, 1);
            return state
        }
    },

    {
        title: "Nature x 3",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['nature'] *= 3;
            state['explosion'] += lerp(strength, 3, 1);
            return state
        }
    },

    {
        id: "allx2",
        title: "All x 2",
        tooltip: "All x 3",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        max_own: 3,
        effect: function(state, strength){
            state['water'] *= 2;
            state['fire'] *= 2;
            state['nature'] *= 2;
            state['explosion'] += lerp(strength, 4, 1);
            return state
        }
    },

    {
        title: "All x 10",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        max_own: 3,
        effect: function(state, strength){
            state['water'] *= 10;
            state['fire'] *= 10;
            state['nature'] *= 10;
            state['explosion'] += lerp(strength, 4, 1);
            return state
        }
    },

// SPECIAL TEAPETS
    {
        title: "Explosoftinator",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['explosion'] = Math.ceil(state['explosion'] * 0.75);
            return state
        }
    },

    {
        title: "Mexplosor",
        icon: "TP_Insanity",
        possible: function(state){return true},
        type: 'teapet',
        effect: function(state, strength){
            state['explosion'] = Math.ceil(state['explosion'] * 0.45);
            return state
        }
    },

// UTENSILS
    {
        title: "Teapot:\nAll x 2 for 30% of teabags...",
        icon: "UT_pot",
        possible: function(state){return true},
        type: 'utensil',
        effect: function(state, strength){
            state['water'] *= 2;
            state['fire'] *= 2;
            state['nature'] *= 2;
            state['teabags'] *= 0.7;
            return state
        }
    },

    {
        title: "Fire Booost",
        icon: "UT_pot",
        possible: function(state){return true},
        type: 'utensil',
        effect: function(state, strength){
            state['water'] *= 0.5;
            state['fire'] *= 5;
            state['nature'] *= 0.5;
            return state
        }
    },

    {
        title: "Repeata",
        icon: "UT_pot",
        possible: function(state){return true},
        type: 'utensil',
        effect: function(state, strength){
            var ind = state['picked'][state['picked'].length - 1];
            ind = state['selected'][ind];
            ind = state['zoo'][ind];
            var tp = teapets[ind];
            state = tp.effect(state);
            return state
        }
    },

    {
        title: "The grand switch",
        icon: "UT_pot",
        possible: function(state){return true},
        type: 'utensil',
        effect: function(state, strength){
            var fire = state['fire'];
            state['fire'] = state['nature'];
            state['nature'] = fire;
            return state
        }
    },

    {
        title: "Diffusor",
        icon: "UT_pot",
        possible: function(state){return true},
        type: 'utensil',
        effect: function(state, strength){
            var amt = Math.round(state['water'] * 0.5);
            state['fire'] += 1.25 * amt;
            state['water'] -= amt;
            return state
        }
    },

    {
        title: "Casino",
        icon: "UT_pot",
        possible: function(state){return true},
        type: 'utensil',
        effect: function(state, strength){
            var resource = choice(['fire', 'water', 'nature']);
            if (state[resource] === 0){
                state[resource] += lerp(strength, 20, 50);
            } else {
                state[resource] *= 4;
            }
            return state
        }
    },
    // Next one free or cheap
    // Previous one free or cheap
    // Next one double

]
