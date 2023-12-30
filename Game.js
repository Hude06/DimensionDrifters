import {Rect} from "./RectUtils.js"
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let currentKey = new Map();
let data = null
class World {
    constructor(x,y) {
        this.bounds = new Rect(x,y,canvas.width/2,canvas.height/2)
        this.cameraBound = new Rect(x+70,y+70,canvas.width/2-150,canvas.height/2-150)
    }
    draw() {
        ctx.lineWidth = 5
        ctx.strokeRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.lineWidth = 6;
        ctx.strokeRect(this.cameraBound.x,this.cameraBound.y,this.cameraBound.w,this.cameraBound.h)
    }
}
class Player {
    constructor() {
        this.bounds = new Rect(canvas.width/2-200,10,65,65)
        this.image = new Image();
        this.image.src = "./Assets/ChikBoy/ChikBoy_idle.png"
        this.speed = 1;
        this.XVelocity = 0;
        this.gravity = 0.1;
        this.YVelocity = 0.5;
        this.grounded = false;
        this.friction = 0;
        this.maxSpeed = 5;
        this.WALLED = false;
        this.AnimationY = 0;
        this.frameIncerment = 2;
        this.frameRate = 0;
        this.frameMax = 16;
        this.TotalFrames = 6;
        this.FLIPPED = false;
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = "red"
        ctx.strokeRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
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
        if (this.XVelocity > this.maxSpeed) {
            this.XVelocity = this.maxSpeed - 0.1
        }
        if (currentWorld === Universe2) {
            if (this.bounds.y >= (Universe2.cameraBound.y+Universe2.cameraBound.h) - this.bounds.h) {
                this.grounded = true;
                this.bounds.y = (Universe2.cameraBound.y+Universe2.cameraBound.h) - (this.bounds.h + 1)
            }
            if (this.bounds.x <= canvas.width/2) {
                console.log("New WALLED")
                this.bounds.x = ((canvas.width/2 + 1))
                this.WALLED = true;
                this.XVelocity = 0;
                this.friction = 0;
            } else {
                this.WALLED = false;
            }
            setTimeout(() => {
                if (this.WALLED && currentKey.get(" ")) {
                    currentWorld = Universe1
                }
            }, 100);
        }
        if (currentWorld === Universe1) {
            if (this.bounds.y >= (Universe1.cameraBound.y+Universe1.cameraBound.h) - this.bounds.h) {
                this.grounded = true;
                this.bounds.y = Universe1.cameraBound.y+Universe1.cameraBound.h - (this.bounds.h + 1)
            }
            if (this.bounds.x + this.bounds.w >= canvas.width/2-90) {
                this.bounds.x = ((canvas.width/2)-this.bounds.w-90)
                background.x -= 1
                this.WALLED = true;
                this.XVelocity = 0;
                this.friction = 0;
            } else {
                this.WALLED = false;
            }
            // setTimeout(() => {
            //     if (this.WALLED && currentKey.get(" ")) {
            //         currentWorld = desert
            //     }
            // }, 100);
        }
        if (currentKey.get(" ") && this.grounded) {
            this.grounded = false
            this.YVelocity -= 4
            this.TotalFrames = 12
            this.image.src = "./Assets/ChikBoy/ChikBoy_jump.png"
        }
        if (currentKey.get("a") || currentKey.get("ArrowLeft")) {
            this.XVelocity -= 0.1
            this.friction = 0
            this.TotalFrames = 6;
            this.image.src = "./Assets/ChikBoy/ChikBoy_run.png"
            this.FLIPPED = true;
        } else if (currentKey.get("d") || currentKey.get("ArrowRight")) {
            this.XVelocity += 0.1
            this.friction = 0
            this.TotalFrames = 6;
            this.image.src = "./Assets/ChikBoy/ChikBoy_run.png"
            this.FLIPPED = false;

        } else {
            if (this.grounded) {
                this.YVelocity = 0;
                if ((Math.floor(Math.round(this.XVelocity)) !== 0)) {
                    this.TotalFrames = 4;
                    this.image.src = "./Assets/ChikBoy/ChikBoy_floor_slide.png"
                } else {
                    this.TotalFrames = 6;
                    this.image.src = "./Assets/ChikBoy/ChikBoy_idle.png"
                }
                if ((this.XVelocity) !== 0) {
                    this.friction += 0.005
                    if (this.XVelocity > 0) {
                        this.XVelocity -= this.friction
                    }
                    if (this.XVelocity < 0) {
                        this.XVelocity += this.friction
                    }
                }
            }
        }
    }
}
const SCALE = 3

const TILE_TO_IMAGE = {
    1:new Image(),
    3: new Image()
}
TILE_TO_IMAGE[1].src = "./Assets/Brick.png"
TILE_TO_IMAGE[3].src = "./Assets/Chain.png"


class Layer {
    constructor(layer) {
        this.layer = layer
    }
    draw() {
        for (let i = 0; i < this.layer.data.length; i++) {
            let cell = this.layer.data[i]
            let img = TILE_TO_IMAGE[cell]
            if (cell !== 0) {
                let x = i % 30
                let y = Math.floor(i / 30) + 0.75
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img,x*14*SCALE,y*14*SCALE,14*SCALE,14*SCALE)
            }
        }
    }
}
let Universe1 = new World(0,0);
let Universe2 = new World(canvas.width/2,0);
let Universe3 = new World(canvas.width/2,canvas.height/2);
let Universe4 = new World(0,425);
let background = null
let chain = null;
let player = new Player();
let currentWorld = Universe1;
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
    background.draw();
    chain.draw();
    player.draw();
    player.update();
    ctx.strokeStyle = "#228B22"
    Universe1.draw();
    ctx.strokeStyle = "#FAD5A5"
    Universe2.draw();
    ctx.strokeStyle = "blue"
    Universe3.draw();
    ctx.strokeStyle = "black"
    Universe4.draw();
    requestAnimationFrame(loop)
}
async function init() {
    data = await ParseTitleData();
    background = new Layer(data.layers[0],"./Assets/Brick.png");
    chain = new Layer(data.layers[1],"./Assets/chain.png");
    console.log(chain)
    keyboardInit();
    loop();
}
await init();
