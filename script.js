const startButton = document.getElementById("start-button");
const countdown = document.getElementById("countdown");
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const timerElement = document.getElementById("timer");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const resultContainer = document.getElementById("result-container");
const resultElement = document.getElementById("result");
const current = document.getElementById("current");
const totalTime = document.getElementById("total");
const questions = [
  {
    question: "წყლის ქიმიური სიმბოლოა",
    options: ["O2", " H2O", "CO2"],
    correct: 1,
    selected: null,
  },
  {
    question: "რომელი არის საფრანგეთის დედაქალაქი?",
    options: ["ლონდონი", "პარიზი", "რომი"],
    correct: 1,
    selected: null,
  },
  {
    question: "რომელი არის გერმანიის დედაქალაქი?",
    options: ["ბერლინი", "პარიზი", "რომი"],
    correct: 0,
    selected: null,
  },
  {
    question: "რომელ კონტინენტზე მდებარეობს საჰარას უდაბნო?",
    options: ["აზია", "ავსტრალია", "აფრიკა"],
    correct: 2,
    selected: null,
  },
  {
    question: "ვინ იყო ამერიკის შეერთებული შტატების პირველი პრეზიდენტი? ",
    options: ["აბრაამ ლინკოლნი", "ჯორჯ ვაშინგტონი", "ტომას ჯეფერსონი"],
    correct: 1,
    selected: null,
  },
  {
    question: "რომელ წელს ჩაიძირა ტიტანიკი?",
    options: ["1912", "1905", "1898"],
    correct: 0,
    selected: null,
  },
  {
    question: "ვინ არის ჰარი პოტერის სერიების ავტორი",
    options: [" J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"],
    correct: 1,
    selected: null,
  },
];
let visitedQuestions = Array(questions.length).fill(false);

let currentQuestionIndex = 0;
let timer;
let countdownTimer;
let timeLeft = 30;
let correctAnswers = 0;
let incorrectAnswers = 0;
let unanswered = 0;
let quizOver = false;
let total = 0;

function resetState() {
  clearInterval(timer);
  clearInterval(countdownTimer);
  countdown.classList.remove("hidden");
  quizContainer.classList.add("hidden");
  resultContainer.classList.add("hidden");
  timeLeft = 30;
  correctAnswers = 0;
  incorrectAnswers = 0;
  unanswered = 0;
  total = 0;
  quizOver = false;
  currentQuestionIndex = 0;
  questions.forEach((question) => {
    question.selected = null;
  });
  visitedQuestions.fill(false);
  updateNavigationButtons();
}

function startQuiz() {
  resetState();
  startButton.classList.add("hidden");

  countdown.textContent = "5";
  let countdownValue = 5;
  countdownTimer = setInterval(() => {
    countdownValue -= 1;
    countdown.textContent = countdownValue;
    if (countdownValue === 0) {
      clearInterval(countdownTimer);
      countdown.classList.add("hidden");
      quizContainer.classList.remove("hidden");
      showQuestion(currentQuestionIndex);
      startTimer();
    }
  }, 1000);
}

function startTimer() {
  timerElement.textContent = `Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft -= 1;
    total += 1;
    timerElement.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      quizOver = true;
      endQuiz("დრო ამოიწურა, ქვიზი დამთავრდა.");
      timerElement.textContent = "";
      current.style.display = "none";
    }
  }, 1000);
}

function showQuestion(index) {
  current.style.display = "block";
  current.textContent = `${index + 1}/${questions.length}`;
  const question = questions[index];
  questionContainer.innerHTML = `
        <p>${question.question}</p>
        ${question.options
          .map(
            (option, i) => `
          <div>
            <label>
              <input type="radio" name="option" value="${i}" ${
              question.selected === i ? "checked" : ""
            }>
              ${option}
            </label>
          </div>
        `
          )
          .join("")}
      `;
  updateNavigationButtons();
}

function nextQuestion() {
  saveAnswer();
  console.log(questions);
  if (!visitedQuestions[currentQuestionIndex]) {
    timeLeft = 30;
    visitedQuestions[currentQuestionIndex] = true;
  }
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex += 1;
    showQuestion(currentQuestionIndex);
  } else {
    endQuiz("ქვიზი დამთავრდა");
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    showQuestion(currentQuestionIndex);
  }
}

function saveAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.selected !== null) {
    if (currentQuestion.selected === currentQuestion.correct) {
      correctAnswers -= 1;
    } else {
      incorrectAnswers -= 1;
    }
  }

  
  if (selectedOption !== null) {
    const selectedAnswer = parseInt(selectedOption.value);
    currentQuestion.selected = selectedAnswer;

    if (selectedAnswer === currentQuestion.correct) {
      correctAnswers += 1;
    } else {
      incorrectAnswers += 1;
    }
  } else {
    currentQuestion.selected = null;
  }
}

function endQuiz(message) {
  clearInterval(timer);
  startButton.classList.remove("hidden");

  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  if (quizOver) {
    resultElement.textContent = `${message}`;
  } else {
    unanswered = questions.filter(
      (question) => question.selected === null
    ).length;
    resultElement.textContent = `${message}\nსწორი პახუხი: ${correctAnswers}\nარასწორი პასუხი: ${incorrectAnswers}\nმოუნიშნავი: ${unanswered}`;
    timerElement.textContent = "";
    current.style.display = "none";
    totalTime.textContent = `შენ დაგჭირდა ${total} წამი`;
    console.log(total);
  }
}

function updateNavigationButtons() {
  prevButton.style.display = "inline-block";
  nextButton.style.display = "inline-block";
}

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
prevButton.addEventListener("click", prevQuestion);
