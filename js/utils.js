// Standard Normal variate using Box-Muller transform.
// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}


function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function num_to_mega(num, high_precision=false){
    var unit = "";

    for (var i=MEGA_AMOUNTS.length-1;i>=0;i--){
        if (Math.abs(num) >= MEGA_AMOUNTS[i]){
            num /= MEGA_AMOUNTS[i];
            unit = MEGA_UNITS[i];
            break;
        }
    }
    if (unit === ""){
        if (high_precision == true){
            return "" + num.toFixed(1);
        }
        return "" + Math.floor(num);
    }

    if (num > 1e3){
        num = (num * 1e24).toPrecision(2);
        unit = "";
    } else {
        num = num.toFixed(1);
    }

    return num + unit;
    // return "" + Math.round(10 * num) / 10 + unit;
};



var choice = function(arr, exclude=[]){
    var found = false;
    while (true){
        var e = arr[Math.floor(Math.random()*arr.length)];
        if (!exclude.includes(e)){
            return e;
        }
    }
}


function randf(min, max) {
    return Math.random() * (max - min) + min;
}

function randrange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Cheap gradient
var c1 = [48, 48, 48];
var c2 = [255, 255, 238];
var gdiff = [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]];

function gradient_color(value){
    return [
        c1[0] + gdiff[0] * value,
        c1[1] + gdiff[1] * value,
        c1[2] + gdiff[2] * value,
    ];
}

function gradient_value(color){
    return (color[0] - c1[0]) / gdiff[0];
}

function lerp(fraction, min, max){
    return Math.round(min + fraction * (max - min));
}
