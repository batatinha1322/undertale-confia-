// =======================
// CONFIGURAÇÕES INICIAIS
// =======================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 32;
const W = canvas.width;
const H = canvas.height;

// =======================
// MAPA DA FLORESTA
// =======================
const map = [
    "####################",
    "#...........#......#",
    "#...........#......#",
    "#....######.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#....#....#.#......#",
    "#...........#......#",
    "#...........#......#",
    "####################"
];

// =======================
// JOGADOR
// =======================
const player = {
    x: 3,
    y: 3,
    hp: 20,
    maxHp: 20,
    gold: 0,
    inv: { "Potion": 1 }
};

// =======================
// NPCs
// =======================
const npcs = [
    {
        id: "guide",
        x: 6,
        y: 3,
        text: [
            "O GUSTAVO LIMA usou sua música para DOMINAR O MUNDO!",
            "Você precisa impedi-lo antes que seja tarde!",
            "Boa sorte, viajante."
        ],
        interacted: false
    },
    {
        id: "shop",
        x: 8,
        y: 10,
        text: ["Bem-vindo à lojinha!"],
        shop: true,
        stock: [
            { name: "Potion", price: 5 }
        ]
    }
];

// =======================
// CONTROLES
// =======================
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// =======================
// CAIXA DE DIÁLOGO
// =======================
let dialog = null;
let dialogPage = 0;

function startDialog(textArray) {
    dialog = textArray;
    dialogPage = 0;
}

function nextDialog() {
    dialogPage++;
    if (dialogPage >= dialog.length) dialog = null;
}

// =======================
// LOJA
// =======================
let shopOpen = false;

function tryOpenShop(npc) {
    shopOpen = true;
}

function drawShop() {
    ctx.fillStyle = "#000";
    ctx.fillRect(50, 50, 540, 380);

    ctx.strokeStyle = "#fff";
    ctx.strokeRect(50, 50, 540, 380);

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Loja", 300, 80);

    let y = 140;
    for (const item of npcs[1].stock) {
        ctx.fillText(`${item.name} - ${item.price}G (pressione Z)`, 80, y);
        y += 40;
    }

    ctx.fillText("Pressione X para sair", 80, 360);
}

// =======================
// COLISÃO
// =======================
function isWalkable(x, y) {
    if (x < 0 || y < 0) return false;
    if (y >= map.length || x >= map[0].length) return false;
    return map[y][x] === ".";
}

// =======================
// NPC PERTO?
// =======================
function getNpcNear() {
    for (const n of npcs) {
        if (Math.abs(player.x - n.x) <= 1 && Math.abs(player.y - n.y) <= 1) {
            return n;
        }
    }
    return null;
}

// =======================
// MOVIMENTO
// =======================
function movePlayer() {
    if (dialog || shopOpen) return;

    let nx = player.x;
    let ny = player.y;

    if (keys["arrowup"] || keys["w"]) ny--;
    if (keys["arrowdown"] || keys["s"]) ny++;
    if (keys["arrowleft"] || keys["a"]) nx--;
    if (keys["arrowright"] || keys["d"]) nx++;

    if (isWalkable(nx, ny)) {
        player.x = nx;
        player.y = ny;
    }
}

// =======================
// DESENHAR MAPA
// =======================
function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {

            if (map[y][x] === "#") {
                ctx.fillStyle = "#143914";
            } else {
                ctx.fillStyle = "#071018";
            }

            ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
        }
    }
}

// =======================
// DESENHAR NPC
// =======================
function drawNpc(n) {
    ctx.fillStyle = (n.id === "shop") ? "#ffd700" : "#ff00ff";
    ctx.fillRect(n.x * TILE, n.y * TILE, TILE, TILE);
}

// =======================
// DESENHAR JOGADOR
// =======================
function drawPlayer() {
    ctx.fillStyle = "white";
    ctx.fillRect(player.x * TILE, player.y * TILE, TILE, TILE);
}

// =======================
// DESENHAR DIÁLOGO
// =======================
function drawDialog() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, H - 120, W, 120);

    ctx.strokeStyle = "#fff";
    ctx.strokeRect(0, H - 120, W, 120);

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(dialog[dialogPage], 20, H - 70);

    ctx.fillText("(Z para continuar)", 20, H - 40);
}

// =======================
// GAME LOOP
// =======================
function loop() {
    ctx.clearRect(0, 0, W, H);

    drawMap();
    for (const n of npcs) drawNpc(n);
    drawPlayer();

    // Abrir/fechar loja
    if (shopOpen) {
        drawShop();
        if (keys["x"]) shopOpen = false;
    }

    // Diálogo
    if (dialog) {
        drawDialog();
        if (keys["z"]) {
            keys["z"] = false;
            nextDialog();
        }
    }

    // Interações
    if (!dialog && !shopOpen && keys["z"]) {
        keys["z"] = false;
        const npc = getNpcNear();
        if (npc) {
            if (npc.shop) {
                shopOpen = true;
            } else {
                startDialog(npc.text);
            }
        }
    }

    movePlayer();
    requestAnimationFrame(loop);
}

loop();
