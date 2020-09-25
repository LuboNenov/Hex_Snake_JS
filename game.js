var updates = 0, updateInterval = 10;

var strana = 10, visochina = 2*Math.sqrt(strana*strana - (strana/2)*(strana/2)), offsetNastrani = strana/2, gridS = 30;

var endlessCanvas = true;

var snakeX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], snakeY = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], snakeOpashka = 0, snakeGlava = 21, snakePosoka = 0;

var deltaXZaPosoka = [1, 1, 0, -1, -1, 0];
var deltaYZaPosoka = [0, 1, 1, 0, -1, -1];

var isGameOver = false;

var coinX = [];
var coinY = [];
var coinBr = 50;

var portalInX = [],
    portalInY = [],
    portalOutX = [],
    portalOutY = [],
    portalInColor = [],
    portalOutColor = [];

var colors = ["purple", "green", "blue"];
var actualCameraX = 0,
    actualCameraY = 0;

for(let i = 0; i < coinBr; i++) {
    coinX[i] = randomInteger(gridS);
    coinY[i] = randomInteger(gridS);
}

function narisuvaiShestougulnik(x, y) {
    context.beginPath();
    context.moveTo(x - strana/2, y - visochina/2);
    context.lineTo(x + strana/2, y - visochina/2);
    context.lineTo(x + strana/2 + offsetNastrani, y);
    context.lineTo(x + strana/2, y + visochina/2);
    context.lineTo(x - strana/2, y + visochina/2);
    context.lineTo(x - strana/2 - offsetNastrani, y);
    context.closePath();
    context.stroke();
}
function spawnOneWayPortal(inX, inY, inColor, outX, outY, outColor) {
    portalInX.push(inX);
    portalInY.push(inY);
    portalInColor.push(inColor);
    portalOutX.push(outX);
    portalOutY.push(outY);
    portalOutColor.push(outColor);
}
function spawnTwoWayPortal(inX, inY, outX, outY, color) {
    spawnOneWayPortal(inX, inY, color, outX, outY, color);
    spawnOneWayPortal(outX, outY, color, inX, inY, color);
}
function spawnRandomOneWayPortals(n) {
    for(let i = 0; i < n; i++) {
        spawnOneWayPortal(
            randomInteger(gridS), 
            randomInteger(gridS),
            colors[randomInteger(colors.length)],
            randomInteger(gridS),
            randomInteger(gridS),
            colors[randomInteger(colors.length)]);
    }
}
spawnRandomOneWayPortals(5);
for(let i = 0; i < gridS; i++) {
    spawnTwoWayPortal(i, 0, i, gridS-1, "black");
}
function update() {
    updates++;
    if(updates > updateInterval && isKeyPressed[87] && !isGameOver) {
        updates = 0;
        let teleported = false;
        for(let i = 0; i < portalInX.length; i++) {
            if(snakeX[snakeGlava - 1] == portalInX[i] &&
              snakeY[snakeGlava - 1] == portalInY[i]) {
                teleported = true;
                let newSnakeX = portalOutX[i] + deltaXZaPosoka[snakePosoka];
                let newSnakeY = portalOutY[i] + deltaYZaPosoka[snakePosoka];
                snakeX[snakeGlava] = newSnakeX;
                snakeY[snakeGlava] = newSnakeY;
                snakeGlava++;
            }
        }
        if(!teleported) {
            let newSnakeX = snakeX[snakeGlava - 1] + deltaXZaPosoka[snakePosoka];
            let newSnakeY = snakeY[snakeGlava - 1] + deltaYZaPosoka[snakePosoka];
            snakeX[snakeGlava] = newSnakeX;
            snakeY[snakeGlava] = newSnakeY;
            snakeGlava++;
        }
        snakeOpashka++;
    }
    for(let i = snakeOpashka; i < snakeGlava; i++) {
        for(let j = snakeOpashka; j < snakeGlava; j++) {
            if(snakeX[i]==snakeX[j] && snakeY[i] == snakeY[j] && i != j ) {
                snakeOpashka = Math.min(i, j)
            }
            if(snakeX[i] >= gridS || snakeX[i] < 0 || snakeY[i] >= gridS ||
              snakeY[i] < 0) {
                isGameOver = true;
            }
        }
    }
    for(let i = 0; i < coinBr; i++) {
        if(snakeX[snakeGlava - 1] == coinX[i] && snakeY[snakeGlava - 1] == coinY[i]) {
            snakeOpashka--;
            coinX[i] = coinX[coinBr - 1];
            coinY[i] = coinY[coinBr - 1];
            coinBr--;
        }
    }
}
function daiMiEkranenXZaGridXY(x,y) {
    return x*(strana/2 + offsetNastrani + strana/2) + y*0;
}
function daiMiEkranenYZaGridXY(x,y) {
    return x*(-visochina/2) + y*(visochina);
}
function draw() {
    context.lineWidth = 1;
    context.fillStyle = "#1c1c1c";
    context.fillRect(0,0, 10000, 10000);
    let cameraX = -daiMiEkranenXZaGridXY(snakeX[snakeGlava - 1], snakeY[snakeGlava - 1]) + window.innerWidth/2;
    let cameraY = -daiMiEkranenYZaGridXY(snakeX[snakeGlava - 1], snakeY[snakeGlava - 1]) + window.innerHeight/2;
    actualCameraX += (cameraX - actualCameraX)/10;
    actualCameraY += (cameraY - actualCameraY)/10;
    
    context.strokeStyle = "#abb7b7";
    for(var x = 0; x < gridS; x++) {
        for(var y = 0; y < gridS; y++) {
            narisuvaiShestougulnik(daiMiEkranenXZaGridXY(x,y) + actualCameraX, daiMiEkranenYZaGridXY(x,y) + actualCameraY);
        }
    }
    context.fillStyle = "#2574a9";
    context.strokeStyle = "#e4f1fe";
    context.lineWidth = "15px";
    for(var i = snakeOpashka; i < snakeGlava; i++) {
        if(i < snakeOpashka + Math.floor((snakeGlava-snakeOpashka)/3)) {
            context.globalAlpha = 1 - (snakeOpashka + Math.floor((snakeGlava-snakeOpashka)/3) - i)/Math.floor((snakeGlava-snakeOpashka)/3) + 0.3;
        }
        
        narisuvaiShestougulnik(daiMiEkranenXZaGridXY(snakeX[i],snakeY[i]) + actualCameraX, daiMiEkranenYZaGridXY(snakeX[i],snakeY[i]) + actualCameraY);
        context.fill();
        context.globalAlpha = 1;
    }
    let snakeGlavaX = daiMiEkranenXZaGridXY(snakeX[snakeGlava - 1], snakeY[snakeGlava - 1]) + actualCameraX;
    let snakeGlavaY = daiMiEkranenYZaGridXY(snakeX[snakeGlava - 1], snakeY[snakeGlava - 1]) + actualCameraY;
    let nextPositionX = daiMiEkranenXZaGridXY(snakeX[snakeGlava - 1] + deltaXZaPosoka[snakePosoka], snakeY[snakeGlava - 1] + deltaYZaPosoka[snakePosoka]) + actualCameraX;
    let nextPositionY = daiMiEkranenYZaGridXY(snakeX[snakeGlava - 1] + deltaXZaPosoka[snakePosoka], snakeY[snakeGlava - 1] + deltaYZaPosoka[snakePosoka]) + actualCameraY;
    
    context.lineWidth = 4;
    context.strokeStyle = "white";
    context.beginPath();
    context.moveTo(snakeGlavaX, snakeGlavaY);
    context.lineTo(nextPositionX, nextPositionY);
    context.stroke();
    
    context.lineWidth = 1;
    for(var i = snakeOpashka; i < snakeGlava; i++) {
        if(i < snakeOpashka + Math.floor((snakeGlava-snakeOpashka)/3)) {
            context.globalAlpha = 1 - (snakeOpashka + Math.floor((snakeGlava-snakeOpashka)/3) - i)/Math.floor((snakeGlava-snakeOpashka)/3) + 0.3;
        }
        
        narisuvaiShestougulnik(daiMiEkranenXZaGridXY(snakeX[i],snakeY[i]) + actualCameraX, daiMiEkranenYZaGridXY(snakeX[i],snakeY[i]) + actualCameraY);
        context.stroke();
        context.globalAlpha = 1;
    }
    context.lineWidth = "1px";
    
    context.fillStyle = "#d91e18";
    for(let i = 0; i < coinBr; i++) {
        narisuvaiShestougulnik(daiMiEkranenXZaGridXY(coinX[i], coinY[i]) + actualCameraX,
                 daiMiEkranenYZaGridXY(coinX[i], coinY[i]) + actualCameraY);
        
        context.fill();
    }
    context.lineWidth = 4;
    for(let i = 0; i < portalInX.length; i++) {
        context.globalAlpha = 1;
        context.fillStyle = portalInColor[i];
        narisuvaiShestougulnik(daiMiEkranenXZaGridXY(portalInX[i], portalInY[i]) + actualCameraX,
                 daiMiEkranenYZaGridXY(portalInX[i], portalInY[i]) + actualCameraY);
        context.fill();
        context.stroke();
        
        context.globalAlpha = 0.3;
        context.fillStyle = portalOutColor[i];
        narisuvaiShestougulnik(
                daiMiEkranenXZaGridXY(portalOutX[i], portalOutY[i]) + actualCameraX,
                daiMiEkranenYZaGridXY(portalOutX[i], portalOutY[i]) + actualCameraY);
        context.fill();
        context.stroke();
        
        distToPortal = dist(
            daiMiEkranenXZaGridXY(portalInX[i], portalInY[i]) + actualCameraX,
            daiMiEkranenYZaGridXY(portalInX[i], portalInY[i]) + actualCameraY,
            daiMiEkranenXZaGridXY(snakeX[snakeGlava - 1],snakeY[snakeGlava - 1]) + actualCameraX,
            daiMiEkranenYZaGridXY(snakeX[snakeGlava - 1],snakeY[snakeGlava - 1]) + actualCameraY
        )
        if(distToPortal < 100) {
            context.lineWidth = 3;
            context.globalAlpha =  1 - (distToPortal/100);
            context.beginPath();
            context.moveTo(daiMiEkranenXZaGridXY(portalInX[i], portalInY[i]) + actualCameraX,
            daiMiEkranenYZaGridXY(portalInX[i], portalInY[i]) + actualCameraY);
            context.lineTo(daiMiEkranenXZaGridXY(portalOutX[i], portalOutY[i]) + actualCameraX,
            daiMiEkranenYZaGridXY(portalOutX[i], portalOutY[i]) + actualCameraY);
            context.stroke();
        }
    }
};

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)*(x1-x2) + (y1 - y2)*(y1 - y2));
}
function keyup(key) {
    console.log(key);
    if(key == 68) {
        snakePosoka++;
    }
    if(key == 65) {
        snakePosoka--;
    }
    if(snakePosoka == -1) {
        snakePosoka = 5;
    }
    if(snakePosoka == 6) {
        snakePosoka = 0;
    }
};

function mouseup() {
};
