// Snow animation
const snowCanvas = document.getElementById('snow-canvas');
if (snowCanvas) {
    function resizeCanvas() {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const ctx = snowCanvas.getContext('2d');
    let snowflakes = [];
    function createSnowflakes() {
        snowflakes = [];
        const count = Math.floor(window.innerWidth / 10);
        for (let i = 0; i < count; i++) {
            snowflakes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                r: Math.random() * 2 + 1,
                d: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }
    createSnowflakes();
    window.addEventListener('resize', createSnowflakes);
    function drawSnowflakes() {
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        for (let flake of snowflakes) {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${flake.opacity})`;
            ctx.fill();
        }
        moveSnowflakes();
    }
    function moveSnowflakes() {
        for (let flake of snowflakes) {
            flake.y += flake.d;
            if (flake.y > window.innerHeight) {
                flake.y = -flake.r;
                flake.x = Math.random() * window.innerWidth;
            }
        }
    }
    setInterval(drawSnowflakes, 30);
}
// Progress bar
const goal = 50000;
const fundsDiv = document.getElementById('funds');
const progressBar = document.getElementById('progressBar');
function parseAmount(amountStr) {
    return parseFloat(amountStr.replace(/[^\d.]/g, '')) || 0;
}
function animateProgressBar(current, goal) {
    if (!progressBar) return;
    const percent = Math.min(current / goal, 1) * 100;
    progressBar.style.width = '0';
    setTimeout(() => {
        progressBar.style.width = percent + '%';
        progressBar.textContent = percent >= 10 ? `${percent.toFixed(1)}%` : '';
    }, 100);
}
function updateFunds() {
    if (!fundsDiv || !progressBar) return;
    fetch('https://one2-days-of-giving.onrender.com/funds')
        .then(response => response.json())
        .then(data => {
            const amountStr = data.amount;
            const current = parseAmount(amountStr);
            fundsDiv.textContent = `Current Funds Raised: £${current.toLocaleString()}`;
            animateProgressBar(current, goal);
        })
        .catch(() => {
            fundsDiv.textContent = 'Unable to fetch funds.';
            progressBar.style.width = '0';
            progressBar.textContent = '';
        });
}
updateFunds();
setInterval(updateFunds, 7200000);
