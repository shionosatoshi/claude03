(function () {
    'use strict';

    const platform = document.body.dataset.platform || 'desktop';
    const isMobile = platform === 'mobile';
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestScoreEl = document.getElementById('bestScore');
    const livesEl = document.getElementById('lives');
    const levelEl = document.getElementById('level');
    const overlay = document.getElementById('overlay');
    const statusText = document.getElementById('statusText');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const launchBtn = document.getElementById('launchBtn');
    const restartBtn = document.getElementById('restartBtn');

    const world = { width: 960, height: 1280 };
    const storageKey = `brick-sprint-best-${platform}`;
    const colors = ['#e05535', '#f2bc57', '#72c8b7', '#467cc2', '#b67fc6'];

    const state = {
        running: false,
        paused: false,
        waitingLaunch: true,
        gameOver: false,
        won: false,
        score: 0,
        best: Number(localStorage.getItem(storageKey) || 0),
        lives: 3,
        level: 1,
        keys: new Set(),
        pointerActive: false,
        lastTime: 0,
        paddle: { x: 360, y: 1165, width: isMobile ? 245 : 210, height: 28, speed: isMobile ? 880 : 980 },
        ball: { x: 480, y: 1125, radius: 15, dx: 0, dy: 0, speed: isMobile ? 680 : 735 },
        bricks: []
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function resetBall() {
        state.waitingLaunch = true;
        state.ball.x = state.paddle.x + state.paddle.width / 2;
        state.ball.y = state.paddle.y - state.ball.radius - 5;
        state.ball.dx = 0;
        state.ball.dy = 0;
    }

    function createBricks() {
        const columns = isMobile ? 7 : 8;
        const rows = Math.min(5 + state.level, 9);
        const gap = 14;
        const side = 52;
        const top = 132;
        const brickWidth = (world.width - side * 2 - gap * (columns - 1)) / columns;
        const brickHeight = 46;
        state.bricks = [];

        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < columns; col += 1) {
                state.bricks.push({
                    x: side + col * (brickWidth + gap),
                    y: top + row * (brickHeight + gap),
                    width: brickWidth,
                    height: brickHeight,
                    hits: row < 2 && state.level > 2 ? 2 : 1,
                    color: colors[row % colors.length]
                });
            }
        }
    }

    function startGame(fresh) {
        if (fresh) {
            state.score = 0;
            state.lives = 3;
            state.level = 1;
            state.gameOver = false;
            state.won = false;
            state.paddle.x = (world.width - state.paddle.width) / 2;
            createBricks();
            resetBall();
        }

        state.running = true;
        state.paused = false;
        overlay.classList.remove('is-visible');
        pauseBtn.textContent = 'Pause';
        updateHud();
    }

    function launchBall() {
        if (!state.running || state.paused || !state.waitingLaunch) return;
        const direction = Math.random() > 0.5 ? 1 : -1;
        state.ball.dx = state.ball.speed * 0.34 * direction;
        state.ball.dy = -state.ball.speed;
        state.waitingLaunch = false;
    }

    function togglePause() {
        if (!state.running || state.gameOver || state.won) return;
        state.paused = !state.paused;
        pauseBtn.textContent = state.paused ? 'Resume' : 'Pause';
        if (state.paused) {
            showOverlay('Paused', isMobile ? '再開して続きをプレイ' : 'Space で再開');
        } else {
            overlay.classList.remove('is-visible');
        }
    }

    function showOverlay(title, message) {
        overlay.querySelector('h1').textContent = title;
        statusText.textContent = message;
        startBtn.textContent = state.gameOver || state.won ? 'Play Again' : 'Start';
        overlay.classList.add('is-visible');
    }

    function updateHud() {
        scoreEl.textContent = state.score.toLocaleString();
        bestScoreEl.textContent = state.best.toLocaleString();
        livesEl.textContent = state.lives;
        levelEl.textContent = state.level;
    }

    function saveBest() {
        if (state.score > state.best) {
            state.best = state.score;
            localStorage.setItem(storageKey, String(state.best));
        }
    }

    function nextLevel() {
        state.level += 1;
        state.score += 500;
        state.ball.speed += 38;
        createBricks();
        resetBall();
        updateHud();
        showOverlay(`Level ${state.level}`, isMobile ? 'Launch をタップして続行' : 'Space で続行');
    }

    function endGame(won) {
        state.running = false;
        state.gameOver = !won;
        state.won = won;
        saveBest();
        updateHud();
        showOverlay(won ? 'Cleared' : 'Game Over', won ? 'すべてのブロックを破壊' : 'もう一度挑戦');
    }

    function movePaddleTo(clientX) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = world.width / rect.width;
        const x = (clientX - rect.left) * scaleX - state.paddle.width / 2;
        state.paddle.x = clamp(x, 18, world.width - state.paddle.width - 18);
        if (state.waitingLaunch) resetBall();
    }

    function update(dt) {
        if (!state.running || state.paused) return;

        let direction = 0;
        if (state.keys.has('ArrowLeft') || state.keys.has('KeyA')) direction -= 1;
        if (state.keys.has('ArrowRight') || state.keys.has('KeyD')) direction += 1;
        if (direction !== 0) {
            state.paddle.x += direction * state.paddle.speed * dt;
            state.paddle.x = clamp(state.paddle.x, 18, world.width - state.paddle.width - 18);
            if (state.waitingLaunch) resetBall();
        }

        if (state.waitingLaunch) return;

        const ball = state.ball;
        ball.x += ball.dx * dt;
        ball.y += ball.dy * dt;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > world.width) {
            ball.dx *= -1;
            ball.x = clamp(ball.x, ball.radius, world.width - ball.radius);
        }
        if (ball.y - ball.radius < 0) {
            ball.dy *= -1;
            ball.y = ball.radius;
        }

        const p = state.paddle;
        if (
            ball.y + ball.radius >= p.y &&
            ball.y - ball.radius <= p.y + p.height &&
            ball.x >= p.x &&
            ball.x <= p.x + p.width &&
            ball.dy > 0
        ) {
            const hit = (ball.x - (p.x + p.width / 2)) / (p.width / 2);
            ball.dx = hit * ball.speed * 0.72;
            ball.dy = -Math.sqrt(Math.max(ball.speed * ball.speed - ball.dx * ball.dx, ball.speed * 0.38));
            ball.y = p.y - ball.radius - 1;
        }

        for (const brick of state.bricks) {
            if (brick.destroyed) continue;
            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {
                brick.hits -= 1;
                if (brick.hits <= 0) {
                    brick.destroyed = true;
                    state.score += 80 + state.level * 10;
                } else {
                    state.score += 25;
                }

                const overlapLeft = ball.x + ball.radius - brick.x;
                const overlapRight = brick.x + brick.width - (ball.x - ball.radius);
                const overlapTop = ball.y + ball.radius - brick.y;
                const overlapBottom = brick.y + brick.height - (ball.y - ball.radius);
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
                if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                    ball.dx *= -1;
                } else {
                    ball.dy *= -1;
                }
                updateHud();
                break;
            }
        }

        if (state.bricks.every((brick) => brick.destroyed)) {
            if (state.level >= 5) {
                endGame(true);
            } else {
                nextLevel();
            }
        }

        if (ball.y - ball.radius > world.height) {
            state.lives -= 1;
            updateHud();
            if (state.lives <= 0) {
                endGame(false);
            } else {
                resetBall();
            }
        }
    }

    function drawRoundRect(x, y, width, height, radius, fill) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.fillStyle = fill;
        ctx.fill();
    }

    function render() {
        ctx.clearRect(0, 0, world.width, world.height);

        const gradient = ctx.createLinearGradient(0, 0, 0, world.height);
        gradient.addColorStop(0, '#112f3a');
        gradient.addColorStop(0.58, '#0e1e2a');
        gradient.addColorStop(1, '#071118');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, world.width, world.height);

        ctx.strokeStyle = 'rgba(245, 247, 242, 0.08)';
        ctx.lineWidth = 2;
        for (let y = 90; y < world.height; y += 82) {
            ctx.beginPath();
            ctx.moveTo(36, y);
            ctx.lineTo(world.width - 36, y);
            ctx.stroke();
        }

        for (const brick of state.bricks) {
            if (brick.destroyed) continue;
            drawRoundRect(brick.x, brick.y, brick.width, brick.height, 8, brick.color);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(brick.x + 8, brick.y + 7, brick.width - 16, 5);
            if (brick.hits > 1) {
                ctx.fillStyle = 'rgba(8, 19, 27, 0.42)';
                ctx.fillRect(brick.x + 12, brick.y + brick.height - 12, brick.width - 24, 4);
            }
        }

        const p = state.paddle;
        drawRoundRect(p.x, p.y, p.width, p.height, 14, '#f5f7f2');
        drawRoundRect(p.x + p.width * 0.28, p.y + 5, p.width * 0.44, 7, 4, '#72c8b7');

        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f2bc57';
        ctx.shadowColor = 'rgba(242, 188, 87, 0.55)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (state.waitingLaunch && state.running && !state.paused) {
            ctx.fillStyle = 'rgba(245, 247, 242, 0.72)';
            ctx.font = '700 28px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isMobile ? 'Launch をタップ' : 'Space で発射', world.width / 2, 1040);
        }
    }

    function frame(time) {
        const dt = Math.min((time - state.lastTime) / 1000 || 0, 0.033);
        state.lastTime = time;
        update(dt);
        render();
        requestAnimationFrame(frame);
    }

    startBtn.addEventListener('click', () => {
        if (state.gameOver || state.won || !state.running) {
            startGame(true);
        } else if (state.paused) {
            togglePause();
        }
    });
    pauseBtn.addEventListener('click', togglePause);
    launchBtn.addEventListener('click', launchBall);
    restartBtn.addEventListener('click', () => startGame(true));

    window.addEventListener('keydown', (event) => {
        if (['ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
        if (event.code === 'Space') {
            if (!state.running || state.gameOver || state.won) startGame(true);
            else if (state.waitingLaunch) launchBall();
            else togglePause();
            return;
        }
        if (event.code === 'KeyR') startGame(true);
        state.keys.add(event.code);
    });
    window.addEventListener('keyup', (event) => state.keys.delete(event.code));

    canvas.addEventListener('pointerdown', (event) => {
        state.pointerActive = true;
        canvas.setPointerCapture(event.pointerId);
        movePaddleTo(event.clientX);
        if (isMobile && state.running && state.waitingLaunch) launchBall();
    });
    canvas.addEventListener('pointermove', (event) => {
        if (state.pointerActive || !isMobile) movePaddleTo(event.clientX);
    });
    canvas.addEventListener('pointerup', (event) => {
        state.pointerActive = false;
        if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointercancel', () => {
        state.pointerActive = false;
    });

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js').catch(() => {});
        });
    }

    createBricks();
    resetBall();
    updateHud();
    render();
    requestAnimationFrame(frame);
}());
