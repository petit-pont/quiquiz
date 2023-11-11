const loadingScreen = document.getElementById("loading-screen");
const quiz = document.getElementById("quiz");
const questionCount = document.getElementById("question-count");
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");

let questions = [];
let playerChoices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentQuestion = {};
let acceptingAnswer = false;

// TODO : Recréer la liste des choix à partir de zéro à chaque fois qu'on affiche une nouvelle question. 
choices.forEach(choice => {
    choice.addEventListener("click", e => {
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
    })
});

arrowLeft.addEventListener("click", e => {
    if (arrowLeft.classList.contains("disabled-arrow")) return;
    // if (!acceptingAnswer) return;
    
    acceptingAnswer = false;
    displayQuestion(currentQuestion.questionId - 1);
});

arrowRight.addEventListener("click", e => {
    if (arrowRight.classList.contains("disabled-arrow")) return;
    // if (!acceptingAnswer) return;
    
    acceptingAnswer = false;
    displayQuestion(currentQuestion.questionId + 1);
});

fetch("questions.json")
    .then(response => {
        // console.log(response);
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
    questionCounter = 0;
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
    questionCount.innerText = `Question ${currentQuestion.questionId} sur ${questions.length}`;
    // console.log(currentQuestion)
    question.innerText = currentQuestion.questionText;
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion.choices[number - 1].choiceText;
    });

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
    choices.forEach(choice => {
        if (playerChoices[currentQuestion.questionId - 1] === choice.dataset["number"]) {
            choice.classList.add("selected");
            return;
        }
        choice.classList.remove("selected");
    });
};
