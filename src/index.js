module.exports = function solveSudoku(matrix) {
  
  function checkPos(x, y) {
    let set = new Set();
    for (let i = 0; i < 9; i++) {
        set.add(matrix[x][i]);
    }
    for (let j = 0; j < 9; j++) {
        set.add(matrix[j][y]);
    }
    for (let k = (Math.floor(x / 3) * 3); k < (Math.floor(x / 3) * 3) + 3; k++) {
        for (let l = (Math.floor(y / 3) * 3); l < (Math.floor(y / 3) * 3) + 3; l++) {
            set.add(matrix[k][l]);
        }
    }
    let arr = [];
    for (let m = 1; m <= 9; m++) {
        if (!set.has(m)) {
            arr.push(m);
        }
    }
    return arr;
}

function checkNeighboursSquare(x, y) {

    let neighbours = new Map();

    for (let k = (Math.floor(x / 3) * 3); k < (Math.floor(x / 3) * 3) + 3; k++) {
        for (let l = (Math.floor(y / 3) * 3); l < (Math.floor(y / 3) * 3) + 3; l++) {
            if (matrix[k][l] === 0) {
                neighbours.set(`${k},${l}`, checkPos(k, l));
            }
        }
    }

    if (neighbours.size === 0) {
        return [];
    }

    let arr = Array.from(neighbours.values());    
    let xx = arr.reduce(function(a, b) { return a.concat(b) });
    let possibleNums = Array.from(new Set(xx));

    let gotcha = [];
    let gotchaSingles = [];

    for (let i = 0; i < possibleNums.length; i++) {    
        for (let item of neighbours.entries()) {
            if (item[1].includes(possibleNums[i])) {
                gotcha.push([possibleNums[i], item[0]]);
            }
        }    
        if (gotcha.length === 1) {
            gotchaSingles.push(gotcha[0]);                
        }
            gotcha = [];
    }

    return gotchaSingles;
}

function checkNeighboursRow(x, y) {

    let neighbours = new Map();

    for (let i = 0; i < 9; i++) {
        if (matrix[x][i] === 0) {
            neighbours.set(`${x},${i}`, checkPos(x, i));
        }
        
    }

    if (neighbours.size === 0) {
        return [];
    }

    let arr = Array.from(neighbours.values());    
    let xx = arr.reduce(function(a, b) { return a.concat(b) });
    let possibleNums = Array.from(new Set(xx));

    let gotcha = [];
    let gotchaSingles = [];

    for (let i = 0; i < possibleNums.length; i++) {    
        for (let item of neighbours.entries()) {
            if (item[1].includes(possibleNums[i])) {
                gotcha.push([possibleNums[i], item[0]]);
            }
        }    
        if (gotcha.length === 1) {
            gotchaSingles.push(gotcha[0]);                
        }
            gotcha = [];
    }

    return gotchaSingles;
}

function checkNeighboursCol(x, y) {

    let neighbours = new Map();

    for (let i = 0; i < 9; i++) {
        if (matrix[i][y] === 0) {
            neighbours.set(`${i},${y}`, checkPos(i, y));
        }
    }

    if (neighbours.size === 0) {
        return [];
    }

    let arr = Array.from(neighbours.values());    
    let xx = arr.reduce(function(a, b) { return a.concat(b) });
    let possibleNums = Array.from(new Set(xx));

    let gotcha = [];
    let gotchaSingles = [];

    for (let i = 0; i < possibleNums.length; i++) {    
        for (let item of neighbours.entries()) {
            if (item[1].includes(possibleNums[i])) {
                gotcha.push([possibleNums[i], item[0]]);
            }
        }    
        if (gotcha.length === 1) {
            gotchaSingles.push(gotcha[0]);                
        }
            gotcha = [];
    }

    return gotchaSingles;
}

let zeroes = new Set();
for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
        if (matrix[a][b] === 0) {
            zeroes.add(`${a},${b}`);
        }
    }
}

let checker = true;

function checkPosFix() {
checker = false;
for (let item of zeroes) {
    let x = checkPos(item[0], item[2]);
    if (x.length === 1) {
            matrix[item[0]][item[2]] = x[0];
            zeroes.delete(`${item[0]},${item[2]}`);
            checker = true;
    }
}
return checker;
}

function squareFix() {
checker = false;
for (let item of zeroes) {
    let x = checkNeighboursSquare(item[0], item[2]);    
    if (x.length > 0) {
        for (let i = 0; i < x.length; i++) {
            matrix[x[i][1][0]][x[i][1][2]] = x[i][0];
            zeroes.delete(`${x[i][1][0]},${x[i][1][2]}`);
            checker = true;
        }
    }        
}
return checker;
}

function rowFix() {
checker = false;
for (let item of zeroes) {
    let x = checkNeighboursRow(item[0], item[2]);
    if (x.length > 0) {
        for (let i = 0; i < x.length; i++) {
            matrix[x[i][1][0]][x[i][1][2]] = x[i][0];
            zeroes.delete(`${x[i][1][0]},${x[i][1][2]}`);
            checker = true;
        }
    }
}
return checker;
}

function colFix() {
checker = false;
for (let item of zeroes) {
    let x = checkNeighboursCol(item[0], item[2]);
    if (x.length > 0) {
        for (let i = 0; i < x.length; i++) {
            matrix[x[i][1][0]][x[i][1][2]] = x[i][0];
            zeroes.delete(`${x[i][1][0]},${x[i][1][2]}`);
            checker = true;
        }
    }
}
return checker;
}

function solver() {
    checker = true;
    while (checker) {
        checkPosFix();
        squareFix();
        rowFix();
        colFix();
    }
}

function tryer() {

    if (zeroes.size > 0) {
        let arrX = [];
        for (let item of zeroes) {
            arrX.push([checkPos(item[0], item[2]), item]);
        }

        bigOuter: for (let i = 0; i < arrX.length - 3; i++) {

                      for (let j = 0; j < arrX[i][0].length; j++) {

                        outer: for (let m = 0; m < arrX[i + 1][0].length; m++) {

                                let matrixCopy = JSON.parse(JSON.stringify(matrix));
                                let zeroesCopy = Array.from(zeroes);
                                matrix[arrX[i][1][0]][arrX[i][1][2]] = arrX[i][0][j];
                                matrix[arrX[i + 1][1][0]][arrX[i + 1][1][2]] = arrX[i + 1][0][m];
                                
                                solver();
                
                                    for (let k = 0; k < 9; k++) {
                                        for (let l = 0; l < 9; l++) {
                                            if (matrix[k][l] === 0) {
                                                matrix = JSON.parse(JSON.stringify(matrixCopy));
                                                zeroes = new Set(zeroesCopy);
                                                continue outer;
                                            }
                                        }
                                    }
                                    break bigOuter;
            }
        }
        }
    }
}

solver();
tryer();

return matrix;
}
