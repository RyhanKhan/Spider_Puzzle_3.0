const puzzleContainer = document.querySelector("#puzzle-container")
let puzzle = []
let size = 3
document.querySelector("#img").addEventListener("change", hello);
function hello() {
    // console.log(this.files);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        // console.log(reader.result);
        localStorage.setItem("recent-image", reader.result);
    });


    reader.readAsDataURL(this.files[0]);

}
const targetImage = localStorage.getItem("recent-image");
//console.log(targetImage);

generatePuzzle()
//changePicture()
randomizePuzzle()
renderPuzzle()
handleInput()

function getRow(pos) {
    return Math.ceil(pos / size)
}

function getCol(pos) {
    const col = pos % size
    if (col === 0) {
        return size
    }
    return col
}

function generatePuzzle() {
    for (let i = 1; i <= size * size; i++) {
        puzzle.push({
            value: i,
            position: i,
            x: (getCol(i) - 1) * 120,
            y: (getRow(i) - 1) * 120,
            disabled: false,
        })
    }
}

function renderPuzzle() {
    console.log("hello");
    puzzleContainer.innerHTML = ""
    for (let puzzleItem of puzzle) {
        if (puzzleItem.disabled) continue
        puzzleContainer.innerHTML += `
                <div class="puzzle-item tileGang tile${puzzleItem.value}" style="left: ${puzzleItem.x}px; top: ${puzzleItem.y}px;">
                    ${puzzleItem.value}
                </div>
            `
    }
}

function changePicture() {
    let pieces = document.querySelectorAll(".tileGang");
    for (let i = 0; i < 8; i++) {
        pieces[i].style.backgroundImage = `url('${targetImage}')`;
        pieces[i].style.backgroundSize = '360px 360px';
    }
    const backgroundImage = document.createElement("div");
    backgroundImage.id = "background-image";
    puzzleContainer.appendChild(backgroundImage);
    backgroundImage.style.backgroundImage = `url('${targetImage}')`;
    backgroundImage.style.backgroundSize = '360px 360px';
    backgroundImage.style.opacity = '0.4';
}

function randomizePuzzle() {
    const randomValues = getRandomValues();
    let solvable = isSolvable(randomValues);

    while (!solvable) {
        randomValues.sort(() => Math.random() - 0.5);
        solvable = isSolvable(randomValues);
    }

    let i = 0;
    for (let puzzleItem of puzzle) {
        puzzleItem.value = randomValues[i];
        i++;
    }

    const puzzleWithValueOf9 = puzzle.find((item) => item.value === size * size);
    puzzleWithValueOf9.disabled = true;
}

function isSolvable(values) {
    const inversions = countInversions(values);
    const blankRowFromBottom = size - getRow(values.indexOf(size * size));

    if (size % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        if (blankRowFromBottom % 2 === 0) {
            return inversions % 2 === 1;
        } else {
            return inversions % 2 === 0;
        }
    }
}

function countInversions(values) {
    let inversions = 0;
    for (let i = 0; i < values.length - 1; i++) {
        for (let j = i + 1; j < values.length; j++) {
            if (values[j] && values[i] && values[i] > values[j]) {
                inversions++;
            }
        }
    }
    return inversions;
}


function getRandomValues() {
    const values = []
    for (let i = 1; i <= size * size; i++) {
        values.push(i)
    }

    const randomValues = values.sort(() => Math.random() - 0.5)
    return randomValues
}

function handleInput() {
    document.addEventListener("keydown", handleKeyDown)
}

function handleKeyDown(e) {
    console.log(e.key)
    switch (e.key) {
        case "ArrowLeft":
            moveLeft()
            break
        case "ArrowRight":
            moveRight()
            break
        case "ArrowUp":
            moveUp()
            break
        case "ArrowDown":
            moveDown()
            break
    }
    renderPuzzle()
    changePicture()
}

function moveLeft() {
    const emptyPuzzle = getEmptyPuzzle()
    const rightPuzzle = getRightPuzzle()
    if (rightPuzzle) {
        swapPositions(emptyPuzzle, rightPuzzle, true)
    }
}
function moveRight() {
    const emptyPuzzle = getEmptyPuzzle()
    const leftPuzzle = getLeftPuzzle()
    if (leftPuzzle) {
        swapPositions(emptyPuzzle, leftPuzzle, true)
    }
}
function moveUp() {
    const emptyPuzzle = getEmptyPuzzle()
    const belowPuzzle = getBelowPuzzle()
    if (belowPuzzle) {
        swapPositions(emptyPuzzle, belowPuzzle, false)
    }
}
function moveDown() {
    const emptyPuzzle = getEmptyPuzzle()
    const abovePuzzle = getAbovePuzzle()
    if (abovePuzzle) {
        swapPositions(emptyPuzzle, abovePuzzle, false)
    }
}

function swapPositions(firstPuzzle, secondPuzzle, isX = false) {
    // position swapping
    let temp = firstPuzzle.position
    firstPuzzle.position = secondPuzzle.position
    secondPuzzle.position = temp

    // x position swapping

    if (isX) {
        temp = firstPuzzle.x
        firstPuzzle.x = secondPuzzle.x
        secondPuzzle.x = temp
    } else {
        // must be y
        temp = firstPuzzle.y
        firstPuzzle.y = secondPuzzle.y
        secondPuzzle.y = temp
    }
}

function getRightPuzzle() {
    /* get the puzzle just right to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isRightEdge = getCol(emptyPuzzle.position) === size
    if (isRightEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position + 1)
    return puzzle
}
function getLeftPuzzle() {
    /* get the puzzle just left to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isLeftEdge = getCol(emptyPuzzle.position) === 1
    if (isLeftEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position - 1)
    return puzzle
}
function getAbovePuzzle() {
    /* get the puzzle just above to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isTopEdge = getRow(emptyPuzzle.position) === 1
    if (isTopEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position - size)
    return puzzle
}
function getBelowPuzzle() {
    /* get the puzzle just below to the empty puzzle */
    const emptyPuzzle = getEmptyPuzzle()
    const isBottomEdge = getRow(emptyPuzzle.position) === size
    if (isBottomEdge) {
        return null
    }
    const puzzle = getPuzzleByPos(emptyPuzzle.position + size)
    return puzzle
}

function getEmptyPuzzle() {
    return puzzle.find((item) => item.disabled)
}

function getPuzzleByPos(pos) {
    return puzzle.find((item) => item.position === pos)
}
changePicture()
// console.log(puzzle)