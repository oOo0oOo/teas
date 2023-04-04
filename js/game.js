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
function action(type, params) {
  engine.add_action(type, params);
}

function tick_game() {
  engine.tick();
  setTimeout(tick_game, TICK_TIME);
}

function load_game_state() {
  var save_state;
  if (localStorage.getItem("InfiniteaSave") != null) {
    save_state = JSON.parse(localStorage.getItem("InfiniteaSave"));
  } else {
    save_state = {
      state: JSON.parse(JSON.stringify(START_STATE)),
      farmers: [],
      composts: [],
      field: [],
      focus_projects: [],
    };
    save_state["state"]["project_status"] = new Array(projects.length).fill(0);
  }
  return save_state;
}

function run_engine(save_state) {
  delete engine;
  switch (save_state["state"]["game_phase"]) {
    case -1:
      $("#intro").show();
      break;
    case 0:
      engine = new EnginePhase0(save_state);
      $("#ui-game-phase0").show();
      break;
    case 1:
      engine = new EnginePhase1(save_state);
      $("#ui-game-phase1").show();
      break;
    case 2:
      engine = new EnginePhase2(save_state);
      $("#ui-game-phase2").show();
      break;
  }

  if (engine) {
    engine.init_game(save_state);
    tick_game();
  }
  // $(document).foundation();   // I am not sure why this was needed. Will remove for now until foundation starts braking?
}

function reset_meditation() {
  engine.reset_meditation();
}

function update_free_workers() {
  engine.update_free_workers();
}

function setup() {
  // Load map
  canvas = document.getElementById("map0");
  ctx = canvas.getContext("2d");

  $("#map0").click(function (e) {
    action("place_compost", [e.offsetX, e.offsetY]);
  });

  Handlebars.registerHelper("if_eq", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  // Create all (hidden) projects
  var source = $("#project-template").html();
  var template = Handlebars.compile(source);

  for (i = 0; i < projects.length; i++) {
    var p = projects[i];
    var cost = "";
    // if focus is in the cost dictionary, add the focus icon
    if (p.cost.focus) {
      cost +=
        num_to_mega(p.cost.focus) +
        " <img src='static/img/focus_dark.png' class='img_project_resource'>";

      // Add a space if there is also teabags cost
      if (p.cost.teabags) {
        cost += " ";
      }
    }
    if (p.cost.teabags) {
      cost +=
        num_to_mega(p.cost.teabags) +
        " <img src='static/img/tea_icon.png' class='tea-icon'>";
    }
    p.cost_str = cost;
  }
  var html = template({ projects: projects });
  $("#projects-list").html(html);

  // Compile the template for the focus projects
  var source = $("#focus-project-template").html();
  focus_project_template = Handlebars.compile(source);

//   var source = $("#teapet-template").html();
//   teapet_template = Handlebars.compile(source);

//   var source = $("#ceremony-template").html();
//   ceremony_template = Handlebars.compile(source);

  // Detect double click on main tea icon --> toggle visibility of the debug box
  $(".debug-box").hide();
  $(".tea-icon-main").dblclick(function () {
    $(".debug-box").toggle();
  });

  // Load a normal game
  var state = load_game_state();
  run_engine(state, false);
}

// MANUAL OPTIONS
function cheat() {
  engine.state["teabags"] += 10000000000;
  engine.state["focus"] += 1e6;
  engine.state["triangle"] += 10;
  engine.state["square"] += 10;
  engine.state["circle"] += 10;
  engine.render_status_text();
}

function void_teabags() {
  engine.state["teabags"] = 0;
  engine.state["focus"] = 0;
  engine.state["triangle"] = 0;
  engine.state["square"] = 0;
  engine.state["circle"] = 0;
  engine.state["focus_action"] = 0;
  engine.render_status_text();
}

function give_worker() {
  engine.state["workers"] += 1;
}

function reset_save() {
  if (
    !confirm(
      "Are you sure you want to delete all your progress and start over?"
    )
  ) {
    return;
  }
  localStorage.clear();
  location.reload();
}

// SWITCH GAME PHASE
function switch_to_game_phase_0() {
  $("#intro").hide();
  // Open tutorial popup (reveal)
  $("#intro-popup-phase0").foundation("open");

  var save_state = load_game_state();
  save_state["state"]["game_phase"] = 0;

  // Hide the restart button
  $(".menu-box").hide();

  run_engine(save_state);
}

function stay_in_game_phase_0() {
  $("#intro-popup-phase1").foundation("close");

  // Re-add the "worker_placement" project
  var p = projects.findIndex(function (p) {
    return p.id == "worker_placement";
  });
  engine.state["teabags"] += projects[p]["cost"]["teabags"];
  engine.state["project_status"][p] = 0;
  engine.update_projects();
}

function switch_to_game_phase_1() {
  $("#intro-popup-phase1").foundation("close");

  // Hide all remaining projects
  $(".project").hide();

  $("#map0").remove();

  // Mark the "worker_placement" project as done
  var p = projects.findIndex(function (p) {
    return p.id == "worker_placement";
  });
  engine.state["project_status"][p] = 2;

  // Clone the projects from ui_projects to ui_projects1
  var p = $("#projects-list").clone();
  $("#ui-projects").remove();
  $("#ui-projects1").append(p);

  // Show the new ui
  $("#ui-game-phase0").hide();

  // Update some of the state
  var s = engine.serialize();
  s["state"]["game_phase"] = 1; // Worker placement phase
  s["state"]["teabags"] = 0;
  s["state"]["herbs"] = 0;
  s["state"]["farmers"] = 0;
  s["state"]["processors"] = 0;
  s["state"]["size"] = 260;
  s["state"]["focus"] = 0;
  s["state"]["garden_size"] = 1;
  s["state"]["farmer_delay"] = 6;

  canvas = document.getElementById("map1");
  ctx = canvas.getContext("2d");
  run_engine(s);
}

function switch_to_game_phase_2() {
  // Hide all remaining projects
  $(".project").hide();

  // Clone the projects from ui_projects1 to ui_projects2
  var p = $("#projects-list").clone();
  $("#ui-projects1").remove();
  $("#ui-projects2").append(p);

  // Show the new ui
  $("#ui-game-phase1").hide();

  // Update some of the state
  var s = engine.serialize();
  s["state"]["game_phase"] = 2;
  s["state"]["teabags"] = 0;
  s["state"]["greenhouse_speed"] = 0;
  s["state"]["factory_speed"] = 0;

  run_engine(s);
}

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;
is_fullscreen = false;

function toggle_fullscreen() {
  if (is_fullscreen) {
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
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
  // Update text
  $(".fullscreen-btn").html("Exit Fullscreen");
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
  // Update text
  $(".fullscreen-btn").html("Fullscreen");
}

// Play and pause the music
var audioPlayer = document.getElementById("audio");
var music_btn = $(".music-btn");
var isPlaying = false;

function toggle_play() {
  if (isPlaying) {
    audioPlayer.pause();
    music_btn.html("Play Music");
  } else {
    audioPlayer.play();
    music_btn.html("Pause Music");
  }
}

audioPlayer.onplaying = function () {
  isPlaying = true;
};

audioPlayer.onpause = function () {
  isPlaying = false;
};
