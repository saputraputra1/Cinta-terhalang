import { database } from './firebase.js';
import { ref, set, onValue, update } from 'firebase/database';

export class CintaTerhalangGame {
  constructor() {
    this.gameRef = ref(database, 'games/latest');
    this.player1 = null;
    this.player2 = null;
    this.gameState = {
      board: Array(9).fill(null),
      currentPlayer: 1,
      scores: { player1: 0, player2: 0 },
      messages: [],
      obstacles: this.generateObstacles(),
      gameOver: false
    };
  }

  generateObstacles() {
    // Generate 3 random obstacles
    const obstacles = [];
    while (obstacles.length < 3) {
      const pos = Math.floor(Math.random() * 9);
      if (!obstacles.includes(pos)) obstacles.push(pos);
    }
    return obstacles;
  }

  async initializeGame() {
    await set(this.gameRef, this.gameState);
    this.setupListeners();
  }

  setupListeners() {
    onValue(this.gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.gameState = data;
        this.updateUI();
      }
    });
  }

  async makeMove(position, player) {
    if (this.gameState.gameOver || 
        this.gameState.currentPlayer !== player ||
        this.gameState.board[position] !== null ||
        this.gameState.obstacles.includes(position)) {
      return false;
    }

    const newBoard = [...this.gameState.board];
    newBoard[position] = player === 1 ? 'X' : 'O';
    
    const winner = this.checkWinner(newBoard);
    let gameOver = false;
    const scores = {...this.gameState.scores};
    
    if (winner) {
      scores[`player${winner}`] += 1;
      gameOver = true;
    } else if (newBoard.every(cell => cell !== null)) {
      gameOver = true; // Draw
    }

    await update(this.gameRef, {
      board: newBoard,
      currentPlayer: player === 1 ? 2 : 1,
      scores,
      gameOver
    });

    return true;
  }

  checkWinner(board) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === 'X' ? 1 : 2;
      }
    }
    return null;
  }

  async sendMessage(player, message) {
    const newMessages = [...this.gameState.messages, {
      player,
      text: message,
      timestamp: Date.now()
    }];
    await update(this.gameRef, { messages: newMessages });
  }

  async resetGame() {
    await update(this.gameRef, {
      board: Array(9).fill(null),
      currentPlayer: 1,
      obstacles: this.generateObstacles(),
      gameOver: false
    });
  }

  updateUI() {
    // Implement UI updates based on game state
    console.log('Game state updated:', this.gameState);
  }
}
