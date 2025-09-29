let count = 0;
const counterDisplay = document.getElementById("counter");
const messageDisplay = document.getElementById("message");

const updateCounter = () => {
  counterDisplay.textContent = count;
  messageDisplay.textContent =
    count === 10 ? "Maximum limit reached!" :
    count === 0 ? "Minimum limit reached!" : "";
};

document.querySelector(".btn-group").addEventListener("click", (e) => {
  if (e.target.id === "incrementBtn" && count < 10) count++;
  if (e.target.id === "decrementBtn" && count > 0) count--;
  updateCounter();
});

updateCounter();
