let questions = [];

let currentQuestion = null;

let correctCount = 0;
let totalCount = 0;

// =========================
// 要素取得
// =========================

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

// =========================
// JSON読み込み
// =========================

async function loadQuestions() {

    try {

        const response =
            await fetch("./questions.json");

        questions =
            await response.json();

        nextQuestion();

    } catch(error) {

        console.error(error);

        message.textContent =
            "問題データを読み込めませんでした";

    }

}

// =========================
// 出題候補取得
// =========================

function getFilteredQuestions() {

    const selectedDifficulty =
        difficulty.value;

    if(selectedDifficulty === "all") {

        return questions;

    }

    return questions.filter(q =>
        String(q.difficulty) ===
        selectedDifficulty
    );

}

// =========================
// 次の問題
// =========================

function nextQuestion() {

    const candidates =
        getFilteredQuestions();

    if(candidates.length === 0) {

        message.textContent =
            "問題がありません";

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

// =========================
// 問題表示
// =========================

function displayQuestion() {

    questionImage.src =
        `images/${currentQuestion.word}.png`;

    questionImage.alt =
        currentQuestion.word;

    answerInput.value = "";

    message.textContent = "";

    updateHints();

    answerInput.focus();

}

// =========================
// ヒント表示
// =========================

function updateHints() {

    const level =
        Number(supportLevel.value);

    kanaHint.textContent =
        level >= 1
            ? currentQuestion.word
            : "";

    romanHint.textContent =
        level >= 2
            ? (currentQuestion.roma || "")
            : "";

}

// =========================
// 正解判定
// =========================

function checkAnswer() {

    if(!currentQuestion) return;

    const input =
        answerInput.value
            .trim()
            .replace(/\s/g, "");

    totalCount++;

    totalCountElement.textContent =
        totalCount;

    if(input === currentQuestion.word) {

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
            `❌ 正解：${currentQuestion.word}`;

    }

}

// =========================
// イベント
// =========================

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

        if(event.key === "Enter") {

            checkAnswer();

        }

    }
);

supportLevel.addEventListener(
    "change",
    () => {

        if(currentQuestion) {

            updateHints();

        }

    }
);

difficulty.addEventListener(
    "change",
    () => {

        nextQuestion();

    }
);

// =========================
// 開始
// =========================

loadQuestions();
