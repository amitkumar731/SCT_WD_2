document.addEventListener('DOMContentLoaded', function() {
            // Calculator state
            let currentOperand = '0';
            let previousOperand = '';
            let operation = undefined;
            let shouldResetScreen = false;
            let errorMessage = '';

            // DOM elements
            const currentOperandElement = document.querySelector('.current-operand');
            const previousOperandElement = document.querySelector('.previous-operand');
            const errorMessageElement = document.querySelector('.error-message');
            const calculatorGrid = document.querySelector('.calculator-grid');

            // Update display
            function updateDisplay() {
                currentOperandElement.textContent = currentOperand;
                previousOperandElement.textContent = previousOperand;
                errorMessageElement.textContent = errorMessage;
                
                // Clear error after 3 seconds
                if (errorMessage) {
                    setTimeout(() => {
                        errorMessage = '';
                        errorMessageElement.textContent = '';
                    }, 3000);
                }
            }

            // Reset calculator
            function clear() {
                currentOperand = '0';
                previousOperand = '';
                operation = undefined;
                errorMessage = '';
            }

            // Delete last character
            function deleteNumber() {
                if (currentOperand.length === 1) {
                    currentOperand = '0';
                } else {
                    currentOperand = currentOperand.slice(0, -1);
                }
            }

            // Append number
            function appendNumber(number) {
                if (shouldResetScreen) {
                    currentOperand = '';
                    shouldResetScreen = false;
                }
                
                // Prevent multiple decimal points
                if (number === '.' && currentOperand.includes('.')) return;
                
                // Replace initial 0 with number unless it's a decimal
                if (currentOperand === '0' && number !== '.') {
                    currentOperand = number;
                } else {
                    currentOperand += number;
                }
            }

            // Choose operation
            function chooseOperation(op) {
                if (currentOperand === '') return;
                
                if (previousOperand !== '') {
                    compute();
                }
                
                operation = op;
                previousOperand = `${currentOperand} ${op}`;
                shouldResetScreen = true;
            }

            // Compute calculation
            function compute() {
                let computation;
                const prev = parseFloat(previousOperand);
                const current = parseFloat(currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                try {
                    switch (operation) {
                        case '+':
                            computation = prev + current;
                            break;
                        case '-':
                            computation = prev - current;
                            break;
                        case '*':
                            computation = prev * current;
                            break;
                        case '/':
                            if (current === 0) {
                                throw new Error("Cannot divide by zero");
                            }
                            computation = prev / current;
                            break;
                        case '%':
                            computation = prev % current;
                            break;
                        default:
                            return;
                    }
                    
                    currentOperand = computation.toString();
                    operation = undefined;
                    previousOperand = '';
                    shouldResetScreen = true;
                } catch (error) {
                    errorMessage = error.message;
                    clear();
                }
            }

            // Calculate percentage
            function calculatePercentage() {
                if (currentOperand === '') return;
                currentOperand = (parseFloat(currentOperand) / 100).toString();
            }

            // Handle button clicks
            calculatorGrid.addEventListener('click', (e) => {
                const target = e.target;
                
                if (!target.matches('button')) return;
                
                if (target.dataset.number) {
                    appendNumber(target.dataset.number);
                    updateDisplay();
                } else if (target.dataset.operation) {
                    chooseOperation(target.dataset.operation);
                    updateDisplay();
                } else if (target.dataset.action === 'calculate') {
                    compute();
                    updateDisplay();
                } else if (target.dataset.action === 'clear') {
                    clear();
                    updateDisplay();
                } else if (target.dataset.action === 'delete') {
                    deleteNumber();
                    updateDisplay();
                } else if (target.dataset.action === 'percentage') {
                    calculatePercentage();
                    updateDisplay();
                }
            });

            // Handle keyboard input
            document.addEventListener('keydown', (e) => {
                if (/[0-9]/.test(e.key)) {
                    appendNumber(e.key);
                } else if (e.key === '.') {
                    appendNumber('.');
                } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                    chooseOperation(e.key);
                } else if (e.key === '%') {
                    calculatePercentage();
                } else if (e.key === 'Enter' || e.key === '=') {
                    e.preventDefault();
                    compute();
                } else if (e.key === 'Backspace') {
                    deleteNumber();
                } else if (e.key === 'Escape') {
                    clear();
                }
                
                updateDisplay();
            });

            // Initialize display
            updateDisplay();
        });