// --- KNN Demo ---
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const kSlider = document.getElementById('kSlider');
const kValue = document.getElementById('kValue');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Generate two clusters
const clusters = [
    { color: 'red', points: [] },
    { color: 'blue', points: [] }
];

function randomPoint(cx, cy, spread) {
    return {
        x: cx + (Math.random() - 0.5) * spread,
        y: cy + (Math.random() - 0.5) * spread,
    };
}

// Create 20 points for each cluster
for (let i = 0; i < 20; i++) {
    clusters[0].points.push(randomPoint(180, 200, 100));
    clusters[1].points.push(randomPoint(420, 200, 100));
}

let newPoints = [];
let K = parseInt(kSlider.value);

kSlider.oninput = function() {
    K = parseInt(kSlider.value);
    kValue.textContent = K;
    draw();
};

canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const neighbors = getKNearest(x, y, K);
    const color = classify(neighbors);
    newPoints.push({ x, y, neighbors, color });
    draw();
});

function getAllPoints() {
    return clusters[0].points.map(p => ({...p, color: 'red'}))
        .concat(clusters[1].points.map(p => ({...p, color: 'blue'})))
        .concat(newPoints);
}

function getKNearest(x, y, k) {
    const all = clusters[0].points.map(p => ({...p, color: 'red'}))
        .concat(clusters[1].points.map(p => ({...p, color: 'blue'})));
    all.sort((a, b) => dist(x, y, a.x, a.y) - dist(x, y, b.x, b.y));
    return all.slice(0, k);
}

function classify(neighbors) {
    let reds = neighbors.filter(n => n.color === 'red').length;
    let blues = neighbors.filter(n => n.color === 'blue').length;
    return reds >= blues ? 'red' : 'blue';
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw clusters
    for (const cluster of clusters) {
        for (const p of cluster.points) {
            drawPoint(p.x, p.y, cluster.color);
        }
    }
    // Draw new points and their connections
    for (const p of newPoints) {
        drawPoint(p.x, p.y, p.color, true);
        for (const n of p.neighbors) {
            drawLine(p.x, p.y, n.x, n.y, '#888');
        }
    }
}

function drawPoint(x, y, color, highlight=false) {
    ctx.beginPath();
    ctx.arc(x, y, highlight ? 8 : 6, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = highlight ? '#333' : '#fff';
    ctx.lineWidth = highlight ? 3 : 1;
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
}

draw();
