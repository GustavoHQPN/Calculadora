// Estados Globais da Aplicação
let expression = '';
let isScientificOpen = false;
let angleUnit = 'DEG'; // 'DEG' ou 'RAD'

// Elementos do DOM
const expressionDisplay = document.getElementById('expressionDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const botoesCientifica = document.getElementById('botoesCientifica');
const scientificBadge = document.getElementById('scientificBadge');
const modeIndicator = document.getElementById('modeIndicator');
const unitText = document.getElementById('unitText');

// Configuração da Web Audio API para Feedback Sonoro
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playClickSound() {
    try {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
        // Silencioso se o áudio for bloqueado pelo navegador
    }
}

// Atualização da Interface
function updateDisplay() {
    expressionDisplay.textContent = expression;
    
    if (expression.trim() === '') {
        resultDisplay.textContent = '0';
        return;
    }

    // Pré-visualização do resultado em tempo real
    try {
        const evaluated = evaluateExpression(expression);
        if (!isNaN(evaluated) && isFinite(evaluated)) {
            resultDisplay.textContent = formatNumber(evaluated);
        }
    } catch (e) {
        // Aguarda expressão válida
    }
}

function appendCharacter(char) {
    playClickSound();
    expression += char;
    updateDisplay();
}

function clearDisplay() {
    playClickSound();
    expression = '';
    resultDisplay.textContent = '0';
    expressionDisplay.textContent = '';
}

function deleteDigit() {
    playClickSound();
    expression = expression.slice(0, -1);
    updateDisplay();
}

function toggleScientific() {
    playClickSound();
    isScientificOpen = !isScientificOpen;
    
    if (isScientificOpen) {
        botoesCientifica.classList.add('active');
        scientificBadge.textContent = 'CIENTÍFICA';
        scientificBadge.style.color = 'var(--primary)';
    } else {
        botoesCientifica.classList.remove('active');
        scientificBadge.textContent = 'PADRÃO';
        scientificBadge.style.color = 'var(--text-muted)';
    }
}

function toggleAngleUnit() {
    playClickSound();
    angleUnit = angleUnit === 'DEG' ? 'RAD' : 'DEG';
    unitText.textContent = angleUnit;
    modeIndicator.textContent = angleUnit;
    updateDisplay();
}

function calculateResult() {
    playClickSound();
    if (!expression) return;

    try {
        const result = evaluateExpression(expression);

        if (isNaN(result) || !isFinite(result)) {
            resultDisplay.textContent = 'Erro';
            return;
        }

        expression = String(result);
        expressionDisplay.textContent = '';
        resultDisplay.textContent = formatNumber(result);
    } catch (error) {
        resultDisplay.textContent = 'Sintaxe Inválida';
    }
}

function formatNumber(num) {
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(4);
    }
    return Number(num.toFixed(8)).toString();
}

// Avaliador de Expressões Matemáticas
function evaluateExpression(expr) {
    let parsed = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'Math.PI');

    const radFactor = angleUnit === 'DEG' ? '(Math.PI/180)*' : '';

    parsed = parsed
        .replace(/sin\(/g, `Math.sin(${radFactor}`)
        .replace(/cos\(/g, `Math.cos(${radFactor}`)
        .replace(/tan\(/g, `Math.tan(${radFactor}`)
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

    return Function(`"use strict"; return (${parsed})`)();
}

// Suporte a Teclado
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key) || key === '.') {
        appendCharacter(key);
    } else if (key === 'Backspace') {
        deleteDigit();
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (['+', '-', '*', '/', '%', '(', ')', '^'].includes(key)) {
        appendCharacter(key);
    }
});