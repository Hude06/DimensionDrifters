import { ParticleSource } from "./Particals.js";
import {Rect} from "./RectUtils.js"
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let currentKey = new Map();
let data = null
class Gost {
    constructor() {
        this.bounds = new Rect(200,10,40,40)
        this.image = new Image();
        this.image.src = "./Assets/Gost.png"
        this.speed = 1;
        this.FLIPPED = false;
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {  
        if (player.bounds.x >= this.bounds.x) {
            this.bounds.x += this.speed
        }
        if (player.bounds.x <= this.bounds.x) {
            this.bounds.x -= this.speed
        }
        if (player.bounds.y >= this.bounds.y) {
            this.bounds.y += this.speed
        }
        if (player.bounds.y >= this.bounds.y) {
            this.bounds.y += this.speed
        }
    }
}
class Player {
    constructor() {
        this.bounds = new Rect(canvas.width/2-200,10,65,65)
        this.wall1 = new Rect(this.bounds.x-10,this.bounds.y,this.bounds.w,this.bounds.h)
        this.image = new Image();
        this.image.src = "./Assets/ChikBoy/ChikBoy_idle.png"
        this.speed = 1;
        this.XVelocity = 0;
        this.gravity = 0.1;
        this.YVelocity = 0.5;
        this.grounded = false;
        this.friction = 0.01;
        this.currentFriction = 0;
        this.maxSpeed = 5;
        this.WALLED = false;
        this.AnimationY = 0;
        this.frameIncerment = 2;
        this.frameRate = 0;
        this.frameMax = 16;
        this.TotalFrames = 5;
        this.FLIPPED = false;

    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        if (this.FLIPPED) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, 0, this.AnimationY, 32, 32, -this.bounds.x - this.bounds.w, this.bounds.y, this.bounds.w, this.bounds.h);
            ctx.restore();
        } else {
            ctx.drawImage(this.image, 0, this.AnimationY, 32, 32, this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        }       
        this.frameRate += this.frameIncerment
        if (this.AnimationY <= this.TotalFrames * 32) {
            if (Math.floor(Math.round(this.frameRate)) === this.frameMax) {
                this.AnimationY += 32
                this.frameRate = 0
            }            
        } else {
            this.AnimationY = 0;
        }
    }
    update() {
        this.YVelocity += this.gravity
        this.bounds.y += this.YVelocity;
        this.bounds.x += this.XVelocity;
        if (this.XVelocity < 0) {
            this.wall1.x = this.bounds.x-20,
            this.wall1.y = this.bounds.y,
            this.wall1.w = this.bounds.w/2,
            this.wall1.h = this.bounds.h + 10
        }
        if (this.XVelocity > 0) {
            this.wall1.x = this.bounds.x+60,
            this.wall1.y = this.bounds.y,
            this.wall1.w = this.bounds.w/2,
            this.wall1.h = this.bounds.h + 10
        }
        if (this.XVelocity > this.maxSpeed) {
            this.XVelocity = this.maxSpeed - 0.1
        }
        if (this.bounds.y >= (canvas.height-2) - this.bounds.h) {
            this.grounded = true;
            this.bounds.y = canvas.height- (this.bounds.h + 1)
        }
        if (currentKey.get(" ") && this.grounded) {
            this.grounded = false
            this.YVelocity -= 4
            this.TotalFrames = 12
            this.image.src = "./Assets/ChikBoy/ChikBoy_jump.png"
        }
        if (currentKey.get("a") || currentKey.get("ArrowLeft")) {
            this.XVelocity -= 0.1
            this.currentFriction = 0
            this.TotalFrames = 5;
            this.image.src = "./Assets/ChikBoy/ChikBoy_run.png"
            this.FLIPPED = true;
        } else if (currentKey.get("d") || currentKey.get("ArrowRight")) {
            this.XVelocity += 0.1
            this.currentFriction = 0
            this.TotalFrames = 5;
            this.image.src = "./Assets/ChikBoy/ChikBoy_run.png"
            this.FLIPPED = false;

        } else {
            if (this.grounded) {
                this.YVelocity = 0;
                if ((Math.floor(Math.round(this.XVelocity)) !== 0)) {
                    this.TotalFrames = 3;
                    this.image.src = "./Assets/ChikBoy/ChikBoy_floor_slide.png"
                } else {
                    this.TotalFrames = 5;
                    this.image.src = "./Assets/ChikBoy/ChikBoy_idle.png"
                }
                if ((this.XVelocity) !== 0) {
                    this.currentFriction += this.friction
                    if (this.XVelocity > 0) {
                        this.XVelocity -= this.currentFriction
                    }
                    if (this.XVelocity < 0) {
                        this.XVelocity += this.currentFriction
                    }
                }
            }
        }
    }
}
const SCALE = 3.04
const TILE_TO_IMAGE = {
    1:new Image(),
    2:new Image(),
    3:new Image(),
    4:new Image()
}
TILE_TO_IMAGE[1].src = "./Assets/Brick.png"
TILE_TO_IMAGE[2].src = "./Assets/Chest.png"
TILE_TO_IMAGE[3].src = "./Assets/Chain.png"
TILE_TO_IMAGE[4].src = "./Assets/Portal.png"
class Layer {
    constructor(layer) {
        this.layer = layer
    }
    draw() {
        for (let i = 0; i < this.layer.data.length; i++) {
            let cell = this.layer.data[i]
            let img = TILE_TO_IMAGE[cell]
            if (cell !== 0) {
                let x = i % 40
                let y = Math.floor(i / 40)
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img,x*14*SCALE,y*14*SCALE,14*SCALE,14*SCALE)
            }
        }
    }
}
class Camera {
    constructor() {
        this.bounds = new Rect(10,10,10,10)
    }
    draw() {

    }
    update() {

    }
}
let background = null
let chain = null;
let chests = null;
let portals = null;
let player = new Player();
let gost = new Gost();
let camera = new Camera();
async function ParseTitleData() {
    const response = await fetch("./TileDATA.json");
    const data = await response.json();
    return data
}
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function loop() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    camera.update();
    let tileX = Math.floor(player.bounds.x / 14 / SCALE)
    let tileY = Math.floor(player.bounds.y / 14 / SCALE)
    let left_bottom_cell = chests.layer.data[((tileY+1)*40)+tileX]
    let right_bottom_cell = chests.layer.data[((tileY+1)*40)+tileX+1]
    if (right_bottom_cell === 2) {
        player.XVelocity = 0;
        player.bounds.x -= 20;
        alert("You Got 1 Coin")
    }
    if (left_bottom_cell === 2) {
        player.XVelocity = 0;
        player.bounds.x += 1
    }

    //BACKGROUND STUFF DRAW ON TOP OF
    background.draw();
    chain.draw();
    chests.draw();
    gost.draw();
    portals.draw();
    gost.update();
    //DRAWING EVERYTHING ELSE
    player.update();
    player.draw();
    requestAnimationFrame(loop)
}
async function init() {
    data = await ParseTitleData();
    background = new Layer(data.layers[0]);
    chain = new Layer(data.layers[1]);
    chests = new Layer(data.layers[2]);
    console.log(data.layers[3]);
    portals = new Layer(data.layers[3]);
    keyboardInit();
    loop();
}
await init();
