import {Rect} from "./RectUtils.js"
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let currentKey = new Map();
class World {
    constructor(x,y) {
        this.bounds = new Rect(x,y,canvas.width/2,canvas.height/2)
    }
    draw() {
        ctx.lineWidth = 5
        ctx.strokeRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
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
            ctx.restore(); // Use restore to revert the transformation
        } else {
            ctx.drawImage(this.image, 0, this.AnimationY, 32, 32, this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        }
        
        this.frameRate += this.frameIncerment
        if (this.AnimationY < this.TotalFrames * 32) {
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
        if (currentWorld === space) {
            if (this.bounds.y <= (space.bounds.y - space.bounds.h)) {
                this.bounds.y = space.bounds.y - space.bounds.h + 50
                this.bounds.x -= 50;
                this.YVelocity = 0;
            }
            if (this.bounds.y >= (canvas.height) - this.bounds.h) {
                this.grounded = true;
                this.bounds.y = (canvas.height) - (this.bounds.h + 2)
            }

            console.log(this.bounds.y,space.bounds.y)
        } 
        if (currentWorld === desert) {
            if (this.bounds.y >= (canvas.height/2) - this.bounds.h) {
                this.grounded = true;
                this.bounds.y = (canvas.height/2) - (this.bounds.h + 2)
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
                    currentWorld = forest
                }
            }, 100);
        }
        if (currentWorld === forest) {
            if (this.bounds.y >= (canvas.height/2) - this.bounds.h) {
                this.grounded = true;
                this.bounds.y = (canvas.height/2) - (this.bounds.h + 2)
            }
            if (this.bounds.x + this.bounds.w >= canvas.width/2) {
                this.bounds.x = ((canvas.width/2)-this.bounds.w-1)
                this.WALLED = true;
                this.XVelocity = 0;
                this.friction = 0;
            } else {
                this.WALLED = false;
            }
            setTimeout(() => {
                if (this.WALLED && currentKey.get(" ")) {
                    currentWorld = desert
                }
            }, 100);
        }
        if (currentKey.get(" ") && this.grounded) {
            this.grounded = false
            this.YVelocity -= 10
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
let forest = new World(0,0);
let desert = new World(canvas.width/2,0)
let plains = new World(canvas.width/2,canvas.height/2)
let space = new World(0,canvas.height)
let player = new Player();
let currentWorld = forest;

function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    player.draw();
    player.update();
    ctx.strokeStyle = "#228B22"
    forest.draw();
    ctx.strokeStyle = "#FAD5A5"
    desert.draw();
    ctx.strokeStyle = "#c0ff6d"
    plains.draw();
    ctx.strokeStyle = "black"
    space.draw();
    console.log(currentKey)
    requestAnimationFrame(loop)
}
function init() {
    keyboardInit();
    loop();
}
init();
