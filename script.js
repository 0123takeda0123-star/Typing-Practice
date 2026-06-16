let questions = [];
let currentQuestion = null;

let correctCount = 0;
let totalCount = 0;

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

    if (selectedDifficulty === "all") {

        return questions;

    }

    return questions.filter(question =>
        question.length <= Number(selectedDifficulty)
    );

}


// -------------------------
// ランダム出題
// -------------------------

function nextQuestion() {

    const candidates =
        getFilteredQuestions();

    if (candidates.length === 0) {

        message.textContent =
            "条件に合う問題がありません";

        return;

    }

    const randomIndex =
        Math.floor(
            Math.random() *
            candidates.length
        );

    currentQuestion =
        candidates[randomIndex];

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

        const u =
            new SpeechSynthesisUtterance(input);

        u.lang = "ja-JP";

        u.onend = () => {
            judgeAnswer(input);
        };

        speechSynthesis.cancel();
        speechSynthesis.speak(u);

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

        if (event.key === "Enter") {

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
    nextQuestion
);

speakButton.addEventListener("click", () => {

    if(!currentQuestion) return;

    speak(currentQuestion.word);

});

// -------------------------
// 起動
// -------------------------

loadQuestions();
