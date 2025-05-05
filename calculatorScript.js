// clear button code
var clearButton = document.getElementById('clearButton')
clearButton.addEventListener('click', clear)

// global variable for input box
var display = document.getElementById('input')

// temporary query holding the equation
var query = '' 






// basic addition function
function addition(number1, number2) {
    return number1 + number2;
}

// basic subtraction function
function subtraction(number1, number2) {
    return number1 - number2;
}

// basic division function with roudning with precision
function division(number1, number2, precision = 5) {
    var dividend = number1 / number2;
    const factor = 10 ** precision;
    return Math.round(dividend * factor) / factor;
}

// basic multiplication with precision rounding
function multiply(number1, number2, precision = 5) {
    var multiple = number1 * number2;
    const factor = 10 ** precision;
    return Math.round(multiple * factor) / factor;
}

// clear function 
function clear() {
    display.value = '0'
}


// infix to postfix

function shunting_yard(token_list) {
    const precedence = {
        "+" : 1,
        "-" : 1,
        "*" : 2,
        "/" : 2,
        "^" : 3
    }

    let outputList = [];
    let operatorStack = [];

    for (const token of token_list) {
        if (!isNaN(token)) {
            outputList.push(token);
        } else if (isOperator(token)) {
            while (
                operatorStack.length > 0 &&
                isOperator(operatorStack[operatorStack.length - 1]) &&
                (
                    (
                        precedence[token] < precedence[operatorStack[operatorStack.length - 1]] ||
                        (
                            precedence[token] === precedence[operatorStack[operatorStack.length - 1]] &&
                            isLeftAssociative(token)
                        )
                    )
                    
                )  
            ) {
                outputList.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token)
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
                outputList.push(operatorStack.pop());
            }
            if (operatorStack.length === 0 || operatorStack.pop() !== "(") {
                throw new Error("Mismatch parentheses")
            }
        } else {
            throw new Error(`invalid token ${token}`)
        }
    }

    while (operatorStack.length > 0) {
        const operator = operatorStack.pop();
        if (operator === "(" || operator === ")") {
            throw new Error("mismatched parentheses");
        }
        outputList.push(operator)
    }

    return outputList;
}

// checks to see if a token is an operator

function isOperator(token) {
    return ["+", "-", "*", "/", "^"].includes(token);
}

function isLeftAssociative(operator) {
    return operator !== "^";
}


function postfixParser(array) {
    let stack = []
    for (const token of array) {
        console.log(stack)
        console.log(token)
        if (!isNaN(token) || (token[0] === '-' && !isNaN(token.slice(1)))) {
            stack.push(token);
        } else if (isOperator(token)){
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+':
                    stack.push(Number(a) + Number(b));
                    break;
                case '-':
                    stack.push(Number(a) - Number(b));
                    break;
                case '*':
                    stack.push(Number(a) * Number(b));
                    break;
                case '/':
                    stack.push(Number(a) / Number(b));
                    break;
                case '^':
                    stack.push(Math.pow(Number(a), Number(b)));
                    break;
                default:
                    throw new Error(`unknown operator ${token}`)
            }
        } else {
            throw new Error(`invalid token: ${token}`)
        }
    }
    if (stack.length !== 1) {
        throw new Error("Invalid postfix expression")
    }
    return stack[0];
}

let testEquation = ['(', '3', '+', '5', ')', '*', '2', '^', '3', '-', '4', '/', '(', '1', '+', '1', ')'];
const postfix = shunting_yard(testEquation);
console.log("Postfix Expression:", postfix);
console.log("Result:", postfixParser(postfix));