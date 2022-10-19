// CALCULATOR CLASS

class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
    this.historyStorage = "";
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = "";
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  deleteCurr() {
    this.currentOperand = "";
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "x":
        computation = prev * current;
        break;
      case "÷":
        computation = prev / current;
        break;
      case "%":
        computation = (prev * 100) / current;
        break;
      case "+/-":
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = "";
    this.previousOperand = "";

    if (this.previousOperand === "") {
      this.operation = "";
    }
  }

  anotherComputation(operation) {
    switch (operation) {
      case "√":
        this.previousOperand = this.currentOperand;
        this.currentOperand = Math.sqrt(this.currentOperand);
        break;
      case "x²":
        this.previousOperand = this.currentOperand;
        this.currentOperand = this.currentOperand * this.currentOperand;
        break;
      case "¹/x":
        this.previousOperand = this.currentOperand;
        this.currentOperand = 1 / this.currentOperand;
        break;
      default:
        return;
    }
    this.operation = operation;
  }

  numbersUpdate() {
    this.currentOperandElement.innerText = this.numbersShown(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandElement.innerText = `${this.numbersShown(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandElement.innerText = "";
    }
  }

  numbersShown(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }
}

// HISTORY FUNCTION

function calculationHistory(p1, p2) {
  const history = document.querySelector(".history");

  let calcHistory = [];

  let oneComputation = document.createElement("div");
  let firstP = document.createElement("p");
  let secondP = document.createElement("p");
  oneComputation.classList.add("oneComputation");
  firstP.innerHTML = p1;
  secondP.innerHTML = `= ${eval(p2)}`;
  oneComputation.appendChild(firstP);
  oneComputation.appendChild(secondP);
  history.appendChild(oneComputation);

  const compData = {
    first: p1,
    second: p2,
  };
  let formData = `
  <div class="oneComputation"> ${compData.first} ${compData.second} </div>
  `;

  if (localStorage.getItem("oneComputation")) {
    calcHistory = JSON.parse(localStorage.getItem("oneComputation"));
  }
  calcHistory.push(compData);
  localStorage.setItem("oneComputation", JSON.stringify(calcHistory));
}

// CALCULATOR VIEW

function CalcView() {
  const historyData = document.querySelector(".history-data");
  const history = document.querySelector(".history");
  const clearHistory = document.querySelector("#clearHistory");
  const showHistory = document.querySelector("#showHistory");
  const historyStorage = JSON.parse(localStorage.getItem(".oneComputation"));
  let previousOperandElement = document.querySelector(".data-previous");
  let currentOperandElement = document.querySelector(".data-current");
  let deleteButton = document.querySelector(".data-delete");
  let allClearButton = document.querySelector(".data-all-clear");
  let deleteCurrentButton = document.querySelector(".data-delete-current");
  let numberButtons = document.querySelectorAll(".data-number");
  let operationButtons = document.querySelectorAll(".data-operation");
  let anotherOperationButtons = document.querySelectorAll(
    ".data-operation-another"
  );
  let equalsButton = document.querySelector(".data-equals");

  const calculator = new Calculator(
    previousOperandElement,
    currentOperandElement
  );

  let calcEvents = [];

  function updateDisplay() {
    calculator.numbersUpdate();
  }

  function makeHistory() {
    let historyShow = "";
    const prev = parseFloat(calculator.previousOperand);
    const current = parseFloat(calculator.currentOperand);
    if (calculator.operation === "+") {
      historyShow = `${prev} + ${current}`;
      calculationHistory(historyShow, historyShow);
    } else if (calculator.operation === "-") {
      historyShow = `${prev} - ${current}`;
      calculationHistory(historyShow, historyShow);
    } else if (calculator.operation === "x") {
      historyShow = `${prev} * ${current}`;
      calculationHistory(historyShow, historyShow);
    } else if (calculator.operation === "÷") {
      historyShow = `${prev} / ${current}`;
      calculationHistory(historyShow, historyShow);
    } else if (calculator.operation === "%") {
      historyShow = `${prev} * 100 + ${current}`;
      calculationHistory(historyShow, historyShow);
    }

    if (calculator.operation === "√") {
      calculationHistory(
        `√ ( ${calculator.previousOperand} )`,
        Math.sqrt(calculator.previousOperand)
      );
    } else if (calculator.operation === "x²") {
      calculationHistory(
        `sqr( ${calculator.previousOperand} )`,
        calculator.previousOperand * calculator.previousOperand
      );
    } else if (calculator.operation === "¹/x") {
      calculationHistory(
        `¹/( ${calculator.previousOperand} )`,
        1 / calculator.previousOperand
      );
    }
  }

  calcEvents.events = function event() {
    numberButtons.forEach((button) => {
      button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        updateDisplay();
      });
    });

    operationButtons.forEach((button) => {
      button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        updateDisplay();
      });
    });

    equalsButton.addEventListener("click", (button) => {
      calculator.compute();
      updateDisplay();
      makeHistory();
    });

    allClearButton.addEventListener("click", (button) => {
      calculator.clear();
      updateDisplay();
    });

    deleteButton.addEventListener("click", (button) => {
      calculator.delete();
      updateDisplay();
    });

    deleteCurrentButton.addEventListener("click", (button) => {
      calculator.deleteCurr();
      updateDisplay();
    });

    anotherOperationButtons.forEach((button) => {
      button.addEventListener("click", function () {
        calculator.anotherComputation(this.innerText);
        updateDisplay();
        makeHistory();
      });
    });

    clearHistory.addEventListener("click", function () {
      history.innerHTML = "";
    });

    showHistory.onclick = function () {
      if (historyData.style.display !== "none") {
        historyData.style.display = "none";
      } else {
        historyData.style.display = "block";
      }
    };
  };

  return calcEvents;
}

var emi = new CalcView();
emi.events();
