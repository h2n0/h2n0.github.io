window.onload = function () {
    "use strict";
    (function () {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
    }());

    var canvas = document.getElementById("can"),
        ctx = canvas.getContext("2d"),
        width = 500,
        height = 200,
        entitys = [],
        money = 200;

    canvas.width = width;
    canvas.height = height;

    function setStats(tower) { // Fills the stats HTML with stats from the currently slected tower
        var k = document.getElementById("kills"),
            e = document.getElementById("exp"),
            kills,
            exp;
        if (tower === null) {
            k.innerHTML = "";
            e.innerHTML = "";
        } else {
            kills = tower.kills;
            exp = tower.exp;
            k.innerHTML = "Kills:" + kills;
            e.innerHTML = "EXP:" + exp;
        }
    }

    function checkDist(obj, obj2) {// Checks the distance between (x1,y1) and (x2,y2)
        var x = obj2.x - obj.x,
            y = obj2.y - obj.y;
        return Math.sqrt(x * x + y * y);
    }

    function Enemy(ox, oy, size) {// Enemy initalizer
        this.x = ox;
        this.y = oy;
        this.width = 10;
        this.size = size;
        this.reset();
    }

    Enemy.prototype.reset = function () { //This is called when an enemy is created
        this.speed = this.size;
        this.vx = this.speed;
        this.vy = 0;
        this.colors = ["#000", "#F00", "#0cf"];// Ballon color array
    };

    Enemy.prototype.update = function () { // Called from the update method to keep the ballon moving
        this.x += this.vx;
        this.y += this.vy;
        if (this.isIn(485, 490, 5, 15)) {// All the point that tell the ballons what to do
            this.vy = this.speed;
            this.vx = 0;
        } else if (this.isIn(485, 490, 70, 80)) {
            this.vx = -this.speed;
            this.vy = 0;
        } else if (this.isIn(5, 10, 70, 80)) {
            this.vx = 0;
            this.vy = this.speed;
        } else if (this.isIn(5, 10, 140, 150)) {
            this.vx = this.speed;
            this.vy = 0;
        } else if (this.isIn(500 + this.width / 2, 510, 140, 150)) {
            this.x = -10;
            this.y = 10;
        }
        ctx.fillStyle = this.colors[this.size];
        ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
    };

    Enemy.prototype.downsize = function () {
        this.size -= 1;
        var i,
            ne;
        for (i = 0; i < 2; i += 1) {
            ne = new Enemy(this.x + (this.vx * this.width * i), this.y + (this.vy * this.width * i), this.size);
            ne.vx = ne.speed * (this.vx / this.speed);
            ne.vy = ne.speed * (this.vy / this.speed);
            entitys.push(ne);
        }
    };

    Enemy.prototype.isIn = function (x1, x2, y1, y2) {
        if (this.x >= x1 && this.x <= x2 && this.y >= y1 && this.y <= y2) {
            return true;
        } else {
            return false;
        }
    };

    function Projectile(x, y, dir, owner) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(dir) * 3;
        this.vy = Math.sin(dir) * 3;
        this.width = 4;
        this.tower = owner;
    }

    Projectile.prototype.update = function () {
        this.x -= this.vx;
        this.y -= this.vy;
        var i, target;
        for (i = 0; i < entitys.length; i += 1) {
            target = entitys[i];
            if (target instanceof Enemy) {
                if (checkDist(this, target) <= this.width + target.width) {
                    this.removed = true;
                    money += 10;
                    this.tower.stats.kills += 1;
                    this.tower.stats.exp += 10;
                    if (this.tower.stats.exp >= 100) {
                        this.tower.levelUp();
                    }
                    if (this.tower.selected) {
                        setStats(this.tower.stats);
                    }
                    if (target.size >= 2) {
                        target.removed = true;
                        target.downsize();
                        break;
                    } else {
                        target.removed = true;
                        break;
                    }
                }
            }
        }
        if ((this.x + this.width / 2 <= 0 && this.y + this.width / 2 <= 0) || (this.x - this.width / 2 >= width && this.y - this.width / 2 >= height)) {
            this.removed = true;
        }
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
    };

    function Particle(x, y) {
        this.x = x;
        this.y = y;
        this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        this.x1 = x;
        this.y1 = y;
        this.z1 = 2;
        this.x2 = Math.random() * 0.3;
        this.y2 = Math.random() * 0.2;
        this.z2 = Math.random() * 0.7 + 2;
        this.age = 0;
        this.width = 4;
    }

    Particle.prototype.update = function () {
        this.age += 1;
        if (this.age > 45) {
            this.removed = true;
        }
        this.x1 += this.x2;
        this.y1 += this.y2;
        this.z1 += this.z2;
        if (this.z1 < 0) {
            this.z1 = 0;
            this.z2 *= -0.5;
            this.x2 *= 0.6;
            this.y2 *= 0.6;
        }
        this.z2 -= 0.15;
        this.x = this.x1;
        this.y = this.y1;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2 - this.z1, this.width, this.width);
    };

    function Tower(ox, oy) {
        this.cooldown = 60;
        this.crntcool = 0;
        this.x = ox;
        this.y = oy;
        this.width = 10;
        this.stats = {
            kills: 0,
            exp: 0
        };
        this.selected = false;
        this.range = 40;
        this.extraRange = 0;
        this.levelRange = 0;
    }

    Tower.prototype.update = function () {
        var dir = 0,
            i,
            target,
            x,
            y;
        if (this.crntcool > 0) {
            this.crntcool -= 1;
        }
        if (this.crntcool === 0) {
            for (i = 0; i < entitys.length; i += 1) {
                if (this.crntcool > 0) {
                    break;
                }
                target = entitys[i];
                if (target instanceof Enemy) {
                    if (Math.random() * 4 < 1) {
                        x = this.x - target.x;
                        y = this.y - target.y;
                        if (checkDist(this, target) <= this.range + this.extraRange) {
                            dir = Math.atan2(y, x);
                            this.crntcool = this.cooldown;
                            if (dir !== 0) {
                                entitys.push(new Projectile(this.x, this.y, dir, this));
                            }
                        }
                    }
                }
            }
        }
        if (this.selected) {
            if (this.extraRange !== 0) {
                ctx.fillStyle = "rgba(0, 255, 102,0.2)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.range + this.extraRange, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = "rgba(0,200,255,0.4)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.fill();
        }
        if (this.leveled) {
            for (i = 0; i < 10; i += 1) {
                entitys.push(new Particle(this.x, this.y));
            }
            this.leveled = false;
        }
        ctx.fillStyle = "#777";
        ctx.fillRect(this.x - this.width / 2, this.y - this.width / 2, this.width, this.width);
    };

    Tower.prototype.levelUp = function () {
        this.stats.exp = 0;
        if (this.extraRange < 30) {
            this.extraRange += 5;
        }
        if (this.cooldown > 40) {
            this.cooldown -= 5;
        }
        this.leveled = true;
    };

    function spawnEnemys(amt, s) {
        var i,
            size = s || 1;
        if (amt === null) {
            amt = 10;
        }
        for (i = 0; i < amt; i += 1) {
            entitys.push(new Enemy(-10 - (i * 15), 10, size));
        }
    }

    function checkEnemyAmt() {
        var amt = 0,
            i;
        for (i = 0; i < entitys.length; i += 1) {
            if (entitys[i] instanceof Enemy) {
                amt += 1;
            }
        }
        return amt;
    }

    function update() {
        ctx.clearRect(0, 0, width, height);
        var i, c;
        for (i = 0; i < entitys.length; i += 1) {
            c = entitys[i];
            c.update();
            if ((c instanceof Projectile || c instanceof Enemy || c instanceof Particle)) {
                if (c.removed) {
                    entitys.splice(i, 1);
                }
            }
        }
        if (checkEnemyAmt() === 0) {
            spawnEnemys(16, 2);
        }
        ctx.fillStyle = "#000";
        ctx.fillText("Cash:" + money, 10, 10);
        window.requestAnimationFrame(update);
    }

    function deselect() {
        var i;
        for (i = 0; i < entitys.length; i += 1) {
            if (entitys[i] instanceof Tower) {
                entitys[i].selected = false;
            }
        }
        setStats(null);
    }

    canvas.onmousedown = function (event) {
        event.preventDefault();
        var x = event.layerX,
            y = event.layerY,
            i,
            c,
            dx,
            dy,
            dist;
        for (i = 0; i < entitys.length; i += 1) {
            c = entitys[i];
            if (c instanceof Tower) {
                dx = c.x - x;
                dy = c.y - y;
                dist = Math.sqrt(dx * dx + dy * dy);
                deselect();
                if (dist <= c.width) {
                    setStats(c.stats);
                    c.selected = true;
                    return;
                }
            }
        }
        if (money >= 100 && event.detail === 2) {
            money -= 100;
            entitys.push(new Tower(event.layerX, event.layerY));
        }
    };

    function init() {
        spawnEnemys(16, 2);
        update();
    }

    init();
};
