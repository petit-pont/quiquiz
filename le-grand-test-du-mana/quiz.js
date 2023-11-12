const loadingScreen = document.getElementById("loading-screen");
const quiz = document.getElementById("quiz");
const questionCount = document.getElementById("question-count");
const question = document.getElementById("question");
const choicesList = document.getElementById("container-choices");
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");

let questions = [];
let playerChoices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentQuestion = {};
let acceptingAnswer = false;


arrowLeft.addEventListener("click", e => {
    if (arrowLeft.classList.contains("disabled-arrow")) return;
    
    acceptingAnswer = false;
    displayQuestion(currentQuestion.questionId - 1);
});

arrowRight.addEventListener("click", e => {
    if (arrowRight.classList.contains("disabled-arrow")) return;
    
    acceptingAnswer = false;
    displayQuestion(currentQuestion.questionId + 1);
});

// We load questions and choices from a .json file and start the quiz once the reading-parsing is done.
fetch("questions.json")
    .then(response => {
        return response.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions;
        console.log(questions);
        startQuiz();
    })
    .catch(error => {
        // TODO: create a 500 code page
        console.error(error);
    });


startQuiz = () => {
    localStorage.removeItem("mana-quiz-choices");
    displayQuestion(1);
    quiz.classList.remove("hidden");
    loadingScreen.classList.add("hidden");
};

displayQuestion = (questionId) => {
    if (questionId > questions.length) {
        // TODO: display confirm message
        localStorage.setItem("mana-quiz-choices", JSON.stringify(playerChoices));
        return;
    }

    currentQuestion = questions[questionId - 1];
    console.log(currentQuestion);
    questionCount.innerText = `Question ${currentQuestion.questionId} sur ${questions.length}`;
    question.innerText = currentQuestion.questionText;

    // Create choices
    choicesList.innerHTML = '';
    for (let i = 0; i < currentQuestion.choices.length; i++) {
        const newLi = document.createElement('li');
        newLi.classList.add("choice-text");
        newLi.dataset.number = i + 1;
        newLi.innerText = currentQuestion.choices[i].choiceText;

        newLi.addEventListener("click", e => {
            if (!acceptingAnswer) return;
            
            acceptingAnswer = false;
            const clickedChoice = e.target;
            const selectedAnswerIndex = clickedChoice.dataset["number"];
            
            // Check if it the current question was already answered.
            if (playerChoices[currentQuestion.questionId - 1] === 0) {
                playerChoices[currentQuestion.questionId - 1] = selectedAnswerIndex;
                displayQuestion(currentQuestion.questionId + 1);
                return;
            };
    
            // Otherwise we save the new choice and update visuals.
            playerChoices[currentQuestion.questionId - 1] = selectedAnswerIndex;
            updateChoicesFrames();
            acceptingAnswer = true;
        });

        choicesList.appendChild(newLi);
    }

    updateLeftArrow();
    updateRightArrow();
    updateChoicesFrames();

    acceptingAnswer = true;
};

updateLeftArrow = () => {
    if (currentQuestion.questionId <= 1) {
        arrowLeft.classList.add("disabled-arrow");
        return;
    }
    arrowLeft.classList.remove("disabled-arrow");
};

updateRightArrow = () => {
    if (playerChoices[currentQuestion.questionId - 1] != 0) {
        arrowRight.classList.remove("disabled-arrow");
        return;  
    };
    arrowRight.classList.add("disabled-arrow");
};

updateChoicesFrames = () => {
    const choices = Array.from(document.getElementsByClassName("choice-text"));
    
    choices.forEach(choice => {
        if (playerChoices[currentQuestion.questionId - 1] === choice.dataset["number"]) {
            choice.classList.add("selected");
            return;
        }
        choice.classList.remove("selected");
    });
};
