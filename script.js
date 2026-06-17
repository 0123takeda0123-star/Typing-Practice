let questions = [];
let currentQuestion = null;

let correctCount = 0;
let totalCount = 0;

let previousQuestion = null;
let debugIndex = 0;

const questionImage =
    document.getElementById("questionImage");

const kanaHint =
    document.getElementById("kanaHint");

const romanHint =
    document.getElementById("romanHint");

const answerInput =
    document.getElementById("answerInput");

const message =
    document.getElementById("message");

const supportLevel =
    document.getElementById("supportLevel");

const difficulty =
    document.getElementById("difficulty");

const checkButton =
    document.getElementById("checkButton");

const nextButton =
    document.getElementById("nextButton");

const correctCountElement =
    document.getElementById("correctCount");

const totalCountElement =
    document.getElementById("totalCount");

const speakButton =
    document.getElementById("speakButton");

const debugMode =
    document.getElementById("debugMode");


// -------------------------
// JSON読込
// -------------------------

async function loadQuestions() {

    try {

        const response =
            await fetch("./questions.json");

        questions =
            await response.json();

        nextQuestion();

    } catch (error) {

        console.error(error);

        message.textContent =
            "questions.json を読み込めませんでした";

    }

}


// -------------------------
// フィルタ
// -------------------------

function getFilteredQuestions() {

    const selectedDifficulty =
        difficulty.value;

    switch(selectedDifficulty){

        case "normal":
            return questions.filter(q =>
                !q.hasYouonChoon &&
                !q.hasSokuon
            );

        case "youon":
            return questions.filter(q =>
                q.hasYouonChoon &&
                !q.hasSokuon
            );

        case "sokuon":
            return questions.filter(q =>
                !q.hasYouonChoon &&
                q.hasSokuon
            );

        case "both":
            return questions.filter(q =>
                q.hasYouonChoon &&
                q.hasSokuon
            );

        default:
            return questions;

    }

}


// -------------------------
// 出題
// -------------------------

function nextQuestion() {

    const candidates =
        getFilteredQuestions();

    if (candidates.length === 0) {

        message.textContent =
            "条件に合う問題がありません";

        return;

    }

    // デバッグモード
    if (
        debugMode &&
        debugMode.checked
    ) {

        if (
            debugIndex >= candidates.length
        ) {

            debugIndex = 0;

        }

        currentQuestion =
            candidates[debugIndex];

        debugIndex++;

        displayQuestion();

        return;

    }

    // 通常モード
    let next;

    do {

        const randomIndex =
            Math.floor(
                Math.random() *
                candidates.length
            );

        next =
            candidates[randomIndex];

    } while (

        candidates.length > 1 &&

        previousQuestion &&

        next.word ===
        previousQuestion.word

    );

    currentQuestion =
        next;

    previousQuestion =
        currentQuestion;

    displayQuestion();

}


// -------------------------
// 表示更新
// -------------------------

function displayQuestion() {

    questionImage.src =
        `imgs/${currentQuestion.word}.png`;

    questionImage.alt =
        currentQuestion.word;

    answerInput.value = "";

    message.textContent = "";

    updateHints();

    answerInput.focus();

}


// -------------------------
// ヒント表示
// -------------------------

function updateHints() {

    if (!currentQuestion) return;

    const level =
        Number(supportLevel.value);

    kanaHint.textContent =
        level >= 1
            ? currentQuestion.word
            : "";

    romanHint.textContent =
        level >= 2
            ? currentQuestion.roma
            : "";

}


// -------------------------
// 音声読み上げ
// -------------------------

function speak(text){

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "ja-JP";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

}


// -------------------------
// 判定
// -------------------------

function checkAnswer() {

    if (!currentQuestion) return;

    const input =
        answerInput.value.trim();

    if (input) {

        const utterance =
            new SpeechSynthesisUtterance(input);

        utterance.lang = "ja-JP";

        utterance.onend = () => {

            judgeAnswer(input);

        };

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);

        return;

    }

    judgeAnswer(input);

}


function judgeAnswer(input){

    totalCount++;

    totalCountElement.textContent =
        totalCount;

    if (input === currentQuestion.word) {

        correctCount++;

        correctCountElement.textContent =
            correctCount;

        message.textContent =
            "⭕ 正解";

        setTimeout(() => {

            nextQuestion();

        }, 700);

    } else {

        message.textContent =
            `❌ 正解は「${currentQuestion.word}」`;

    }

}


// -------------------------
// イベント
// -------------------------

checkButton.addEventListener(
    "click",
    checkAnswer
);

nextButton.addEventListener(
    "click",
    nextQuestion
);

answerInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            checkAnswer();

        }

    }
);

supportLevel.addEventListener(
    "change",
    updateHints
);

difficulty.addEventListener(
    "change",
    () => {

        debugIndex = 0;

        nextQuestion();

    }
);

if (debugMode) {

    debugMode.addEventListener(
        "change",
        () => {

            debugIndex = 0;

            nextQuestion();

        }
    );

}

speakButton.addEventListener(
    "click",
    () => {

        if (!currentQuestion) return;

        speak(
            currentQuestion.word
        );

    }
);


// -------------------------
// 起動
// -------------------------

loadQuestions();
