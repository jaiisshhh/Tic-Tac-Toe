/**
 * Tic-Tac-Toe Game Logic
 *
 * This script handles all the functionality for the Tic-Tac-Toe game,
 * including player turns, win/draw detection, and UI updates.
 */

"use strict";

// Wait for the entire HTML document to be loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DOM Element References ---
  // Get all the necessary elements from the HTML
  const statusDisplay = document.getElementById("status-display");
  const gameBoard = document.getElementById("game-board");
  // NodeList of all cells
  const cells = document.querySelectorAll("[data-cell-index]");
  const restartButton = document.getElementById("restart-button");
  const playerXScoreDisplay = document.getElementById("player-x-score");
  const playerOScoreDisplay = document.getElementById("player-o-score");

  // --- 2. Game State Variables ---
  let gameActive = true; // Boolean to track if the game is in progress
  let currentPlayer = "X"; // String to track the current player ('X' or 'O')
  let gameState = ["", "", "", "", "", "", "", "", ""]; // Array representing the 3x3 board

  // (Optional) Score tracking
  let playerXScore = 0;
  let playerOScore = 0;

  // --- 3. Constants ---
  // All 8 possible winning combinations (indices of the gameState array)
  const winningConditions = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Column 1
    [1, 4, 7], // Column 2
    [2, 5, 8], // Column 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
  ];

  // Template strings for status messages
  const winMessage = () => `Player ${currentPlayer} has won!`;
  const drawMessage = () => `Game ended in a draw!`;
  const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

  // --- 4. Core Game Functions ---

  /**
   * Initializes or restarts the game.
   * Resets all game state variables and clears the UI.
   */
  function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];

    // Update status display
    statusDisplay.textContent = currentPlayerTurn();

    // Reset the board UI
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winning-cell");
    });

    // (Optional) Set board class for hover effect
    gameBoard.classList.remove("turn-o");
    gameBoard.classList.add("turn-x");
  }

  /**
   * Handles a click on any cell.
   * @param {Event} e - The click event object.
   */
  function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(
      clickedCell.getAttribute("data-cell-index")
    );

    // --- Validation ---
    // 1. Is the cell already played?
    // 2. Is the game still active?
    // If either is true, do nothing.
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
      return;
    }

    // --- Process the Move ---
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
  }

  /**
   * Updates the game state and UI for a played cell.
   * @param {HTMLElement} clickedCell - The DOM element that was clicked.
   * @param {number} clickedCellIndex - The index (0-8) of the clicked cell.
   */
  function handleCellPlayed(clickedCell, clickedCellIndex) {
    // 1. Update the internal game state array
    gameState[clickedCellIndex] = currentPlayer;

    // 2. Update the UI
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Adds '.x' or '.o'
  }

  /**
   * Checks if the game has been won or if it's a draw.
   */
  function handleResultValidation() {
    let roundWon = false;
    let winningLine = []; // To store the 3 winning cell indices

    // Check all 8 winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];

      const posA = gameState[a];
      const posB = gameState[b];
      const posC = gameState[c];

      // If any cell in the condition is empty, it's not a win
      if (posA === "" || posB === "" || posC === "") {
        continue;
      }

      // If all three cells are the same, we have a winner!
      if (posA === posB && posB === posC) {
        roundWon = true;
        winningLine = [a, b, c];
        break; // Stop checking
      }
    }

    // --- Handle Win ---
    if (roundWon) {
      statusDisplay.textContent = winMessage();
      gameActive = false;
      updateScore();
      highlightWinningCells(winningLine);
      gameBoard.classList.remove("turn-x", "turn-o"); // Remove hover class
      return;
    }

    // --- Handle Draw ---
    // If no one has won AND the board is full (no "" in gameState)
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
      statusDisplay.textContent = drawMessage();
      gameActive = false;
      gameBoard.classList.remove("turn-x", "turn-o"); // Remove hover class
      return;
    }

    // --- Continue Game ---
    // If no win and no draw, it's the next player's turn
    handlePlayerChange();
  }

  /**
   * Switches the current player from 'X' to 'O' or vice-versa.
   */
  function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = currentPlayerTurn();

    // (Optional) Update board class for hover effects
    gameBoard.classList.toggle("turn-x");
    gameBoard.classList.toggle("turn-o");
  }

  // --- 5. (Optional) Enhancement Functions ---

  /**
   * Updates the score variable and the score display in the HTML.
   */
  function updateScore() {
    if (currentPlayer === "X") {
      playerXScore++;
      playerXScoreDisplay.textContent = playerXScore;
    } else {
      playerOScore++;
      playerOScoreDisplay.textContent = playerOScore;
    }
  }

  /**
   * Adds a 'winning-cell' class to the 3 cells that won the game.
   * @param {number[]} winningLine - An array of the 3 winning cell indices.
   */
  function highlightWinningCells(winningLine) {
    winningLine.forEach((index) => {
      cells[index].classList.add("winning-cell");
    });
  }

  // --- 6. Event Listeners ---
  // Add click listeners to all cells and the restart button
  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
  restartButton.addEventListener("click", handleRestartGame);

  // --- 7. Initial Game Setup ---
  // Start the game for the first time
  handleRestartGame();
}); // End of DOMContentLoaded
