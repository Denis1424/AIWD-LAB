document.addEventListener("DOMContentLoaded", () => {
    let timeLeft = 10;
    const timerDisplay = document.getElementById("timer");
    const warningMsg = document.getElementById("warning-msg");
    const timerContainer = document.querySelector(".timer-container");
    const quizForm = document.getElementById("quiz-form");
    const submitBtn = document.getElementById("submit-btn");
    const resultContainer = document.getElementById("result-container");
    const scoreDisplay = document.getElementById("score");

    const correctAnswers = {
        q1: "A",
        q2: "A",
        q3: "C",
        q4: "C",
        q5: "A"
    };

    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 5 && timeLeft > 0) {
            warningMsg.classList.remove("hidden");
            timerContainer.classList.add("warning");
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "0";
            submitQuiz();
        }
    }, 1000);

    quizForm.addEventListener("submit", (e) => {
        e.preventDefault();
        clearInterval(timerInterval);
        submitQuiz();
    });

    function submitQuiz() {
        // Disable inputs and button
        const inputs = document.querySelectorAll("input[type='radio']");
        inputs.forEach(input => input.disabled = true);
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitted";

        // Calculate score
        let score = 0;
        const formData = new FormData(quizForm);
        
        for (const [question, answer] of formData.entries()) {
            if (correctAnswers[question] === answer) {
                score++;
            }
        }

        // Show score
        scoreDisplay.textContent = score;
        resultContainer.classList.remove("hidden");
        warningMsg.classList.add("hidden");
        timerContainer.classList.remove("warning");
    }
});
