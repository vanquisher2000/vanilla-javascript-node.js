//canvas
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
ctx.font = "50px Georgia"

let score = 0;
let gameFrame = 0;
let gameSpeed = 0;
let gameOver = false;
//mouse
let canvasBorder = canvas.getBoundingClientRect();
const mouse = {
    x : canvas.width/2,
    y : canvas.height/2,
    click : false
};
addEventListener("mousedown",(e)=>{
    mouse.x = e.x - canvasBorder.left;
    mouse.y = e.y - canvasBorder.top;
    mouse.click = true;
});
addEventListener("mouseup",()=>{
    mouse.click = false;
});
//player
class Player{
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.radius = 50;
        this.frame = 0;
        this.angel = 0;
    }
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        this.angel = Math.atan2(dy, dx);
        if(mouse.x !== this.x){
            this.x -= dx/30 ;
        }
        if(mouse.y !== this.y){
            this.y -= dy/30;
        }
    }
    draw(){
        if(mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x,this.y);
            ctx.lineTo(mouse.x,mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angel);
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,
                this.spriteWidth,this.spriteHeight,
                0 - 60,0 - 45,
                this.spriteWidth/4,this.spriteHeight/4);
        }else{
            ctx.drawImage(playerRight,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,
                this.spriteWidth,this.spriteHeight,
                0 - 60,0 - 45,
                this.spriteWidth/4,this.spriteHeight/4);
        }
        ctx.restore();
    }
}
const playerLeft = new Image();
playerLeft.src = "player-left.png";
const playerRight = new Image();
playerRight.src = "player-right.png";
const player = new Player();
//bubble
class Bubble{
    constructor(){
        this.x = Math.random()* canvas.width;
        this.y = canvas.height + 100;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.radius = 50;
        this.counted = false;
        this.sound = Math.random() >= 0.5? "sound1" : "sound2";
    }
    update(){
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dy*dy + dx*dx);
        
        this.y -= this.speed;
        
    }
    draw(){
        //ctx.fillStyle = "blue";
        //ctx.beginPath();
        //ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        //ctx.fill();
        //ctx.closePath();
        //ctx.stroke();
        ctx.drawImage(bubbleImage,this.x-65,this.y-65,
            this.radius*2.6,this.radius*2.6);
    }
}
const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "Plop.ogg";
const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "pop.ogg";
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = "bubble_pop_frame_01.png"
function bubbleHandler() {
    if(gameFrame % 50 === 0 ){
        bubblesArray.push(new Bubble())
    }
    for(let i = 0; i < bubblesArray.length;i++){
        bubblesArray[i].draw();
        bubblesArray[i].update();

        if(bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i,1);
            i--;
        }
        else if(bubblesArray[i].radius + player.radius > bubblesArray[i].distance && !bubblesArray[i].counted){
            bubblesArray[i].counted = true;
            if(bubblesArray[i].sound === "sound1"){
                //bubbleSound1.play();
            }else{
                //bubbleSound2.play();
            }
            bubblesArray.splice(i,1);
            i--;
            score++;
        }
    }
}
//enemies
const enemyImage = new Image();
enemyImage.src = "enemy.png"
class Enemy{
    constructor() {
        this.x = canvas.width + 200;
        this.y = Math.random()*(canvas.height-150) + 90;
        this.distance;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = Math.random()*2 + 2;
        this.radius = 50;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw(){
        /*ctx.fillStyle = "red";*/
        /*ctx.beginPath();*/
        /*ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);*/
        /*ctx.fill();*/
        ctx.drawImage(enemyImage,
            this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,
            this.spriteWidth,this.spriteHeight,
            this.x - 50,this.y - 50,
            this.spriteWidth/4,this.spriteHeight/4);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.radius*2){
            this.x = canvas.width + 200;
            this.y = Math.random()*(canvas.height-150) + 90;
            this.speed = Math.random()*2 + 2;
        }
        if(gameFrame % 5){
            this.frame++;
            if(this.frame === 12) this.frame = 0;
            if(this.frame === 3 ||
            this.frame === 7 ||
            this.frame === 11){
                this.frameX = 0;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        if(this.distance < this.radius + player.radius){
            gameoverHandler();
        }
    }
}
const enemy1 = new Enemy();
function  enemyHandler(){
     enemy1.draw();
     enemy1.update();
}
//gameover
function gameoverHandler(){
     ctx.fillStyle = "white";
     ctx.fillText("GAMEOVER your score is " + score,110,250);
     gameOver = true;
}
//background
const background = new Image();
background.src = "background1.png"
const BG = {
    x1:0,
    x2:canvas.width,
    y:0,
    width:canvas.width,
    height:canvas.height
};
function backgroundHandler(){
    BG.x1 -= gameSpeed;
    if(BG.x1 < 0) BG.x1 = canvas.width;
    ctx.drawImage(background,BG.x1,BG.y,BG.width,BG.height);
}
//animation
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    player.draw();
    backgroundHandler();
    bubbleHandler();
    enemyHandler();
    gameFrame++;
    ctx.fillStyle = "black";
    ctx.fillText("score : " + score, 10,50);
    if(!gameOver)requestAnimationFrame(animate);
}
animate();

//fixing mouse position bug
window.addEventListener("resize",()=>{
    canvasBorder = canvas.getBoundingClientRect();
})