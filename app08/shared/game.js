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
    const brickCount = 42;
    const initialLives = 2;
    const baseSpeed = isMobile ? 680 : 735;
    const basePaddleWidth = isMobile ? 205 : 175;
    const minPaddleWidth = isMobile ? 132 : 112;
    const stageBoostSteps = [
        { destroyed: 14, speed: 1.12, paddle: 0.92 },
        { destroyed: 21, speed: 1.10, paddle: 0.92 },
        { destroyed: 28, speed: 1.09, paddle: 0.93 },
        { destroyed: 35, speed: 1.08, paddle: 0.94 }
    ];

    const state = {
        running: false,
        paused: false,
        waitingLaunch: true,
        gameOver: false,
        won: false,
        score: 0,
        best: Number(localStorage.getItem(storageKey) || 0),
        lives: initialLives,
        level: 1,
        stageBoostIndex: 0,
        keys: new Set(),
        pointerActive: false,
        lastTime: 0,
        paddle: { x: 360, y: 1165, width: basePaddleWidth, height: 28, speed: isMobile ? 880 : 980 },
        ballRadius: 15,
        ballSpeed: baseSpeed,
        balls: [],
        audioContext: null,
        soundBurstIndex: 0,
        soundBurstResetTimer: null,
        bricks: []
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function desiredBallCount() {
        return Math.min(state.level, 3);
    }

    function getAudioContext() {
        if (!state.audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return null;
            state.audioContext = new AudioContext();
        }

        return state.audioContext;
    }

    function scheduleBrickSound(audio, destroyed) {
        const burstIndex = state.soundBurstIndex;
        const soundOffset = Math.min(burstIndex, 5) * 0.035;
        const pitchOffset = (burstIndex % 4) * 42;
        state.soundBurstIndex += 1;

        window.clearTimeout(state.soundBurstResetTimer);
        state.soundBurstResetTimer = window.setTimeout(() => {
            state.soundBurstIndex = 0;
        }, 120);

        const now = audio.currentTime + soundOffset;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = destroyed ? 'triangle' : 'square';
        oscillator.frequency.setValueAtTime((destroyed ? 720 : 520) + pitchOffset, now);
        oscillator.frequency.exponentialRampToValueAtTime((destroyed ? 980 : 760) + pitchOffset, now + 0.045);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(destroyed ? 0.08 : 0.055, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    function playBrickSound(destroyed) {
        const audio = getAudioContext();
        if (!audio) return;

        if (audio.state === 'suspended') {
            audio.resume()
                .then(() => scheduleBrickSound(audio, destroyed))
                .catch(() => {});
            return;
        }

        scheduleBrickSound(audio, destroyed);
    }

    function primeAudio() {
        const audio = getAudioContext();
        if (audio && audio.state === 'suspended') {
            audio.resume().catch(() => {});
        }
    }

    function makeBall(index, count) {
        const spacing = 34;
        const offset = (index - (count - 1) / 2) * spacing;
        return {
            x: state.paddle.x + state.paddle.width / 2 + offset,
            y: state.paddle.y - state.ballRadius - 5,
            radius: state.ballRadius,
            dx: 0,
            dy: 0,
            speed: state.ballSpeed
        };
    }

    function alignWaitingBalls() {
        const count = state.balls.length || desiredBallCount();
        state.balls = Array.from({ length: count }, (_, index) => makeBall(index, count));
    }

    function resetBalls() {
        state.waitingLaunch = true;
        state.balls = [];
        alignWaitingBalls();
    }

    function createBricks() {
        const columns = 8;
        const rows = 7;
        const gap = 14;
        const side = 52;
        const top = 132;
        const brickWidth = (world.width - side * 2 - gap * (columns - 1)) / columns;
        const brickHeight = 46;
        const slots = [];
        state.bricks = [];
        state.stageBoostIndex = 0;

        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < columns; col += 1) {
                slots.push({ row, col });
            }
        }

        for (let index = slots.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
        }

        slots.slice(0, brickCount).forEach((slot, index) => {
            state.bricks.push({
                x: side + slot.col * (brickWidth + gap),
                y: top + slot.row * (brickHeight + gap),
                width: brickWidth,
                height: brickHeight,
                hits: slot.row < 2 && state.level > 2 ? 2 : 1,
                color: colors[(slot.row + state.level + index) % colors.length]
            });
        });
    }

    function updateHud() {
        scoreEl.textContent = state.score.toLocaleString();
        bestScoreEl.textContent = state.best.toLocaleString();
        livesEl.textContent = state.lives;
        levelEl.textContent = state.level;
    }

    function showOverlay(title, message) {
        overlay.querySelector('h1').textContent = title;
        statusText.textContent = message;
        startBtn.textContent = state.gameOver || state.won ? 'Play Again' : 'Start';
        overlay.classList.add('is-visible');
    }

    function saveBest() {
        if (state.score > state.best) {
            state.best = state.score;
            localStorage.setItem(storageKey, String(state.best));
        }
    }

    function startGame(fresh) {
        if (fresh) {
            state.score = 0;
            state.lives = initialLives;
            state.level = 1;
            state.ballSpeed = baseSpeed;
            state.paddle.width = basePaddleWidth;
            state.gameOver = false;
            state.won = false;
            state.paddle.x = (world.width - state.paddle.width) / 2;
            createBricks();
            resetBalls();
        }

        primeAudio();
        state.running = true;
        state.paused = false;
        overlay.classList.remove('is-visible');
        pauseBtn.textContent = 'Pause';
        updateHud();
    }

    function launchBall() {
        if (!state.running || state.paused || !state.waitingLaunch) return;

        state.balls.forEach((ball, index) => {
            const count = Math.max(state.balls.length, 1);
            const spread = count === 1 ? (Math.random() > 0.5 ? 0.34 : -0.34) : -0.46 + (0.92 * index) / (count - 1);
            ball.dx = ball.speed * spread;
            ball.dy = -Math.sqrt(Math.max(ball.speed * ball.speed - ball.dx * ball.dx, ball.speed * 0.45));
        });

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

    function nextLevel() {
        state.level += 1;
        state.score += 500;
        state.ballSpeed += 38;
        state.paddle.width = basePaddleWidth;
        state.paddle.x = clamp(state.paddle.x, 18, world.width - state.paddle.width - 18);
        createBricks();
        resetBalls();
        updateHud();
        showOverlay(`Level ${state.level}`, isMobile ? 'Launch をタップして続行' : 'Space で続行');
    }

    function applyStageBoost() {
        const destroyedCount = state.bricks.filter((brick) => brick.destroyed).length;
        let boosted = false;

        while (
            state.stageBoostIndex < stageBoostSteps.length &&
            destroyedCount >= stageBoostSteps[state.stageBoostIndex].destroyed
        ) {
            const boost = stageBoostSteps[state.stageBoostIndex];
            state.stageBoostIndex += 1;
            state.ballSpeed *= boost.speed;
            state.paddle.width = Math.max(minPaddleWidth, state.paddle.width * boost.paddle);
            state.paddle.x = clamp(state.paddle.x, 18, world.width - state.paddle.width - 18);

            for (const ball of state.balls) {
                const currentSpeed = Math.hypot(ball.dx, ball.dy) || ball.speed;
                const nextSpeed = ball.speed * boost.speed;
                const speedRatio = nextSpeed / currentSpeed;
                ball.dx *= speedRatio;
                ball.dy *= speedRatio;
                ball.speed = nextSpeed;
            }

            boosted = true;
        }

        if (boosted && state.waitingLaunch) alignWaitingBalls();
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
        if (state.waitingLaunch) alignWaitingBalls();
    }

    function updatePaddle(dt) {
        let direction = 0;
        if (state.keys.has('ArrowLeft') || state.keys.has('KeyA')) direction -= 1;
        if (state.keys.has('ArrowRight') || state.keys.has('KeyD')) direction += 1;

        if (direction === 0) return;

        state.paddle.x += direction * state.paddle.speed * dt;
        state.paddle.x = clamp(state.paddle.x, 18, world.width - state.paddle.width - 18);
        if (state.waitingLaunch) alignWaitingBalls();
    }

    function updateBall(ball, dt) {
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
                const destroyed = brick.hits <= 0;

                if (destroyed) {
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

                playBrickSound(destroyed);
                if (destroyed) applyStageBoost();
                updateHud();
                break;
            }
        }
    }

    function update(dt) {
        if (!state.running || state.paused) return;

        updatePaddle(dt);
        if (state.waitingLaunch) return;

        for (const ball of state.balls) {
            updateBall(ball, dt);
        }

        state.balls = state.balls.filter((ball) => ball.y - ball.radius <= world.height);

        if (state.bricks.every((brick) => brick.destroyed)) {
            if (state.level >= 5) {
                endGame(true);
            } else {
                nextLevel();
            }
            return;
        }

        if (state.balls.length === 0) {
            state.lives -= 1;
            updateHud();

            if (state.lives <= 0) {
                endGame(false);
            } else {
                resetBalls();
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

        for (const ball of state.balls) {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#f2bc57';
            ctx.shadowColor = 'rgba(242, 188, 87, 0.55)';
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

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
        primeAudio();
        if (state.gameOver || state.won || !state.running) {
            startGame(true);
        } else if (state.paused) {
            togglePause();
        }
    });
    pauseBtn.addEventListener('click', () => {
        primeAudio();
        togglePause();
    });
    launchBtn.addEventListener('click', () => {
        primeAudio();
        launchBall();
    });
    restartBtn.addEventListener('click', () => {
        primeAudio();
        startGame(true);
    });

    window.addEventListener('keydown', (event) => {
        if (['ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
        primeAudio();

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
        primeAudio();
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
    resetBalls();
    updateHud();
    render();
    requestAnimationFrame(frame);
}());
