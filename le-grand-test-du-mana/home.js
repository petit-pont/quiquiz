const buttonStart = document.getElementById('btn-start');
const buttonOpenCredits = document.getElementById('btn-credits');
const buttonCloseCredits = document.getElementById('btn-credits-close');
const creditsScreen = document.getElementById('credits');

buttonStart.addEventListener('click', e => {
    window.location.href = 'quiz.html';
});

buttonOpenCredits.addEventListener('click', e => {
    creditsScreen.classList.remove('hidden');
});

buttonCloseCredits.addEventListener('click', e => {
    creditsScreen.classList.add('hidden');
});