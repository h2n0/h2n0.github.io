var $ = function (id) {
        return document.getElementById(id);
    },
    canvas,
    getCanvas = function (id) {
        var can = $("can") || $("canvas") || $(id);
        canvas = can
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

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
        if (hash)
            return "#" + RR + GG + BB;
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
        if (angle > 360) angle -= 360;
        if (angle < 0) angle += 360;
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
    down = false,

    keyDown = function (e) {
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
        case 13:
            toggleFullScreen();
            break;
        }
    },

    keyUp = function (e) {
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
    },

    toggleFullScreen = function () {
        if (!document.fullscreenElement && // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    },

    genColor = function () {
        return "#" + (Math.floor(Math.random() * 0xFFFFFF)).toString(16);
    },

    isMobile = function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    },
    
    addFooter = function(text){
            var parent = canvas.parentNode;
            var foot = document.createTextNode(""+text);
            var d = document.createElement("div");
            d.appendChild(foot)
            d.style.position="fixed";
            d.style.right="2px";
            d.style.bottom="0px";
            d.style.fontSize="12px";
            parent.appendChild(d);
    },
    
    addFooter2 = function (text){
            var parent = canvas.parentNode;
            var foot = document.createTextNode(""+text);
            var d = document.createElement("div");
            d.appendChild(foot)
            d.style.position="fixed";
            d.style.right="2px";
            d.style.bottom="0px";
            d.style.fontSize="12px";
            parent.appendChild(d);
            return d;
    }
