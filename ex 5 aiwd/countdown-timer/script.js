document.addEventListener("DOMContentLoaded", () => {
    // Set future date (e.g., 5 days from now for testing purposes)
    // You can change this to a specific date like: new Date("Dec 31, 2026 23:59:59").getTime();
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 5);
    const countDownDate = eventDate.getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const countdownGrid = document.getElementById("countdown");
    const closedMessage = document.getElementById("closed-message");
    const registerBtn = document.getElementById("register-btn");

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownGrid.classList.add("hidden");
            closedMessage.classList.remove("hidden");
            registerBtn.disabled = true;
            registerBtn.textContent = "Event Started";
            return;
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = formatTime(days);
        hoursEl.textContent = formatTime(hours);
        minutesEl.textContent = formatTime(minutes);
        secondsEl.textContent = formatTime(seconds);
    }, 1000);
});
