// Theme Toggle
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('dashboardTheme');
if(savedTheme) {
    body.classList.add(savedTheme);
}

// Toggle dark/light mode
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if(body.classList.contains('dark-mode')){
        localStorage.setItem('dashboardTheme', 'dark-mode');
    } else {
        localStorage.setItem('dashboardTheme', '');
    }
});
