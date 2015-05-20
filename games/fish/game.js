window.onload = function () {
    "use strict";
    (function () {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
    }())
}

var GameModes = {
    title: 0,
    game: 1,
    about: 2
};
var canvas = document.getElementById("can"),
    ctx = canvas.getContext("2d"),
    width = 500,
    height = 200,
    entitys = [],
    mx = 0,
    my = 0,
    gamemode = GameModes.game;
canvas.width = width;
canvas.height = height;

function Wave() {
    this.tension = .025;
    this.damp = .025;
    this.spread = .25;
    this.waves = [];
    this.numwaves = 100;
    var i, x, y;
    for (i = 0; i < this.numwaves; i++) {
        x = Math.ceil(width / this.numwaves) * i;
        y = height - (height / 3) * 1.5;
        this.waves.push({
            pos: {
                x: x,
                y: y
            },
            targetHeight: height - y,
            height: height - y,
            speed: 0,
            step: (width / this.numwaves) / 2
        });
    }
    // this.color = "rgba(0, 177, 255, 0.56)";
}

Wave.prototype.update = function () {
    var i, grad;
    for (i = 0; i < this.numwaves; i++) {
        var diff = this.waves[i].targetHeight - this.waves[i].height;
        this.waves[i].speed += this.tension * diff - this.waves[i].speed * this.damp;
        this.waves[i].height += this.waves[i].speed;
    }

    var lDeltas = [],
        rDeltas = [];
    for (i = 0; i < this.numwaves; i++) {
        if (i > 0) {
            lDeltas[i] = this.spread * (this.waves[i].height - this.waves[i - 1].height);
            this.waves[i - 1].speed += lDeltas[i];
        }

        if (i < this.numwaves - 1) {
            rDeltas[i] = this.spread * (this.waves[i].height - this.waves[i + 1].height);
            this.waves[i + 1].speed += rDeltas[i];
        }
    }
    var last = this.waves.length - 1;
    ctx.beginPath();
    for (i = 0; i < this.numwaves; i += 1) {
        if (i > 0) {
            this.waves[i - 1].height += lDeltas[i];
        }
        if (i < this.waves.length - 1) {
            this.waves[i + 1].height += rDeltas[i];
        }
        this.waves[i].pos.y = height - this.waves[i].height;
        if (i < this.numwaves - 1) {
            grad = ctx.createLinearGradient(this.waves[i].pos.x, this.waves[i].pos.y, this.waves[i + 1].pos.x, height);
            grad.addColorStop(0, "rgba(0, 100, 200, 0.2)");
            grad.addColorStop(1, "rgba(0, 000, 100, 0.9)");
            ctx.style = grad;
            ctx.lineTo(this.waves[i].pos.x, this.waves[i].pos.y);
        }
    }
    ctx.lineTo(width, this.waves[last].pos.y);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.lineTo(0, this.waves[0].pos.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 100, 200, 0.2)";
    ctx.fill();
};

function getWaves() {
    var i;
    for (i = 0; i < entitys.length; i += 1) {
        if (entitys[i] instanceof Wave) {
            return entitys[i];
        }
    }
}

function Fish(ox, oy) {
    this.x = ox;
    this.y = oy;
    this.size = Math.floor(Math.random() * 15) + 10;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.speed = Math.floor(Math.random() * 5) + 1;
    this.tailWiggle = [0, 1, 2, 3, 3, 2, 1, 0, -1, -2, -3, -3, -2, -1];
    this.frame = 0;
    this.hooked = false;
    this.targetY = 150 + (Math.floor(Math.random() * 20));
    this.mass = this.size / 10;
    this.inwater = true;
    this.ox = 0;
    this.oy = 0;
}

Fish.prototype.update = function () {
    if (!this.hooked) {
        this.x -= this.speed;
    }
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.size / 2);
    //ctx.lineTo(this.x, this.y + this.size / 2); //Front of head
    ctx.lineTo(this.x + this.size, this.y); // Top of head
    ctx.lineTo(this.x + this.size * 2, this.y); // Top of body
    ctx.lineTo(this.x + this.size * 3, this.y + this.size / 2); // Tail join
    ctx.lineTo(this.x + this.size * 4 + this.tailWiggle[this.frame % this.tailWiggle.length], this.y + this.tailWiggle[this.frame % this.tailWiggle.length]); // Top of tail
    //   ctx.arcTo(this.x + this.size * 4 + this.tailWiggle[this.frame % this.tailWiggle.length], this.y + this.size - this.tailWiggle[this.frame % this.tailWiggle.length]);
    ctx.lineTo(this.x + this.size * 4 + this.tailWiggle[this.frame % this.tailWiggle.length], this.y + this.size - this.tailWiggle[this.frame % this.tailWiggle.length]); //Bottom of tail
    ctx.lineTo(this.x + this.size * 3, this.y + this.size / 2); // Tail join
    ctx.lineTo(this.x + this.size * 2, this.y + this.size); //Bottom of body
    ctx.lineTo(this.x + this.size, this.y + this.size); //Bottom of head
    ctx.closePath();
    //ctx.lineTo(this.x, this.y + this.size / 2); // Front of head
    ctx.fill();
    if (this.x + this.size * 4 < 0) {
        this.x = width + this.size * 4 + 10;
    }
    if (this.y + this.size > height) {
        this.y -= 1;
    }
    if (this.y > height / 2 - 10) this.inwater = false;
    else this.inwater = true;
    if (!this.inwater) if (this.y > this.targetY) {
        this.y -= this.speed * this.mass;
    }
    if (this.y < this.targetY) {
        this.y += this.speed * this.mass;
    }
    this.frame += 1;
    this.ox = this.x;
    this.oy = this.y;
};

function Rod() {
    this.length = 10;
    this.points = [];
    this.fish = null;
    for (var i = 0; i < this.length; i++) {
        this.points.push({
            pos: {
                x: 20 * i,
                y: 10
            },
            vx: 0,
            vy: 0,
            lx: 0,
            ly: 0,
            nx: 0,
            ny: 0
        });
    }
    this.canHook = true;
    this.lineLength = 6;
}

Rod.prototype.update = function () {
    for (var i = 0; i < this.points.length; i++) {
        if (i == 0) {
            var c = this.points[i];
            var n = this.points[i + 1];
            var difX = c.pos.x - mx;
            var difY = c.pos.y - my;
            var d = Math.sqrt(difX * difX + difY * difY);
            var diff = (this.lineLength - d) / d;
            var tx = difX * 0.5 * diff;
            var ty = difY * 0.5 * diff;

            c.pos.x += tx;
            c.pos.y += ty;
            n.pos.x += tx;
            n.pos.y += ty;
        }
        if (i < this.points.length - 1) {
            var c = this.points[i];
            var n = this.points[i + 1];
            var difX = c.pos.x - n.pos.x;
            var difY = c.pos.y - n.pos.y;
            var d = Math.sqrt(difX * difX + difY * difY);
            var dif = (this.lineLength - d) / d;
            var transX = difX * 0.5 * dif;
            var transY = difY * 0.5 * dif;
            if (c.pos.x < 0) {
                c.pos.x = 0;
                if (c.vx < 0) {
                    c.vx *= -1;
                }
            }
            if (c.pos.x > width) {
                c.pos.x = width;
                if (c.vx > 0) {
                    c.vx *= -1;
                }
            }
            c.vx = c.pos.x - c.lx;
            c.vy = c.pos.y - c.ly;
            c.nx = c.pos.x + c.vx;
            c.ny = c.pos.y + c.vy + 0.6;
            c.lx = c.pos.x;
            c.ly = c.pos.y;
            c.pos.x = c.nx;
            c.pos.y = c.ny;
            c.pos.x += transX;
            c.pos.y += transY;
            n.pos.x -= transX;
            n.pos.y -= transY;

        }
    }
    for (var i = 0; i < entitys.length; i++) {
        if (!this.canHook) break;
        var c = entitys[i];
        if (c instanceof Fish) {
            var lp = this.points[this.points.length - 1];
            var hx = lp.pos.x;
            var hy = lp.pos.y;
            var fx = c.x;
            var fy = c.y;
            if (hx >= fx && hx <= fx + c.size && hy >= fy && fy <= fy + c.size) {
                c.hooked = true;
                this.canHook = false;
                this.fish = c;
            }
        }
    }
    if (this.fish != null) {
        var lp = this.points[this.points.length - 1];
        var cs = this.fish.y;
        this.fish.x = lp.pos.x;
        this.fish.y = lp.pos.y;
        var vSpeed = cs - this.fish.y;
        var waves = getWaves();
        var wave = Math.floor(this.fish.x / (width / waves.numwaves));
        if (this.fish.y != this.fish.oy && this.fish.y >= waves.waves[wave].pos.y) waves.waves[wave].speed = vSpeed;
    }
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);
    for (var i = 0; i < this.points.length; i += 1) {
        ctx.lineTo(this.points[i].pos.x, this.points[i].pos.y);
    }
    ctx.stroke();
}

function getRod() {
    for (var i = 0; i < entitys.length; i++) {
        if (entitys[i] instanceof Rod) return entitys[i]
    }
}

function update() {
    ctx.clearRect(0, 0, width, height);
    var i;
    for (i = 0; i < entitys.length; i++) {
        entitys[i].update();
    }
    requestAnimationFrame(update);
}



function changeGamemode(newGamemode) {
    if (newGamemode == 0) {
        entitys.push(new Wave());
        // entitys.push(new Rod());
        update();
    } else if (newGamemode == 1) {
        entitys = [];
        entitys.push(new Wave());
        entitys.push(new Rod());
        var i;
        for (i = 0; i < 8; i += 1) {
            entitys.push(new Fish(Math.floor(Math.random() * width), 150 + Math.floor(Math.random() * 100)));
        }
    } else {

    }
    gamemode = newGamemode;
}

canvas.onmousemove = function (event) {
    mx = event.layerX;
    my = event.layerY;
}

canvas.onmousedown = function (event) {
    if (gamemode == GameModes.title) {
        var x = event.layerX;
        var y = event.layerY;
        for (var i = 0; i < entitys.length; i++) {
            var c = entitys[i];
            if (c instanceof Button) {
                if (x >= c.rect.x && y >= c.rect.y && x < c.rect.x + c.rect.w && y < c.rect.y + c.rect.h) {
                    c.click();
                }
            }
        }
    } else if (gamemode == GameModes.game) {
        var c = getRod();
        if (!c.canHook) {
            c.fish.hooked = false;
            c.canHook = true;
            c.fish = null;
        }
    }
}

function Button(y, h, text) {
    this.y = y;
    this.h = h;
    this.text = text;
    this.width = 0;
    this.rect = null;
}

Button.prototype.update = function () {
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    var x = width / 2 - ctx.measureText("" + this.text).width / 2;
    var y = this.y - 13;
    if (this.width == 0) this.width = ctx.measureText("" + this.text).width + 3 * 30;
    ctx.strokeRect(x - 100, y, this.width * 2, this.h);
    ctx.fillText("" + this.text, x, this.y);
    if (this.rect == null) {
        this.rect = {
            x: x - 100,
            y: y,
            w: this.width * 2,
            h: this.y
        }
    }
}

Button.prototype.click = function () {
    if (this.text == "Play") changeGamemode(1);
}

function init() {
    changeGamemode(0);
     entitys.push(new Button(70, 20, "Play"));
     entitys.push(new Button(100, 20, "Help"));
     getWaves().waves[50].speed = 100;
}
init();
