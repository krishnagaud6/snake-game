let inputDir = {x:0, y:0};

let foodSound = new Audio('music/food.mp3');
let gameOverSound = new Audio('music/gameover.mp3');
let moveSound = new Audio('music/move.mp3');
let musicSound = new Audio("music/music.mp3");

let speed = 5;
let score = 0;
let lastPaintTime = 0;

let snakeArr = [{x:13, y:15}];
let food = {x:6, y:7};

const gridSize = 18;

let board = document.getElementById("board");
let scoreBox = document.getElementById("scoreBox");
let highScoreBox = document.getElementById("highScoreBox");



// Load high score
let highScore = localStorage.getItem("highScore") || 0;
highScoreBox.innerHTML = "High Score: " + highScore;



// Main loop
function main(ctime){
    window.requestAnimationFrame(main);

    if((ctime - lastPaintTime) < (1000 / speed)){
        return;
    }

    lastPaintTime = ctime;
    gameEngine();
}



// Collision detection
function isCollide(snake){

    for(let i = 1; i < snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }

    if(snake[0].x > gridSize || snake[0].x < 1 ||
       snake[0].y > gridSize || snake[0].y < 1){
        return true;
    }

    return false;
}



function gameEngine(){

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    // Collision
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();

        inputDir = {x:0, y:0};
        alert("Game Over");

        snakeArr = [{x:13, y:15}];
        score = 0;
        speed = 5;

        return;
    }


    // Food eaten
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        foodSound.play();

        score++;
        scoreBox.innerHTML = "Score: " + score;

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreBox.innerHTML = "High Score: " + highScore;
        }

        speed += 0.2;

        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        food = {
            x: Math.round(2 + (gridSize-2) * Math.random()),
            y: Math.round(2 + (gridSize-2) * Math.random())
        };
    }


    // Render
    board.innerHTML = "";

    snakeArr.forEach((e, index)=>{
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }

        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}



window.requestAnimationFrame(main);



// Controls
window.addEventListener('keydown', e=>{

   // Start music once
   if(inputDir.x === 0 && inputDir.y === 0){
       musicSound.loop = true;
       musicSound.play();
   }

   moveSound.play();

   switch(e.key){
       case "ArrowUp":
            inputDir = {x:0, y:-1};
       break;

       case "ArrowDown":
            inputDir = {x:0, y:1};
       break;

       case "ArrowLeft":
            inputDir = {x:-1, y:0};
       break;

       case "ArrowRight":
            inputDir = {x:1, y:0};
       break;
   }
});
