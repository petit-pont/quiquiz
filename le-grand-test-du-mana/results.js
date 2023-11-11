const loadingScreen = document.getElementById("loading-screen");
const quiz = document.getElementById("quiz");
const questionCount = document.getElementById("question-count");
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

let questions = [];
let currentQuestion = {};
let questionCounter = 0;
let acceptingAnswer = false;

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswer) return;
        
        acceptingAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        getNextQuestion();
    })
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
    getNextQuestion();
    quiz.classList.remove("hidden");
    loadingScreen.classList.add("hidden");
};

getNextQuestion = () => {
    if (questionCounter >= questions.length) {
        display
    }
    questionCounter++;
    questionCount.innerText = `Question ${questionCounter} sur ${questions.length}`;
    currentQuestion = questions[questionCounter - 1];
    console.log(currentQuestion)
    question.innerText = currentQuestion.questionText;
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion.choices[number - 1].choiceText;
    });
    acceptingAnswer = true;
};
