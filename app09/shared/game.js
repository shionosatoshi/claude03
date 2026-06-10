(function () {
    'use strict';

    const boardEl = document.getElementById('board');
    const blackScoreEl = document.getElementById('blackScore');
    const whiteScoreEl = document.getElementById('whiteScore');
    const turnLabelEl = document.getElementById('turnLabel');
    const statusLabelEl = document.getElementById('statusLabel');
    const cpuModeBtn = document.getElementById('cpuModeBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    const mediumDifficultyBtn = document.getElementById('mediumDifficultyBtn');
    const strongDifficultyBtn = document.getElementById('strongDifficultyBtn');
    const hintBtn = document.getElementById('hintBtn');
    const rulesBtn = document.getElementById('rulesBtn');
    const resetBtn = document.getElementById('resetBtn');
    const rulesDialog = document.getElementById('rulesDialog');
    const closeRulesBtn = document.getElementById('closeRulesBtn');

    const size = 8;
    const empty = 0;
    const black = 1;
    const white = -1;
    const voidCell = null;
    const cpuColor = white;
    const humanColor = black;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    const mask = [
        '00111100',
        '01111110',
        '11111111',
        '11111111',
        '11111111',
        '11111111',
        '01111110',
        '00111100'
    ];
    const anchorCells = new Set([
        '0,2', '0,5', '1,1', '1,6',
        '2,0', '2,7', '5,0', '5,7',
        '6,1', '6,6', '7,2', '7,5'
    ]);

    const state = {
        board: [],
        current: black,
        mode: 'cpu',
        difficulty: 'medium',
        showHints: true,
        gameOver: false,
        thinking: false,
        lastMove: null,
        passMessage: '',
        cpuTimer: 0,
        audioContext: null
    };

    function isInside(row, col) {
        return row >= 0 && row < size && col >= 0 && col < size;
    }

    function isPlayable(row, col, board = state.board) {
        return isInside(row, col) && board[row][col] !== voidCell;
    }

    function colorName(color) {
        return color === black ? 'Black' : 'White';
    }

    function colorNameJa(color) {
        return color === black ? '黒' : '白';
    }

    function opponent(color) {
        return -color;
    }

    function getAudioContext() {
        if (!state.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return null;
            state.audioContext = new AudioContext();
        }
        return state.audioContext;
    }

    function primeAudio() {
        const audio = getAudioContext();
        if (audio && audio.state === 'suspended') {
            audio.resume().catch(() => {});
        }
    }

    function playTone({ start, frequency, endFrequency, duration, gain, type }) {
        const audio = getAudioContext();
        if (!audio || audio.state === 'suspended') return;

        const oscillator = audio.createOscillator();
        const volume = audio.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
        volume.gain.setValueAtTime(0.0001, start);
        volume.gain.exponentialRampToValueAtTime(gain, start + 0.012);
        volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(volume);
        volume.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    }

    function playMoveSounds(flipCount, color) {
        const audio = getAudioContext();
        if (!audio || audio.state === 'suspended') return;

        const now = audio.currentTime;
        const base = color === black ? 260 : 340;
        playTone({
            start: now,
            frequency: base,
            endFrequency: base * 1.55,
            duration: 0.11,
            gain: 0.09,
            type: 'triangle'
        });

        const ticks = Math.min(flipCount, 9);
        for (let index = 0; index < ticks; index += 1) {
            const start = now + 0.09 + index * 0.045;
            playTone({
                start,
                frequency: 560 + index * 18,
                endFrequency: 420 + index * 14,
                duration: 0.055,
                gain: 0.055,
                type: 'square'
            });
        }
    }

    function createBoard() {
        const next = [];
        for (let row = 0; row < size; row += 1) {
            next[row] = [];
            for (let col = 0; col < size; col += 1) {
                next[row][col] = mask[row][col] === '1' ? empty : voidCell;
            }
        }

        next[3][3] = white;
        next[3][4] = black;
        next[4][3] = black;
        next[4][4] = white;
        return next;
    }

    function cloneBoard(board) {
        return board.map((row) => row.slice());
    }

    function getFlips(board, row, col, color) {
        if (!isPlayable(row, col, board) || board[row][col] !== empty) return [];

        const flips = [];
        for (const [dr, dc] of directions) {
            const line = [];
            let r = row + dr;
            let c = col + dc;

            while (isPlayable(r, c, board) && board[r][c] === opponent(color)) {
                line.push([r, c]);
                r += dr;
                c += dc;
            }

            if (line.length > 0 && isPlayable(r, c, board) && board[r][c] === color) {
                flips.push(...line);
            }
        }

        return flips;
    }

    function getLegalMoves(board, color) {
        const moves = [];
        for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
                const flips = getFlips(board, row, col, color);
                if (flips.length > 0) moves.push({ row, col, flips });
            }
        }
        return moves;
    }

    function countDiscs(board) {
        let blackCount = 0;
        let whiteCount = 0;
        let emptyCount = 0;

        for (const row of board) {
            for (const cell of row) {
                if (cell === black) blackCount += 1;
                if (cell === white) whiteCount += 1;
                if (cell === empty) emptyCount += 1;
            }
        }

        return { blackCount, whiteCount, emptyCount };
    }

    function applyMove(board, move, color) {
        const next = cloneBoard(board);
        next[move.row][move.col] = color;
        for (const [row, col] of move.flips) {
            next[row][col] = color;
        }
        return next;
    }

    function positionalScore(row, col) {
        if (anchorCells.has(`${row},${col}`)) return 18;
        const centerDistance = Math.abs(row - 3.5) + Math.abs(col - 3.5);
        return centerDistance > 3.5 ? 3 : 0;
    }

    function countForColor(board, color) {
        let count = 0;
        for (const row of board) {
            for (const cell of row) {
                if (cell === color) count += 1;
            }
        }
        return count;
    }

    function evaluateBoard(board, color) {
        const them = opponent(color);
        const discScore = countForColor(board, color) - countForColor(board, them);
        const mobilityScore = getLegalMoves(board, color).length - getLegalMoves(board, them).length;
        let anchorScore = 0;

        for (const key of anchorCells) {
            const [row, col] = key.split(',').map(Number);
            if (board[row][col] === color) anchorScore += 1;
            if (board[row][col] === them) anchorScore -= 1;
        }

        return discScore + mobilityScore * 5 + anchorScore * 10;
    }

    function evaluateMoveOnBoard(board, move, color) {
        const simulated = applyMove(board, move, color);
        const ownMoves = getLegalMoves(simulated, color).length;
        const rivalMoves = getLegalMoves(simulated, opponent(color)).length;
        const anchorBonus = anchorCells.has(`${move.row},${move.col}`) ? 16 : 0;
        const tempoBonus = move.flips.length * 7;
        const mobilityBonus = (ownMoves - rivalMoves) * 3;
        const shapeBonus = positionalScore(move.row, move.col);

        return tempoBonus + anchorBonus + mobilityBonus + shapeBonus + Math.random() * 1.2;
    }

    function chooseCpuMove(moves) {
        const ranked = moves
            .map((move) => ({ move, score: evaluateMoveOnBoard(state.board, move, cpuColor) }))
            .sort((a, b) => b.score - a.score);

        if (state.difficulty === 'medium') {
            const pool = ranked.slice(0, Math.min(2, ranked.length));
            return pool[Math.floor(Math.random() * pool.length)].move;
        }

        return ranked
            .map((entry) => {
                const afterCpu = applyMove(state.board, entry.move, cpuColor);
                const replies = getLegalMoves(afterCpu, humanColor);
                const replyPenalty = replies.length === 0
                    ? -12
                    : Math.max(...replies.map((reply) => evaluateMoveOnBoard(afterCpu, reply, humanColor)));
                return {
                    move: entry.move,
                    score: entry.score + evaluateBoard(afterCpu, cpuColor) * 0.55 - replyPenalty * 0.72
                };
            })
            .sort((a, b) => b.score - a.score)[0].move;
    }

    function updateModeButtons() {
        cpuModeBtn.classList.toggle('is-active', state.mode === 'cpu');
        twoPlayerBtn.classList.toggle('is-active', state.mode === 'two');
        mediumDifficultyBtn.disabled = state.mode !== 'cpu';
        strongDifficultyBtn.disabled = state.mode !== 'cpu';
    }

    function updateDifficultyButtons() {
        mediumDifficultyBtn.classList.toggle('is-active', state.difficulty === 'medium');
        strongDifficultyBtn.classList.toggle('is-active', state.difficulty === 'strong');
    }

    function updateHintButton() {
        hintBtn.textContent = state.showHints ? '候補ON' : '候補OFF';
        hintBtn.setAttribute('aria-pressed', String(state.showHints));
    }

    function render() {
        const legalMoves = state.gameOver || state.thinking ? [] : getLegalMoves(state.board, state.current);
        const legalMap = new Map(legalMoves.map((move) => [`${move.row},${move.col}`, move]));
        const counts = countDiscs(state.board);

        blackScoreEl.textContent = counts.blackCount;
        whiteScoreEl.textContent = counts.whiteCount;
        turnLabelEl.textContent = state.gameOver ? 'Game set' : `${colorName(state.current)} turn`;

        if (state.gameOver) {
            if (counts.blackCount === counts.whiteCount) {
                statusLabelEl.textContent = `引き分け ${counts.blackCount}-${counts.whiteCount}`;
            } else {
                const winner = counts.blackCount > counts.whiteCount ? '黒' : '白';
                statusLabelEl.textContent = `${winner}の勝ち ${counts.blackCount}-${counts.whiteCount}`;
            }
        } else if (state.thinking) {
            statusLabelEl.textContent = 'CPUが考えています';
        } else if (state.passMessage) {
            statusLabelEl.textContent = state.passMessage;
        } else {
            statusLabelEl.textContent = `${legalMoves.length}手から選択`;
        }

        boardEl.innerHTML = '';
        for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
                const cell = state.board[row][col];
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'cell';
                button.dataset.row = String(row);
                button.dataset.col = String(col);
                button.setAttribute('role', 'gridcell');
                button.setAttribute('aria-label', `${row + 1}行 ${col + 1}列`);

                if (cell === voidCell) {
                    button.classList.add('is-void');
                    button.disabled = true;
                } else {
                    const move = legalMap.get(`${row},${col}`);
                    if (move && state.showHints) button.classList.add('is-legal');
                    if (state.lastMove && state.lastMove.row === row && state.lastMove.col === col) {
                        button.classList.add('is-recent');
                    }
                    button.disabled = !move || state.thinking || (state.mode === 'cpu' && state.current === cpuColor);
                    button.addEventListener('click', () => handleCellClick(row, col));

                    if (cell !== empty) {
                        const disc = document.createElement('span');
                        disc.className = `disc ${cell === black ? 'black' : 'white'}`;
                        button.appendChild(disc);
                    }
                }

                boardEl.appendChild(button);
            }
        }

        document.body.classList.toggle('is-thinking', state.thinking);
    }

    function setCurrent(nextColor) {
        state.current = nextColor;
        state.passMessage = '';
    }

    function checkProgress() {
        const counts = countDiscs(state.board);
        const currentMoves = getLegalMoves(state.board, state.current);
        const otherMoves = getLegalMoves(state.board, opponent(state.current));

        if (counts.emptyCount === 0 || (currentMoves.length === 0 && otherMoves.length === 0)) {
            state.gameOver = true;
            state.thinking = false;
            render();
            return;
        }

        if (currentMoves.length === 0) {
            const skipped = state.current;
            setCurrent(opponent(state.current));
            state.passMessage = `${colorNameJa(skipped)}は置けないためパス`;
            render();
            maybeCpuMove();
            return;
        }

        render();
        maybeCpuMove();
    }

    function makeMove(move, color, options = {}) {
        state.board = applyMove(state.board, move, color);
        state.lastMove = { row: move.row, col: move.col };
        if (options.sound) playMoveSounds(move.flips.length, color);
        setCurrent(opponent(color));
        checkProgress();
    }

    function handleCellClick(row, col) {
        primeAudio();
        if (state.gameOver || state.thinking) return;
        if (state.mode === 'cpu' && state.current === cpuColor) return;

        const move = getLegalMoves(state.board, state.current)
            .find((candidate) => candidate.row === row && candidate.col === col);

        if (!move) {
            state.passMessage = 'そこには置けません';
            render();
            return;
        }

        makeMove(move, state.current, { sound: true });
    }

    function maybeCpuMove() {
        if (state.gameOver || state.mode !== 'cpu' || state.current !== cpuColor) return;

        const moves = getLegalMoves(state.board, cpuColor);
        if (moves.length === 0) {
            checkProgress();
            return;
        }

        state.thinking = true;
        render();

        const waitMs = 2000 + Math.floor(Math.random() * 1000);
        window.clearTimeout(state.cpuTimer);
        state.cpuTimer = window.setTimeout(() => {
            const move = chooseCpuMove(moves);
            state.thinking = false;
            makeMove(move, cpuColor, { sound: true });
            state.cpuTimer = 0;
        }, waitMs);
    }

    function resetGame() {
        window.clearTimeout(state.cpuTimer);
        state.cpuTimer = 0;
        state.board = createBoard();
        state.current = black;
        state.gameOver = false;
        state.thinking = false;
        state.lastMove = null;
        state.passMessage = '';
        render();
        maybeCpuMove();
    }

    function setMode(mode) {
        primeAudio();
        state.mode = mode;
        updateModeButtons();
        resetGame();
    }

    cpuModeBtn.addEventListener('click', () => setMode('cpu'));
    twoPlayerBtn.addEventListener('click', () => setMode('two'));
    mediumDifficultyBtn.addEventListener('click', () => {
        primeAudio();
        state.difficulty = 'medium';
        updateDifficultyButtons();
    });
    strongDifficultyBtn.addEventListener('click', () => {
        primeAudio();
        state.difficulty = 'strong';
        updateDifficultyButtons();
    });
    hintBtn.addEventListener('click', () => {
        primeAudio();
        state.showHints = !state.showHints;
        updateHintButton();
        render();
    });
    resetBtn.addEventListener('click', () => {
        primeAudio();
        resetGame();
    });

    rulesBtn.addEventListener('click', () => {
        primeAudio();
        if (typeof rulesDialog.showModal === 'function') {
            rulesDialog.showModal();
        }
    });
    closeRulesBtn.addEventListener('click', () => rulesDialog.close());
    rulesDialog.addEventListener('click', (event) => {
        if (event.target === rulesDialog) rulesDialog.close();
    });

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js').catch(() => {});
        });
    }

    state.board = createBoard();
    updateModeButtons();
    updateDifficultyButtons();
    updateHintButton();
    render();
}());
