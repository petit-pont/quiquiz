const loadingScreen = document.getElementById('loading-screen');
const resultScreen = document.getElementById('result-screen');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const manaSymbolWhite = document.getElementById('mana-white');
const manaSymbolBlue = document.getElementById('mana-blue');
const manaSymbolBlack = document.getElementById('mana-black');
const manaSymbolRed = document.getElementById('mana-red');
const manaSymbolGreen = document.getElementById('mana-green');
const manaSymbolColorless = document.getElementById('mana-colorless');

// The 6 categories we are assessing in the test. The object contains the total of points earned in that category with the choices made by the player.
const white = new Category('W');
const blue = new Category('U');
const black = new Category('B');
const red = new Category('R');
const green = new Category('G');
const colorless = new Category('C');

// Put them in an array to be able to easily loop through and find the dominant ones.
const colors = [white, blue, black, red, green, colorless];

let questions = [];
let results;
let playerChoices = [];

// Mock choices for tests
// let mockChoices = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2];
// let mockChoices = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
// let mockChoices = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
// localStorage.setItem("mana-quiz-choices", JSON.stringify(mockChoices));
    

calculateResult();

// Synchronized sequence to load resources, calculate totals from the player choices and display the final results.
async function calculateResult() {
    questions = await loadResources('questions.json');
    results = await loadResources('results.json');
    playerChoices = JSON.parse(localStorage.getItem('mana-quiz-choices'));
    // TODO: catch case where player choices can't be found or is corrupted.

    // console.log(questions);
    // console.log(results);
    // console.log(playerChoices);
    
    // Calculates total for each color.
    for (let i = 0; i < questions.length; i++) {
        white.total += questions[i].choices[playerChoices[i] - 1].whiteValue;
        blue.total += questions[i].choices[playerChoices[i] - 1].blueValue;
        black.total += questions[i].choices[playerChoices[i] - 1].blackValue;
        red.total += questions[i].choices[playerChoices[i] - 1].redValue;
        green.total += questions[i].choices[playerChoices[i] - 1].greenValue;
        colorless.total += questions[i].choices[playerChoices[i] - 1].colorlessValue;
    }
    
    // console.log('white total: ', white.total);
    // console.log('blue total: ', blue.total);
    // console.log('black total: ', black.total);
    // console.log('red total: ', red.total);
    // console.log('green total: ', green.total);
    // console.log('colorless total: ', colorless.total);
    
    const resultCode = findDominantCategories(colors);
    displayResult(resultCode);
}

// Used to load the objects stored in .jsons 
async function loadResources(url) {
    const request = await fetch(url);
    const response = await request.json();
    return response;
}

// Creates a code representing the dominant colors in the chosen answers. The code is used to display the correct result text from results.json.
function findDominantCategories(categories) {
    let resultCode = '';
    let highestCategoryTotal = 0;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].total === highestCategoryTotal) {
            resultCode += categories[i].code;
        }
        if (categories[i].total > highestCategoryTotal) {
            resultCode = categories[i].code;
            highestCategoryTotal = categories[i].total;
        }
    }
    
    // Remove 'C' from the code if it's not mono-colorless.
    if (resultCode.length > 1 && resultCode.includes('C')) {
        resultCode = resultCode.replace('C', '');
    }

    // console.log('result code: ' + resultCode);
    return resultCode;
}

function displayResult(code) {
    // Hide mana symbols that are not present in the code
    if (!code.includes('W')) manaSymbolWhite.classList.add('hidden');
    if (!code.includes('U')) manaSymbolBlue.classList.add('hidden');
    if (!code.includes('B')) manaSymbolBlack.classList.add('hidden');
    if (!code.includes('R')) manaSymbolRed.classList.add('hidden');
    if (!code.includes('G')) manaSymbolGreen.classList.add('hidden');
    if (!code.includes('C')) manaSymbolColorless.classList.add('hidden');

    // Result Title
    resultTitle.innerText = results[code].title;

    // Result Text
    resultText.innerText = results[code].text;

    loadingScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
}

// Constructor for the category objects where the total of points for each of these are tallied.
function Category(code) {
    const categoryCode = code;
    this.total = 0;

    Object.defineProperty(this, 'code', {
        get: function() {
            return categoryCode;
        }
    });
}