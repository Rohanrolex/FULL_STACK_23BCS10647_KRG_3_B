let balance = 0;

const balanceDisplay = document.getElementById('balance');
const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const amountInput = document.getElementById('amount');
const message = document.getElementById('message');

function updateBalance() {
    balanceDisplay.textContent = balance.toFixed(2);
}

function showMessage(msg, color = '#e67e22') {
    message.textContent = msg;
    message.style.color = color;
    setTimeout(() => {
        message.textContent = '';
    }, 3000);
}

depositBtn.addEventListener('click', () => {
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showMessage('Enter a valid amount!');
    } else {
        balance += amount;
        updateBalance();
        showMessage(`₹${amount.toFixed(2)} deposited!`, '#27ae60');
        amountInput.value = '';
    }
});

withdrawBtn.addEventListener('click', () => {
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showMessage('Enter a valid amount!');
    } else if (amount > balance) {
        showMessage('Insufficient balance!', '#c0392b');
    } else {
        balance -= amount;
        updateBalance();
        showMessage(`₹${amount.toFixed(2)} withdrawn!`, '#c0392b');
        amountInput.value = '';
    }
});

updateBalance();
