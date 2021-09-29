const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 640;

var playerImage = new Image();
playerImage.src="monkeyPlayer.png"
playerImage.width = 64;
playerImage.height = 64;

var bananaImage = new Image();
bananaImage.src="bananer.png"
bananaImage.width = 64;
bananaImage.height = 64;

var evilImages = [];
evilImages[0] = new Image(); evilImages[0].src="excavator.png";
evilImages[1] = new Image(); evilImages[1].src="excavator2.png";
evilImages.forEach(evilImage => {
    evilImage.width = 64; evilImage.height = 64;
});


class Monkey{
    
    constructor(x, y, image){
        this.x = x;
        this.y = y;
        this.image = image;
    }

    drawPlayer(){
        context.drawImage(playerImage, this.x, this.y, 100, 100);
    }
}

class Banana{
    constructor(x, y, velocity){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    draw(){
        context.drawImage(bananaImage, this.x, this.y);
    }

    update(){
        this.x += this.velocity.x * 5;
        this.y += this.velocity.y * 5;
        this.draw();
    }
}

class Enemy{
    constructor(x, y, velocity){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    draw(){
        context.drawImage(evilImages[0], this.x-64, this.y);
    }

    update(){
        this.draw();
        this.x += this.velocity.x * 2;
        this.y += this.velocity.y * 2;
    }
}

class Enemy2{
    constructor(x, y, velocity){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    draw(){
        context.drawImage(evilImages[1], this.x-64, this.y);
    }

    update(){
        this.draw();
        this.x += this.velocity.x * 2;
        this.y += this.velocity.y * 2;
    }
}

const monkey = new Monkey(canvas.width/2 - playerImage.width, canvas.height/2-playerImage.height, playerImage);

const bananas = [];
const enemies = [];

function spawnEnemies(){
    setInterval(() =>{

        let x;
        let y;

        if(Math.random() < 0.5){
            x = (Math.random() < 0.5 ? -75 : canvas.width);
            y = (Math.random() * canvas.height);
        }else{
            x = (Math.random() * canvas.width);
            y = (Math.random() < 0.5 ? -75 : canvas.height);
        }
        
        const angle = Math.atan2(canvas.height / 2 - playerImage.height/8 - y, canvas.width/2 - playerImage.width/8 - x);
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)};

        enemies.push(Math.random() > 0.5 ? new Enemy(x, y, velocity) : new Enemy2(x, y, velocity));
    }, 1000);
}

function animate(){
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    monkey.drawPlayer();
    bananas.forEach(banana => {
        banana.update();
    });
    enemies.forEach((enemy, index) =>{
        enemy.update();
        //enemy collision with player
        if(Math.hypot(enemy.x - canvas.width/2+50, enemy.y - canvas.height/2+50) - 75 < 1){
            setTimeout(() =>{
                enemies.splice(index, 1);
            }, 0);
        }
        //enemy collision with banana
        bananas.forEach(banana => {
            if(Math.hypot(enemy.x - banana.x, enemy.y - banana.y) -35 < 1){
                setTimeout(() =>{
                    enemies.splice(index, 1);
                    bananas.splice(index, 1);
                }, 0);
            }
        });
    });
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {x: Math.cos(angle), y: Math.sin(angle)};
    bananas.push(new Banana(canvas.width/2-32, canvas.height/2-32, velocity)); //try make it based off where mouse is on canvas /:
})

animate();
spawnEnemies();
