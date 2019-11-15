const _inputs = {	48: "0",
					49: "1",
					50: "2",
					51: "3",
					52: "4",
					53: "5",
					54: "6",
					55: "7",
					56: "8",
					57: "9",
					45: "-",
					43: "+",
					47: "/",
					42: "*",
					61: "=",
					13: "=",
					46: ".",
					99: "clr",
					67: "clr",
					8: "delete",
				}



let _firstOperand;
let _operator;
let _secondOperand;
let _result;
let _state;
let _decimalEntered = false;

const AWAITING_FIRST_OPERAND = 0;
const FIRST_OPERAND_STARTED = 1;
const OPERATOR_ENTERED = 2;
const AWAITING_SECOND_OPERAND = 3;
const SECOND_OPERAND_STARTED = 4;
const DISPLAYING_RESULT = 5;

function hasDecimal(){}

function add(a,b){
	return a+b;
}

function subtract(a,b){
	return a-b;
}

function multiply(a,b){
	return a*b;
}

function divide(a,b){
	return a/b;
}

function operate(operator,a,b){
	switch (operator)
	{
		case "+":
			return add(a,b);
			break;
		case "-":
			return subtract(a,b);
			break;
		case "*":
			return multiply(a,b);
			break;
		case "/":
			return divide(a,b);
			break;
		default:
			return;
			break;
	}
}

function containsOperator(str){
	return operators.some(operator => str.includes(operator));
}

function appendToDisplay(str){
	if (getDisplay().textContent === "0" && str !== "."){
		getDisplay().textContent = str;
	} else{
		getDisplay().textContent += str;
	}
}

function deleteCharFromDisplay(){
	let len = getDisplay().textContent.length;
	if (len < 1) return;
	getDisplay().textContent = getDisplay().textContent.substring(0,len-1);
}

function getDisplay(){
	return document.querySelector("#display");
}

function clearDisplay(){
	getDisplay().textContent = "0";
}

function dividingByZero(operator,operand){
	return (operator == "/" && operand === 0);
}

function clickedNumber(e){
	numberClicked = _inputs[e.which] || _inputs[e.keyCode] || e.target.textContent;
	if(numberClicked==="."){
		if (_decimalEntered) return;
		disableDecimal(_decimalButton); //this works because clicking a "number" always adds it somewhere. It won't get lost .
	}
	switch(_state){
		case DISPLAYING_RESULT:
			clickedClear();
		case AWAITING_FIRST_OPERAND:
			_state = FIRST_OPERAND_STARTED;
		case FIRST_OPERAND_STARTED:
			appendToDisplay(numberClicked);
			enableButtons(_operatorButtons);
			enableButton(_clearButton);
			enableButton(_deleteButton);
			disableButton(_equalsButton);
			break;
		case OPERATOR_ENTERED:
		case AWAITING_SECOND_OPERAND:
			clearDisplay();
			_state = SECOND_OPERAND_STARTED;
		case SECOND_OPERAND_STARTED:
			appendToDisplay(numberClicked);
			enableButton(_equalsButton);
			enableButton(_deleteButton);
			break;
			break;
		default:
			break;
	}
}

function clickedOperator(e){
	operatorClicked = _inputs[e.which] || _inputs[e.keyCode] || e.target.textContent;
	switch(_state){
		case AWAITING_FIRST_OPERAND:
			console.log("enter an operand first!");
			break;
		case FIRST_OPERAND_STARTED:
			_firstOperand = Number.parseFloat(getDisplay().textContent);
			_operator = operatorClicked;
			clearDisplay();
			appendToDisplay(operatorClicked);
			disableButtons(_operatorButtons);
			disableButton(_equalsButton);
			disableButton(_deleteButton);
			enableDecimal(_decimalButton);
			_state = OPERATOR_ENTERED;
			break;
		case OPERATOR_ENTERED:
		case AWAITING_SECOND_OPERAND:
			console.log("operand already entered.  Enter a second operand.")
		case SECOND_OPERAND_STARTED:
			console.log("operand already entered. hit '=' to compute result");
			break;
		case DISPLAYING_RESULT:
			_firstOperand = _result;
			_operator = operatorClicked;
			clearDisplay();
			appendToDisplay(_operator);
			disableButtons(_operatorButtons);
			disableButton(_equalsButton);
			enableDecimal(_decimalButton);
			_state = OPERATOR_ENTERED;

		default:
			break;
	}
}

function clickedEquals(e){
	switch(_state){
		case AWAITING_FIRST_OPERAND:
			break;
		case FIRST_OPERAND_STARTED:
			break;
		case OPERATOR_ENTERED:
		case AWAITING_SECOND_OPERAND:
			console.log("enter a second operand first");
			break;
		case SECOND_OPERAND_STARTED:
			_secondOperand = Number.parseFloat(getDisplay().textContent);
			if (dividingByZero(_operator,_secondOperand)){
				alert("Please don't break me.  Divide by something else instead.");
				return;
			}
			_result = operate(_operator,_firstOperand,_secondOperand);
			clearDisplay();
			appendToDisplay(_result);
			disableButton(_deleteButton);
			enableButtons(_operatorButtons);
			enableDecimal(_decimalButton);
			_state = DISPLAYING_RESULT;
			break;
		case DISPLAYING_RESULT:
			//repeat the operation using the result as the first operand:
			_result = operate(_operator,_result,_secondOperand);
			clearDisplay();
			disableButton(_deleteButton);
			appendToDisplay(_result);
			break;
		default:
			break;
	}
}

function clickedDelete(e){
	switch(_state){
		case AWAITING_FIRST_OPERAND:
			break;
		case FIRST_OPERAND_STARTED:
			deleteCharFromDisplay();
			if (getDisplay().textContent.length === 0) {
				disableButton(_deleteButton);
				disableButtons(_operatorButtons);
				_state = AWAITING_FIRST_OPERAND;
				disableButton(_clearButton);
			}
			break;
		case OPERATOR_ENTERED:
			break;
		case AWAITING_SECOND_OPERAND:
			break;
		case SECOND_OPERAND_STARTED:
			deleteCharFromDisplay();
			if (getDisplay().textContent.length === 0) {
				disableButton(_deleteButton);
				disableButton(_equalsButton);
				_state = AWAITING_SECOND_OPERAND;
			}
			break;
		case DISPLAYING_RESULT:
			break;
		default:
			break;

	}
}

function disableButton(button){
	button.disabled = true;
}

function enableButton(button){
	button.disabled = false;
}

function disableDecimal(button){
	button.disabled = true;
	_decimalEntered = true;
}

function enableDecimal(button){
	button.disabled = false;
	_decimalEntered = false;
}

function disableButtons(buttonArray){
	buttonArray.forEach(button => button.disabled = true);
}

function enableButtons(buttonArray){
	buttonArray.forEach(button => button.disabled = false);
}

function clickedClear(e){
	clearDisplay();
	_firstOperand = "";
	_operator = "";
	_secondOperand = "";
	disableButtons(_operatorButtons);
	disableButton(_equalsButton);
	disableButton(_clearButton);
	disableButton(_deleteButton);
	_state = AWAITING_FIRST_OPERAND;
}


function parseKeyCode(keyCode){
	if((keyCode >=48 && keyCode <= 57) || keyCode === 46){
		return clickedNumber;
	} else if (keyCode === 42 || keyCode === 43 || keyCode === 45 || keyCode === 47){
		return clickedOperator;
	} else if (keyCode === 99 || keyCode === 67){
		return clickedClear;
	} else if (keyCode === 61 || keyCode===13){
		return clickedEquals;
	} else if(keyCode === 8){ 
		return clickedDelete;
	} else{
		return invalidKeypress;
	}
}

function invalidKeypress(e){};

function pressedKey(e){
	parseKeyCode(e.keyCode)(e)
}




document.querySelectorAll("#calculator-grid > button, #calculator-grid > div").forEach(button => {button.setAttribute("style",`grid-area: ${button.id};`)});

const _numberButtons = document.querySelectorAll("#calculator-grid button.number");
_numberButtons.forEach(button => button.addEventListener("click",clickedNumber));

const _operatorButtons = document.querySelectorAll("#calculator-grid button.operator");
_operatorButtons.forEach(button => button.addEventListener("click",clickedOperator));

const _clearButton = document.querySelector(".clear");
_clearButton.addEventListener("click",clickedClear);

const _equalsButton = document.querySelector(".execute");
_equalsButton.addEventListener("click",clickedEquals);

const _decimalButton = document.querySelector(".decimal");
_decimalButton.addEventListener("click", clickedNumber);

const _deleteButton = document.querySelector(".delete");
_deleteButton.addEventListener("click",clickedDelete);

document.addEventListener("keypress",pressedKey);

_state = AWAITING_FIRST_OPERAND;





