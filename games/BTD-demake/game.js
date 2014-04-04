window.onload = function(){
    (function () {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
    })();

    var canvas = document.getElementById("can"),
        ctx = canvas.getContext("2d"),
        width = 500,
        height = 200,
        entitys = [],
        money = 200;

    canvas.width = width;
    canvas.height = height;
    
    function setStats(tower){
        var k = document.getElementById("kills"),
            e = document.getElementById("exp");
        if(tower == null){
            k.innerHTML = "";
            e.innerHTML = "";
            return;
        }
        var kills = tower.kills || 0,
            exp = tower.exp || 0;
        k.innerHTML = "Kills:"+kills;
        e.innerHTML = "EXP:"+exp;
    }
    
    function checkDist(obj,obj2){
        var x = obj2.x - obj.x,
            y = obj2.y - obj.y;
        return Math.sqrt(x * x + y * y)
    }

    function Enemy(ox){
        this.x = ox;
        this.width = 10;
        this.reset();
    }

    Enemy.prototype.reset = function () {
        this.speed = 0.75 * 3;
        this.y = 10;
        this.vx = this.speed;
        this.vy = 0;
    };

    Enemy.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if(this.isIn(485,490,5,15)){
            this.vy = this.speed;
            this.vx = 0;
        }
        else if(this.isIn(485,490,70,80)){
            this.vx = -this.speed;
            this.vy = 0;
        }else if(this.isIn(5,10,70,80)){
            this.vx = 0;
            this.vy = this.speed;
        }else if(this.isIn(5,10,140,150)){
            this.vx = this.speed;
            this.vy = 0;
        }else if(this.isIn(500+this.width/2,510,140,150)){
            this.x = -10;
            this.y = 10;
        }
        ctx.fillStyle="#F00";
        ctx.fillRect(this.x - this.width/2, this.y - this.width/2,this.width,this.width);
    };
    
    Enemy.prototype.isIn = function(x1,x2,y1,y2){
        if(this.x >= x1 && this.x <= x2 && this.y >= y1 && this.y <= y2)return true;
        else return false;
    }
    
    function Projectile(x,y,dir,owner){
        this.x = x;
        this.y = y;
        this.vx = Math.cos(dir) * 3;
        this.vy = Math.sin(dir) * 3;
        this.width = 4;
        this.tower = owner;
    }
    
    Projectile.prototype.update = function(){
        this.x -= this.vx;
        this.y -= this.vy;
        for(var i = 0; i < entitys.length; i++){
            var target = entitys[i];
            if(!(target instanceof Enemy))continue;
            else{
                if(checkDist(this,target) <= this.width + target.width){
                    this.removed = true;
                    target.removed = true;
                    money+=10;
                    this.tower.stats.kills++;
                    this.tower.stats.exp += 10;
                    if(this.tower.stats.exp >= 100)
                        this.tower.levelUp();
                }
            }
        }
        if((this.x + this.width/2 <= 0 && this.y + this.width / 2 <= 0) || (this.x - this.width/2 >= width && this.y - this.width/2 >= height))this.removed = true;
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(this.x - this.width/2, this.y - this.width/2,this.width,this.width);
    }
    
    function Tower(ox,oy){
        this.cooldown = 60;
        this.crntcool = 0;
        this.x = ox;
        this.y = oy;
        this.width = 10;
        this.stats = {
            kills:0,
            exp:0
        };
        this.selected = false;
        this.range = 40;
    }
    
    Tower.prototype.update = function(){
        if(this.crntcool > 0)this.crntcool --;
        if(this.crntcool == 0){
            var dir = 0;
                for(var i = 0; i < entitys.length; i++){
                    if(this.crntcool > 0)break;
                    var target = entitys[i];
                    if(!(target instanceof Enemy))continue;
                    else{
                        if(Math.random() * 4 < 1){
                            var x = this.x - target.x;
                            var y = this.y - target.y;
                            if(checkDist(this,target) <= this.range){
                                dir = Math.atan2(y,x);
                                this.crntcool = this.cooldown;
                                if(dir != 0)entitys.push(new Projectile(this.x,this.y,dir,this));
                            }
                        }
                    }
                }
        }
        if(this.selected){
            ctx.fillStyle = "rgba(0,200,255,0.4)";
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.range,0,Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle="#777";
        ctx.fillRect(this.x - this.width/2, this.y - this.width/2,this.width,this.width);
    }
    
    Tower.prototype.levelUp = function(){
        this.stats.exp = 0;
        this.range += 5;
        if(this.cooldown > 40)
            this.cooldown -= 5;
    }
    
    function spawnEnemys(amt){
        if(amt == null)amt = 10;
        for(var i = 0; i < amt; i++)
            entitys.push(new Enemy(-10 - (i * 15)));
    }
    
    function checkEnemyAmt(){
        var amt =0;
        for(var  i = 0; i < entitys.length; i++){
            if(entitys[i] instanceof Enemy)amt++;
        }
        return amt;
    }
    
    function update() {
        ctx.clearRect(0,0,width,height);
        for(var i = 0; i < entitys.length; i++){
            var c = entitys[i];
            c.update();
            if((c instanceof Projectile || c instanceof Enemy))if(c.removed)entitys.splice(i,1);
        }
        if(checkEnemyAmt() == 0)spawnEnemys(16);
        requestAnimationFrame(update);
    }
    
    canvas.onmousedown = function (event) {
        event.preventDefault();
        var x = event.layerX,
            y = event.layerY;
        for(var i = 0; i < entitys.length; i++){
            var c = entitys[i];
            if((c instanceof Tower)){
                var dx = c.x - x,
                    dy = c.y - y,
                    dist = Math.sqrt(dx * dx + dy * dy);
                if(dist <= c.width){
                    for(var i = 0; i < entitys.length; i++){
                        if(entitys[i] instanceof Tower)entitys[i].selected = false;
                    }
                    setStats(c.stats);
                    c.selected = true;
                    return;
                };
            }
        }
        if(money >= 100 && event.detail == 2){
            money -= 100;
            entitys.push(new Tower(event.layerX,event.layerY));
        }
        
        if(event.detail == 1){
            setStats(null);
            for(var i = 0; i < entitys.length; i++){
                if(entitys[i] instanceof Tower){
                    entitys[i].selected = false;
                }
            }
        }
    }
    
    function init(){
        console.log("init");
        spawnEnemys(16);
        update();
    }
    
    init();
}