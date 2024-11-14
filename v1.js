let szam;
szam = 0;
let meret;
let difficulty;
let safeCells;  // Track the number of safe cells (cells that are not mines)

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("akBt").addEventListener("click", function () {
        let sor = document.getElementById("sor").value;
        let oszlop = document.getElementById("oszlop").value;
        let hova = document.getElementById("ak");
        akGeneral(sor, oszlop, hova);
    })
})

var akLogika = [];

function akGeneral(sor, oszlop, hova) {
    szam = 0;
    hova.innerHTML = "";
    akLogika = [];
    safeCells = 0;  // Reset safe cells count

    for (let i = 0; i < sor; i++) {
        let sorElem = document.createElement("div");
        sorElem.classList.add("sor");
        akLogika.push([]);
        for (let j = 0; j < oszlop; j++) {
            let oszlopElem = document.createElement("div");
            oszlopElem.classList.add("oszlop");
            oszlopElem.dataset.x = i;
            oszlopElem.dataset.y = j;
            oszlopElem.addEventListener("click", egyfel);

            sorElem.appendChild(oszlopElem);
            akLogika[i].push(0);
            oszlopElem.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                oszlopElem.style.backgroundColor = "orange";
                oszlopElem.innerHTML = "&#x1F6A9";
            });
        }
        hova.appendChild(sorElem);
    }
    difficulty = document.getElementById("nehezseg").value;
    diff(difficulty);
    logika(akLogika, difficulty);
}

function logika(akL, arany) {
    let x = parseInt(akL.length);
    let y = parseInt(akL[0].length);
    let akna = Math.floor(x * y * arany);
    let db = 0;
    meret = x * y;
    
    // Track total safe cells
    let safeCells = 0;
    
    while (db < akna) {
        let hx = Math.floor(Math.random() * x);
        let hy = Math.floor(Math.random() * y);
        if (akL[hx][hy] != "A") {
            akL[hx][hy] = "A";
            db++;
        }
    }

    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            if (akL[i][j] != "A") {
                akL[i][j] = korulotte(i, j, akL, x, y);
                safeCells++;  // Increment safe cells count
            }
        }
    }

    console.log(akL);  // Log the akLogika array to reveal the game setup
    return safeCells;  // Return the total number of safe cells
}


function korulotte(x, y, akL, mx, my) {
    let db = 0;
    for (let i = (x > 0 ? x - 1 : 0); i < (x == mx - 1 ? x + 1 : x + 2); i++) {
        for (let j = (y > 0 ? y - 1 : 0); j < (y == my - 1 ? y + 1 : y + 2); j++) {
            if (akL[i][j] == "A") {
                db++;
            }
        }
    }
    return db;
}

function diff(difficulty) {
    let a = 1;
    let b = 0.1
    for (let i = 0; i < 4; i++) {
        if (difficulty > b) {
            a = a + 5;
        }
        b = b + 0.1;
    }
    for (let i = 0; i < 3; i++) {
        if (difficulty > b) {
            a = a - 5;
        }
        b = b + 0.1;
    }
    document.getElementById("sor").value = a;
    document.getElementById("oszlop").value = a;
}

function egyfel() {
    let elem = akLogika[this.dataset.x][this.dataset.y];
    let a = this;
    szam++;
    if (elem != "A") {
        a.style.backgroundColor = "green";  // Green for numbers
        a.innerHTML = elem;

        if (szam === safeCells) {  // Compare revealed cells with total safe cells
            felfed();
            alert("YOU WIN!");
        }
        else if (elem == 0) {
            nulla(parseInt(this.dataset.x), parseInt(this.dataset.y));
        }
    }
    else if (elem == "A") {
        a.style.backgroundColor = "red";
        felfed();
        alert("YOU LOSE");
    }
}

function nulla(x, y) {
    if (x < 0 || y < 0 || x >= akLogika.length || y >= akLogika[0].length) {
        return;
    }

    let cella = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (!cella) {
        return;
    }

    // If the cell is already revealed, return
    if (cella.dataset.revealed === "true") {
        return;
    }

    let elem = akLogika[x][y];
    if (elem !== "A") {
        szam++;  // Increment the revealed cells counter
    }

    if (elem === 0) {
        cella.style.backgroundColor = "grey";  // Gray for 0
    } else {
        cella.style.backgroundColor = "green";  // Green for numbers
    }
    cella.innerHTML = elem;
    cella.dataset.revealed = "true";  // Mark the cell as revealed

    // If the element is 0, recursively reveal its neighbors
    if (elem === 0) {
        nulla(x - 1, y - 1);
        nulla(x - 1, y);
        nulla(x - 1, y + 1);
        nulla(x, y - 1);
        nulla(x, y + 1);
        nulla(x + 1, y - 1);
        nulla(x + 1, y);
        nulla(x + 1, y + 1);
    }
}


function felfed() {
    let terulet = document.getElementById("ak");
    let safeCells = logika(akLogika, difficulty);  // Get total number of safe cells

    for (let i = 0; i < terulet.children.length; i++) {
        let row = terulet.children[i];
        if (!row) continue;

        for (let j = 0; j < row.children.length; j++) {
            let cell = row.children[j];
            if (!cell) continue;

            let elem = akLogika[i][j];
            if (elem === "A") {
                cell.innerHTML = "&#x1F4A3;";  // Bomb symbol
                cell.style.backgroundColor = "red";
            } else if (elem !== "A" && cell.style.backgroundColor !== "green" || cell.style.backgroundColor !== "grey") {
                cell.style.backgroundColor = "yellow";  // Revealed safe cells
                cell.innerHTML = elem;
            }

            cell.removeEventListener("click", egyfel);
        }
    }

    // Check if win condition is met
    if (szam === safeCells) {
        alert("YOU WIN!");
    }
}