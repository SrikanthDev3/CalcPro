import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  // State Signals
  private _display = signal<string>('0');
  private _expression = signal<string>('');
  private _history = signal<string[]>([]);
  private _isResult = signal<boolean>(false); // Flag if current display is a result

  // Public Read-only Signals
  display = this._display.asReadonly();
  history = this._history.asReadonly();
  
  // Constants
  private readonly MAX_DIGITS = 12;
  private readonly ERROR_MSG = 'Error';

  constructor() { }

  /**
   * Appends a number or decimal point to the current input
   */
  appendInput(value: string): void {
    if (this._display() === this.ERROR_MSG) {
      this.reset();
    }

    if (this._isResult()) {
      // If we just showed a result, start fresh with new input
      this._display.set(value === '.' ? '0.' : value);
      this._expression.set(value === '.' ? '0.' : value);
      this._isResult.set(false);
      return;
    }

    const current = this._display();

    // Prevent multiple decimals
    if (value === '.' && current.includes('.')) {
      return;
    }

    // Handle initial zero or overwrite
    if (current === '0' && value !== '.') {
      this._display.set(value);
      this._expression.set(value);
    } else {
      if (current.length < this.MAX_DIGITS) {
        this._display.set(current + value);
        this._expression.set(this._expression() + value);
      }
    }
  }

  /**
   * Sets an operator
   */
  setOperator(op: string): void {
    if (this._display() === this.ERROR_MSG) return;

    // Mapping visual operators to JS math operators
    const opMap: { [key: string]: string } = {
      '×': '*',
      '÷': '/',
      '+': '+',
      '−': '-',
      '%': '/100' // Handle percent immediately or as part of expression? 
                  // Standard calc behavior varies. 
                  // Simple approach: Treat % as unary divider or operator. 
                  // Let's treat it as operator for this logic or immediate action.
    };

    const jsOp = opMap[op] || op;

    // If last char is operator, replace it?
    // Or if currently entering a number, append operator to expression.
    
    // Simplification for standard calculator flow:
    // User types: 5 + 5 = 
    // Logic: Store 5, op +, wait for next.
    
    // But for "Expression based" scalability:
    // User sees: "5", types "+". We can show "5" still, or clear?
    // Usually Calculator clears display for next number but visually indicates operator.
    
    // Let's go with: "Expression accumulation" but "Display shows current building number or result".
    
    // If we are in "Result" state, continue with that result
    if (this._isResult()) {
      this._isResult.set(false);
    }

    // If expression ends with an operator, replace it
    const expr = this._expression();
    const lastChar = expr.slice(-1);
    const isLastOp = ['+', '-', '*', '/'].includes(lastChar);
    
    if (isLastOp) {
      if(op === '%') {
         // % usually acts on the number immediately
         return; 
      }
      // Replace last op
      this._expression.set(expr.slice(0, -1) + jsOp);
    } else {
       // Append op
       if (op === '%') {
         this.calculatePercentage();
       } else {
         this._expression.set(expr + jsOp);
         // Prepare display for next number?
         // Usually web calcs show the operator or just clear. 
         // Let's reset display visual to '0' or keep logic consistent with simple calc.
         // Actually, to display "5 + ", we need a separate "Equation" display or logic.
         // Requirement: "Input display... Read-only...".
         // Let's behave like iOS calculator: 
         // 1. Type 5. 2. Type +. (Display shows 5, active op). 3. Type 6 (Display shows 6).
         
         // Simplified Logic for this iteration:
         this._display.set('0'); // Ready for next number
         // NOTE: A real robust calculator is a state machine. 
         // For this task, we'll lean on the expression string but reset display for new operands.
       }
    }
  }

  calculatePercentage(): void {
    // Immediate execution for %: Value / 100
    try {
        const current = parseFloat(this._display());
        const val = current / 100;
        this._display.set(val.toString());
        // Update expression to match?
        // This gets tricky mixing expression string and immediate ops.
        // Let's reset expression to this new value
        this._expression.set(val.toString());
        this._isResult.set(true); 
    } catch (e) {
        this.setError();
    }
  }

  calculate(): void {
    if (this._display() === this.ERROR_MSG) return;
    
    // The expression might have accumulators.
    // Issue: If we used `setOperator` to clear display, `_expression` needs to be meticulously maintained.
    // Let's refine the approach: 
    // Use `_expression` purely for the math string. 
    // When `setOperator` is called, we append the *current display value* (if it wasn't already in expression?)
    
    // REFACTOR for Robustness:
    // It's safer to build the expression from the Display + Actions.
    // But actually, just evaluating the `_expression` string is powerful if we sync it right.
    
    // Let's try to just evaluate what we have.
    // If the user typed "5", "+", "5". 
    // appendInput(5) -> expr "5"
    // setOperator(+) -> expr "5+" (Display resets to 0)
    // appendInput(5) -> expr "5+5"
    // calculate() -> eval("5+5") -> 10.
    
    try {
      // Clean expression: remove trailing operators
      let expr = this._expression();
      if (['+', '-', '*', '/'].includes(expr.slice(-1))) {
        // If user hits = after +, usually it repeats op or ignores. Let's ignore.
        expr = expr.slice(0, -1);
      }

      // Safe Eval
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const result = new Function('return ' + expr)();
      
      const limitedResult = this.formatResult(result);
      
      this._display.set(limitedResult);
      this._expression.set(limitedResult); // Chain calculations
      this._history.update(h => [...h, `${expr} = ${limitedResult}`].slice(-5)); // Keep last 5
      this._isResult.set(true);
      
    } catch (e) {
      this.setError();
    }
  }

  reset(): void {
    this._display.set('0');
    this._expression.set('');
    this._isResult.set(false);
  }

  deleteLast(): void {
    if (this._isResult() || this._display() === this.ERROR_MSG) {
      this.reset();
      return;
    }
    
    const current = this._display();
    if (current.length > 1) {
       const newVal = current.slice(0, -1);
       this._display.set(newVal);
       // Sync expression: Assume last added chars match display?
       // This checks out if we carefully manage state. 
       // For safety in this demo, strict sync is hard without full state machine.
       // We'll perform a naive slice on expression too if it ends with current count.
       this._expression.update(e => e.slice(0, -1));
    } else {
      this._display.set('0');
      // If we remove the last char, check expression
      this._expression.update(e => e.slice(0, -1));
    }
  }

  private setError(): void {
    this._display.set(this.ERROR_MSG);
    this._expression.set('');
    this._isResult.set(true);
  }

  private formatResult(num: number): string {
    if (!isFinite(num) || isNaN(num)) return this.ERROR_MSG;
    
    // Handle floating point precision errors approx
    const precision = 10000000000;
    const rounded = Math.round(num * precision) / precision;
    
    let str = rounded.toString();
    if (str.length > this.MAX_DIGITS) {
      return num.toExponential(6); // Scientific notation for large numbers
    }
    return str;
  }
}
