import { login, logout, getCurrentUser } from './auth.js';
import { CintaTerhalangGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const gameScreen = document.getElementById('game-screen');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('login-error');
  
  let game;
  let currentPlayer = null;

  // Check if user is already logged in
  const user = getCurrentUser();
  if (user) {
    initializeGame(user.email);
  }

  loginBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
      loginError.textContent = 'Username dan password harus diisi';
      return;
    }

    const email = `${username}@game.com`;
    const result = await login(email, password);
    
    if (result.success) {
      initializeGame(email);
    } else {
      loginError.textContent = 'Login gagal. Cek username dan password';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await logout();
    gameScreen.classList.remove('active');
    loginScreen.classList.add('active');
    game = null;
  });

  function initializeGame(email) {
    loginScreen.classList.remove('active');
    gameScreen.classList.add('active');
    loginError.textContent = '';
    
    // Determine player number based on username
    currentPlayer = email.startsWith('user1') ? 1 : 2;
    
    // Initialize game
    game = new CintaTerhalangGame();
    game.initializeGame();
    
    // Setup UI
    setupGameUI();
  }

  function setupGameUI() {
    const gameBoard = document.getElementById('game-board');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Create game board cells
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (game.gameState.obstacles.includes(i)) {
        cell.classList.add('obstacle');
        cell.textContent = '🚧';
      }
      cell.addEventListener('click', () => handleCellClick(i));
      gameBoard.appendChild(cell);
    }
    
    // Update player info
    document.getElementById('player1-info').querySelector('span').textContent = 
      currentPlayer === 1 ? 'Kamu (Player 1)' : 'Player 1';
    document.getElementById('player2-info').querySelector('span').textContent = 
      currentPlayer === 2 ? 'Kamu (Player 2)' : 'Player 2';
    
    // Update scores
    updateScores();
    
    // Setup chat
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    // Setup reset button
    resetBtn.addEventListener('click', () => game.resetGame());
    
    // Listen for game state changes
    game.updateUI = () => {
      // Update board
      const cells = document.querySelectorAll('.cell');
      game.gameState.board.forEach((value, index) => {
        if (!game.gameState.obstacles.includes(index)) {
          cells[index].textContent = value || '';
        }
      });
      
      // Update current player
      const statusElement = document.getElementById('game-status');
      if (game.gameState.gameOver) {
        const winner = game.checkWinner(game.gameState.board);
        if (winner) {
          statusElement.textContent = `Player ${winner} menang!`;
        } else {
          statusElement.textContent = 'Seri!';
        }
      } else {
        statusElement.textContent = `Giliran Player ${game.gameState.currentPlayer}`;
      }
      
      // Update scores
      updateScores();
      
      // Update chat
      updateChat();
    };
  }
  
  function updateScores() {
    document.getElementById('player1-info').querySelector('.score').textContent = 
      game.gameState.scores.player1;
    document.getElementById('player2-info').querySelector('.score').textContent = 
      game.gameState.scores.player2;
  }
  
  function updateChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    game.gameState.messages.forEach(msg => {
      const messageElement = document.createElement('div');
      messageElement.className = `message player${msg.player}`;
      messageElement.textContent = msg.text;
      chatMessages.appendChild(messageElement);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  async function handleCellClick(position) {
    if (currentPlayer !== game.gameState.currentPlayer) return;
    
    await game.makeMove(position, currentPlayer);
  }
  
  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
      await game.sendMessage(currentPlayer, message);
      input.value = '';
    }
  }
});
