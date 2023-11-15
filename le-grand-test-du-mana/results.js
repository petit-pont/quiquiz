const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const manaSymbolWhite = document.getElementById("mana-white");
const manaSymbolBlue = document.getElementById("mana-blue");
const manaSymbolBlack = document.getElementById("mana-black");
const manaSymbolRed = document.getElementById("mana-red");
const manaSymbolGreen = document.getElementById("mana-green");
const manaSymbolColorless = document.getElementById("mana-colorless");

let colors = [
    {
        name: "white",
        code: 'W',
        total: 0
    },
    {
        name: "blue",
        code: 'U',
        total: 0
    },
    {
        name: "black",
        code: 'B',
        total: 0
    },
    {
        name: "red",
        code: 'R',
        total: 0
    },
    {
        name: "green",
        code: 'G',
        total: 0
    },
    {
        name: "colorless",
        code: 'C',
        total: 0
    }
]

let questions = [];
let results;
let playerChoices = [];


// Mocked choices for testing
// mockChoices = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2]
// mockChoices = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// localStorage.setItem("mana-quiz-choices", JSON.stringify(mockChoices));

calculateResult();


async function loadResources(url) {
    const request = await fetch(url);
    const response = await request.json();
    return response;
}

async function calculateResult() {
    questions = await loadResources("questions.json");
    results = await loadResources("results.json");
    console.log(questions);
    console.log(results);
    playerChoices = JSON.parse(localStorage.getItem("mana-quiz-choices"));
    console.log(playerChoices);

    // Calculates total for each color.
    for (let i = 0; i < playerChoices.length; i++) {
        colors[0].total += questions[i].choices[playerChoices[i] - 1].whiteValue;
        colors[1].total += questions[i].choices[playerChoices[i] - 1].blueValue;
        colors[2].total += questions[i].choices[playerChoices[i] - 1].blackValue;
        colors[3].total += questions[i].choices[playerChoices[i] - 1].redValue;
        colors[4].total += questions[i].choices[playerChoices[i] - 1].greenValue;
        colors[5].total += questions[i].choices[playerChoices[i] - 1].colorlessValue;
    }

    console.log("white total: " + colors[0].total);
    console.log("blue total: " + colors[1].total);
    console.log("black total: " + colors[2].total);
    console.log("red total: " + colors[3].total);
    console.log("green total: " + colors[4].total);
    console.log("colorless total: " + colors[5].total);

    const resultCode = findDominantColors();
    displayResult(resultCode);
}

function findDominantColors() {
    let resultCode = "";
    let n = 0; // the current dominant color total value;

    for (let i = 0; i < colors.length; i++) {
        if (colors[i].total === n) {
            resultCode += colors[i].code;
        }
        if (colors[i].total > n) {
            resultCode = colors[i].code;
            n = colors[i].total;
        }
    }
    
    // remove 'C' from the code if it's not mono-colorless.
    if (resultCode.length > 1 && resultCode.includes('C')) {
        resultCode = resultCode.replace('C', '');
    }

    console.log("result code: " + resultCode);
    return resultCode;
}

function displayResult(code) {
    // Mana symbols
    if (!code.includes('W')) manaSymbolWhite.classList.add("hidden");
    if (!code.includes('U')) manaSymbolBlue.classList.add("hidden");
    if (!code.includes('B')) manaSymbolBlack.classList.add("hidden");
    if (!code.includes('R')) manaSymbolRed.classList.add("hidden");
    if (!code.includes('G')) manaSymbolGreen.classList.add("hidden");
    if (!code.includes('C')) manaSymbolColorless.classList.add("hidden");

    // Result Title
    resultTitle.innerText = results[code].title;

    // Result Text
    resultText.innerText = results[code].text;

    loadingScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
}

