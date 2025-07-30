class Calculator {
    constructor(displayCurrent, displayPrevious) {
        this.displayCurrent = displayCurrent;
        this.displayPrevious = displayPrevious;
        this.clear();
    }
    
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }
    
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }
    
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev)) return;
        if (isNaN(current) && this.operation !== 'percentage') return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                computation = prev / current;
                break;
            case '%':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }
    
    percentage() {
        if (this.currentOperand === '') return;
        if (this.previousOperand === '') {
            this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        } else {
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            this.currentOperand = (prev * (current / 100)).toString();
        }
        this.updateDisplay();
    }
    
    getDisplayNumber(number) {
        if (number === '') return '0';
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.displayCurrent.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.displayPrevious.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.displayPrevious.innerText = this.previousOperand;
        }
    }
}

// DOM Elements
const displayCurrent = document.querySelector('.current-operation');
const displayPrevious = document.querySelector('.previous-operation');

// Initialize calculator
const calculator = new Calculator(displayCurrent, displayPrevious);

// Button event handlers
document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
});

document.querySelector('[data-action="percentage"]').addEventListener('click', () => {
    calculator.percentage();
});

document.querySelector('[data-action="equals"]').addEventListener('click', () => {
    calculator.calculate();
});

// Number buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
    });
});

// Operator buttons
document.querySelectorAll('[data-action]').forEach(button => {
    const action = button.dataset.action;
    if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
        button.addEventListener('click', () => {
            calculator.chooseOperation(
                action === 'add' ? '+' :
                action === 'subtract' ? '-' :
                action === 'multiply' ? '×' : '÷'
            );
        });
    }
});

// Enhanced Keyboard Support
document.addEventListener('keydown', e => {
    // Prevent default for keys we're handling
    if (/^[0-9]$|\.|\+|\-|\*|\/|Enter|Backspace|Escape|%/.test(e.key)) {
        e.preventDefault();
    }
    
    // Numbers (0-9) - both main keyboard and numpad
    if (/^[0-9]$/.test(e.key)) {
        calculator.appendNumber(e.key);
    }
    
    // Decimal point
    if (e.key === '.' || e.key === 'Decimal') {
        calculator.appendNumber('.');
    }
    
    // Operators
    if (e.key === '+') {
        calculator.chooseOperation('+');
    }
    if (e.key === '-') {
        calculator.chooseOperation('-');
    }
    if (e.key === '*' || e.key === 'Multiply') {
        calculator.chooseOperation('×');
    }
    if (e.key === '/' || e.key === 'Divide') {
        calculator.chooseOperation('÷');
    }
    
    // Percentage
    if (e.key === '%') {
        calculator.percentage();
    }
    
    // Equals/Enter
    if (e.key === 'Enter' || e.key === '=' || e.key === 'Equals') {
        calculator.calculate();
    }
    
    // Delete/Backspace
    if (e.key === 'Backspace' || e.key === 'Delete') {
        calculator.delete();
    }
    
    // Clear/Escape
    if (e.key === 'Escape' || e.key === 'Esc') {
        calculator.clear();
    }
});