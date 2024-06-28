let display = document.getElementById('display');
let botoesCientifica = document.getElementById('botoesCientifica');
let Cientifica = false;

function appendCharacter(char) {
    display.textContent += char;
}

function clearDisplay() {
    display.textContent = '';
}

function deleteDigit() {
    display.textContent = display.textContent.slice(0, -1);
}

function calculateResult() {
    try {
        let result = eval(display.textContent.replace('^', '**').replace('sqrt', 'Math.sqrt').replace('sin', 'Math.sin').replace('cos', 'Math.cos').replace('tan', 'Math.tan').replace('log', 'Math.log').replace('exp', 'Math.exp'));
        display.textContent = result;
    } catch (error) {
        display.textContent = 'Error';
    }
}

function toggleScientific() {
    Cientifica = !Cientifica;
    botoesCientifica.style.display = Cientifica ? 'grid' : 'none';
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (!isNaN(key) || key === '.') {
        appendCharacter(key);
    } else if (key === 'Backspace') {
        deleteDigit();
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        appendCharacter(key);
    } else if (key === '(' || key === ')') {
        appendCharacter(key);
    }
});