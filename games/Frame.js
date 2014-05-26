var $ = function (id) {
    return document.getElementById(id);
},
canvas = null;
getCanvas = function (id) {
    var can = $("can") || $("canvas") || $(id);
    canvas = can;
    return can;
},
getContext = function (id) {
    if (id == null) return getCanvas().getContext("2d");
    else return getCanvas(id).getContext("2d");
},
makeShape = function (callback, fill) {
    fill = fill || false;
    var c = getContext();
    c.beginPath();
    callback();
    c.closePath();
    if (fill) c.fill();
    else c.stroke();
},
outlineShape = function (callback, fill) {
    fill = fill || false;
    var c = getContext();
    c.beginPath();
    callback();
    c.closePath();
    if (fill) c.fill();
    c.stroke();
},
getClickPos = function (e) {
    var parPos = getPos(e.currentTarget),
        xPos = e.clientX - parPos.x,
        yPos = e.clientY - parPos.y;
    return {
        x: xPos,
        y: yPos
    };
},

getPos = function (el) {
    var xPos = 0,
        yPos = 0;

    while (el) {
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }

    return {
        x: xPos,
        y: yPos
    };
},
shadeColor = function (color, percent, hash) {
    /** Pablo of StackExchange **/

    hash = hash || false;

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100, 10);
    G = parseInt(G * (100 + percent) / 100, 10);
    B = parseInt(B * (100 + percent) / 100, 10);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
    if (hash) return "#" + RR + GG + BB;
    else {
        var res = "" + RR + GG + BB;
        return res;
    }
},

darkenHex = function (hex) {
    var result = (((hex & 0x7E7E7E) >> 1) | (hex & 0x808080));
    return hex;
},

ator = function (angle) {
    return angle * (Math.PI / 180);
},
getScale = function (x, y) {
    x = x || 300;
    y = y || 150;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var w = canvas.width / x,
        h = canvas.height / y,
        scale = (w + h) / 2;
    console.log("New scale: " + scale);
    return scale;
},
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (c) {
    window.setTimeout(c, 1000 / 60);
};


window.requestAnimationFrame = requestAnimationFrame;

var left = false,
    right = false,
    up = false,
    down = false;

function keyDown(e) {
    e = e || window.event;
    var c = e.keyCode;
    switch (c) {
        case 65:
        case 37:
            left = true;
            break;

        case 68:
        case 39:
            right = true;
            break;

        case 87:
        case 38:
            up = true;
            break;

        case 83:
        case 40:
            down = true;
            break;
    }
};

function keyUp(e) {
    e = e || window.event;
    var c = e.keyCode;
    console.log(c);
    switch (c) {
        case 65:
        case 37:
            left = false;
            break;

        case 68:
        case 39:
            right = false;
            break;

        case 87:
        case 38:
            up = false;
            break;

        case 83:
        case 40:
            down = false;
            break;
    }
};

function fullscreen(elt){
           var el = $(elt);
 
           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }            
}
