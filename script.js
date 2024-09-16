const cells = document.querySelectorAll('.cell');
const messageDisplay = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const resetStatsButton = document.getElementById('reset-stats-button');
const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');
const drawsDisplay = document.getElementById('draws');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let isPlayerTurn = true;
let xWins = 0;
let oWins = 0;
let draws = 0;
let difficulty = 'easy'; // Уровень сложности

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Функция для сохранения состояния игры
function saveGame() {
    const gameData = {
        currentPlayer: currentPlayer,
        gameState: gameState,
        xWins: xWins,
        oWins: oWins,
        draws: draws
    };
    localStorage.setItem('ticTacToeGame', JSON.stringify(gameData));
}

// Функция для загрузки состояния игры
function loadGame() {
    const savedGame = localStorage.getItem('ticTacToeGame');
    if (savedGame) {
        const gameData = JSON.parse(savedGame);
        currentPlayer = gameData.currentPlayer;
        gameState = gameData.gameState;
        xWins = gameData.xWins;
        oWins = gameData.oWins;
        draws = gameData.draws;

        // Обновление статистики
        xWinsDisplay.textContent = xWins;
        oWinsDisplay.textContent = oWins;
        drawsDisplay.textContent = draws;

        gameActive = true;

        // Обновление игрового поля
        cells.forEach((cell, index) => {
            cell.textContent = gameState[index];
            if (gameState[index] === 'X') {
                cell.classList.add('x');
            } else if (gameState[index] === 'O') {
                cell.classList.add('o');
            }
        });

        // Проверка на наличие победителя
        checkResult();
    }
}

// Функция для обработки клика по клетке
function handleCellClick(clickedCell, clickedCellIndex) {
    if (gameState[clickedCellIndex] !== "" || !gameActive || !isPlayerTurn) {
        return;
    }
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // Добавление класса для анимации
    clickedCell.classList.add(currentPlayer.toLowerCase());

    checkResult();
    saveGame(); // Сохранение состояния игры после хода

    if (gameActive) {
        isPlayerTurn = false; // Теперь ход компьютера
        setTimeout(computerMove, 500); // Задержка перед ходом компьютера для эффекта
    }
}

// Функция для проверки результата игры
function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        messageDisplay.textContent = `Игрок ${currentPlayer} выиграл!`;
        messageDisplay.classList.remove('hide');
        messageDisplay.classList.add('show');
        updateStats(currentPlayer); // Обновляем статистику
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        messageDisplay.textContent = "Ничья!";
        messageDisplay.classList.remove('hide');
        messageDisplay.classList.add('show');
        draws++;
        drawsDisplay.textContent = draws;
        gameActive = false;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    isPlayerTurn = !isPlayerTurn;
}

// Функция для обновления статистики
function updateStats(winner) {
    if (winner === 'X') {
        xWins++;
        xWinsDisplay.textContent = xWins;
    } else {
        oWins++;
        oWinsDisplay.textContent = oWins;
    }
}

// Функция для перезапуска игры
function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    isPlayerTurn = true;
    messageDisplay.textContent = "";
    messageDisplay.classList.remove('show');
    messageDisplay.classList.add('hide');

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o'); // Удаление классов для анимации
    });

    localStorage.removeItem('ticTacToeGame'); // Удаление сохраненной игры
}

// Функция для сброса статистики
function resetStats() {
    xWins = 0;
    oWins = 0;
    draws = 0;
    xWinsDisplay.textContent = xWins;
    oWinsDisplay.textContent = oWins;
    drawsDisplay.textContent = draws;
}

// Функция для хода компьютера
function computerMove() {
    const bestMove = findBestMove();
    gameState[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;
    cells[bestMove].classList.add(currentPlayer.toLowerCase());
    checkResult();
}

// Функция для нахождения лучшего хода компьютера
function findBestMove() {
    const availableMoves = gameState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Случайный ход для простого ИИ
}

// Загрузка состояния игры при запуске
loadGame();

// Добавление обработчиков событий
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
});

restartButton.addEventListener('click', restartGame);
saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);
resetStatsButton.addEventListener('click', resetStats);