// Infinity main file

// Cool FX
//https://codepen.io/linrock/pen/tBefH
//https://codepen.io/briangonzalez/pen/DrJyG
//https://codepen.io/hi-im-si/pen/oXyqjG/

window.onload = setup;

var canvas;
var ctx;

var engine;

var focus_project_template;
var teapet_template;
var ceremony_template;


// BASICS
function action(type, params){
    engine.add_action(type, params);
}

function tick_game(){
    engine.tick();
    setTimeout(tick_game, TICK_TIME);
}

function load_game_state(){
    var state;
    if (localStorage.getItem("teabagSave") != null) {
        state = JSON.parse(localStorage.getItem("teabagSave"));
    } else {
        state = {
            'state': JSON.parse(JSON.stringify(START_STATE)),
            'farmers': [],
            'composts': [],
            'field': [],
            'focus_projects': [],
            'projects': new Array(projects.length).fill(0)
        };
    }
    return state
}

function run_engine(state){
    delete engine;
    switch(state['state']['game_phase']){
        case -1:
            $("#intro").show();
            break;
        case 0:
            engine = new EnginePhase0(state);
            $("#ui_game_phase0").show();
            break;
        case 1:
            engine = new EnginePhase1(state);
            $("#ui_game_phase1").show();
            break;
        case 2:
            engine = new EnginePhase2(state);
            $("#ui_game_phase2").show();
            break;
    };

    if (engine){
        engine.init_game(state)
        tick_game();
    }
    $(document).foundation();
}

function reset_meditation(){
    engine.reset_meditation();
}

function update_free_workers(){
    engine.update_free_workers();
}

function setup(){
    // Load extra content for phases from files
    // $("#ui_game_phase0").load("phase0.html");

    // Load map
    canvas = document.getElementById("map0");
    ctx = canvas.getContext('2d');

    $('#map0').click(function(e){
        action('place_compost', [e.offsetX, e.offsetY]);
    })

    Handlebars.registerHelper('if_eq', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    // Create all (hidden) projects
    var source = $("#project-template").html();
    var template = Handlebars.compile(source);

    for (i=0; i<projects.length; i++){
        var p = projects[i];
        var cost = "";
        // if focus is in the cost dictionary, add the focus icon
        if (p.cost.focus){
            cost += num_to_mega(p.cost.focus) + " <img src='static/focus_dark.png' class='img_project_resource'>";
            
            // Add a space if there is also teabags cost
            if (p.cost.teabags){
                cost += " ";
            }
        }
        if (p.cost.teabags){
            cost += num_to_mega(p.cost.teabags) + " <img src='static/tea_icon.png' class='tea-icon'>";
        }
        p.cost_str = cost;

        p.status = 0; // hidden at the start
    };
    var html = template({projects: projects});
    $("#projects_list").html(html);

    // Compile the template for the focus projects
    var source = $("#focus-project-template").html();
    focus_project_template = Handlebars.compile(source);

    var source = $("#teapet-template").html();
    teapet_template = Handlebars.compile(source);

    var source = $("#ceremony-template").html();
    ceremony_template = Handlebars.compile(source);

    // Load a normal game
    var state = load_game_state();
    run_engine(state, false);
}


// MANUAL OPTIONS
function cheat(){
    engine.state['teabags'] += 10000000000;
    engine.state['focus'] += 1e6;
    engine.state['triangle'] += 10;
    engine.state['square'] += 10;
    engine.state['circle'] += 10;
    engine.render_status_text();
}

function void_teabags(){
    engine.state['teabags'] = 0;
    engine.state['focus'] = 0;
    engine.state['triangle'] = 0;
    engine.state['square'] = 0;
    engine.state['circle'] = 0;
    engine.state['focus_action'] = 0;
    engine.render_status_text();
}

function give_worker(){
    engine.state['workers'] += 1;
}


function reset_save(){
    localStorage.clear();
    location.reload();
}


// SWITCH GAME PHASE
function switch_to_game_phase_0(){
    $("#intro").hide();

    var state = load_game_state();
    state['state']['game_phase'] = 0;
    run_engine(state);
}

function switch_to_game_phase_1(){
    // Hide all remaining projects
    $(".project").hide();

    $("#map0").remove();

    // Clone the projects from ui_projects to ui_projects1
    var p = $("#projects_list").clone();
    $("#ui_projects").remove();
    $("#ui_projects1").append(p);

    // Show the new ui
    $("#ui_game_phase0").hide();

    // Update some of the state
    var s = engine.serialize();
    s['state']['game_phase'] = 1; // Worker placement phase
    s['state']['teabags'] = 0;
    s['state']['herbs'] = 0;
    s['state']['farmers'] = 0;
    s['state']['processors'] = 0;
    s['state']['size'] = 260;
    s['state']['focus'] = 0;
    s['state']['garden_size'] = 1;
    s['state']['farmer_delay'] = 6;

    canvas = document.getElementById("map1");
    ctx = canvas.getContext('2d');
    run_engine(s);
}

function switch_to_game_phase_2(){
    // Hide all remaining projects
    $(".project").hide();

    // Clone the projects from ui_projects1 to ui_projects2
    var p = $("#projects_list").clone();
    $("#ui_projects1").remove();
    $("#ui_projects2").append(p);

    // Show the new ui
    $("#ui_game_phase1").hide();

    // Update some of the state
    var s = engine.serialize();
    s['state']['game_phase'] = 2;
    s['state']['teabags'] = 0;
    s['state']['greenhouse_speed'] = 0;
    s['state']['factory_speed'] = 0;

    run_engine(s);
}


/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;
is_fullscreen = false;

function toggleFullscreen(){
    if (is_fullscreen){
        closeFullscreen();
    } else {
        openFullscreen();
    }
    is_fullscreen = !is_fullscreen;
}
/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  // Update text
  $("#fullscreenBtn").html("Exit Fullscreen");
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
  // Update text
  $("#fullscreenBtn").html("Fullscreen");
}

// Play and pause the music
var audioPlayer = document.getElementById("audio");
var audioBtn = document.getElementById("audioBtn");
var isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause()
    musicBtn.innerHTML = "Play Music";
  } else {
    audioPlayer.play();
    musicBtn.innerHTML = "Pause Music";
  }
};

audioPlayer.onplaying = function() {
  isPlaying = true;
};

audioPlayer.onpause = function() {
  isPlaying = false;
};