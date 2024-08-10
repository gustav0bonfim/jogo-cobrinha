const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

let snake = [{ x: 400, y: 400 }];
let direction = { x: 0, y: 0 };
const snakeSpeed = 10;

let foods = [];
const foodSize = snakeSpeed;

let monsters = [];
const monsterSpeed = 1;

let timeLeft = 1800; // 3 minutes

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFoods();
    drawMonsters();
    moveSnake();
    moveMonsters();
    checkCollisions();
    updateTimer();

    if (timeLeft > 0) {
        setTimeout(drawGame, 100);
    } else {
        alert("O tempo acabou! Você perdeu!");
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, snakeSpeed, snakeSpeed));
}

function drawFoods() {
    ctx.fillStyle = 'yellow';
    foods.forEach(food => ctx.fillRect(food.x, food.y, foodSize, foodSize));
}

function drawMonsters() {
    ctx.fillStyle = 'red';
    monsters.forEach(monster => ctx.fillRect(monster.x, monster.y, snakeSpeed, snakeSpeed));
}

function moveSnake() {
    const newHead = { x: snake[0].x + direction.x * snakeSpeed, y: snake[0].y + direction.y * snakeSpeed };
    snake.unshift(newHead);

    // Check if snake has eaten any food
    let ateFood = false;
    foods = foods.filter(food => {
        if (snake[0].x === food.x && snake[0].y === food.y) {
            ateFood = true;
            return false; // Remove the eaten food
        }
        return true;
    });

    if (!ateFood) {
        snake.pop(); // Remove last part if no food eaten
    } else {
        generateFood(); // Generate a new food
    }
}

function moveMonsters() {
    monsters.forEach(monster => {
        monster.x += monster.direction.x * monsterSpeed;
        monster.y += monster.direction.y * monsterSpeed;

        if (monster.x <= 0 || monster.x >= canvas.width - snakeSpeed) {
            monster.direction.x *= -1;
        }
        if (monster.y <= 0 || monster.y >= canvas.height - snakeSpeed) {
            monster.direction.y *= -1;
        }
    });
}

function checkCollisions() {
    // Collision with monsters
    monsters.forEach(monster => {
        // Check if the snake's head is in the same position as the monster
        if (
            snake[0].x < monster.x + snakeSpeed &&
            snake[0].x + snakeSpeed > monster.x &&
            snake[0].y < monster.y + snakeSpeed &&
            snake[0].y + snakeSpeed > monster.y
        ) {
            alert("Você foi pego por um monstro! Game Over!");
            timeLeft = 0;
        }
    });

    // Collision with walls (boundaries)
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        alert("Você bateu na parede! Game Over!");
        timeLeft = 0;
    }
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft > 0) {
        timeLeft--;
    }
}

function generateFood() {
    const food = {
        x: Math.floor(Math.random() * canvas.width / snakeSpeed) * snakeSpeed,
        y: Math.floor(Math.random() * canvas.height / snakeSpeed) * snakeSpeed
    };
    foods.push(food);
}

function generateMonster() {
    const monster = {
        x: Math.floor(Math.random() * canvas.width / snakeSpeed) * snakeSpeed,
        y: Math.floor(Math.random() * canvas.height / snakeSpeed) * snakeSpeed,
        direction: {
            x: Math.random() < 0.5 ? 1 : -1,
            y: Math.random() < 0.5 ? 1 : -1
        }
    };
    monsters.push(monster);
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Initial setup
for (let i = 0; i < 5; i++) {
    generateFood();
}
setInterval(generateMonster, 5000);

drawGame();
