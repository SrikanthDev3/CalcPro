import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalcState {
  display: string;
  previousValue: number | null;
  currentValue: string;
  operator: string | null;
  isError: boolean;
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class Calculator {
  // State management
  private state = signal<CalcState>({
    display: '0',
    previousValue: null,
    currentValue: '',
    operator: null,
    isError: false
  });

  // Public accessors
  display = signal('0');
  isError = signal(false);

  // Button layout configuration - 4 columns grid
  buttons = [
    { label: 'C', type: 'clear', action: () => this.clear() },
    { label: '±', type: 'operator', action: () => this.toggleSign() },
    { label: '%', type: 'operator', action: () => this.handlePercentage() },
    { label: '÷', type: 'operator', action: () => this.handleOperator('/') },
    
    { label: '7', type: 'number', action: () => this.handleNumber('7') },
    { label: '8', type: 'number', action: () => this.handleNumber('8') },
    { label: '9', type: 'number', action: () => this.handleNumber('9') },
    { label: '×', type: 'operator', action: () => this.handleOperator('*') },
    
    { label: '4', type: 'number', action: () => this.handleNumber('4') },
    { label: '5', type: 'number', action: () => this.handleNumber('5') },
    { label: '6', type: 'number', action: () => this.handleNumber('6') },
    { label: '−', type: 'operator', action: () => this.handleOperator('-') },
    
    { label: '1', type: 'number', action: () => this.handleNumber('1') },
    { label: '2', type: 'number', action: () => this.handleNumber('2') },
    { label: '3', type: 'number', action: () => this.handleNumber('3') },
    { label: '+', type: 'operator', action: () => this.handleOperator('+') },
    
    { label: '0', type: 'number', action: () => this.handleNumber('0'), colspan: 2 },
    { label: '.', type: 'decimal', action: () => this.handleDecimal() },
    { label: '=', type: 'equals', action: () => this.calculate() }
  ];

  // Future placeholder button
  voiceButton = { label: '🎤', type: 'voice', disabled: true };

  /**
   * Handle number button click
   */
  handleNumber(num: string): void {
    const currentState = this.state();

    if (currentState.isError) {
      this.resetError();
    }

    let newValue = currentState.currentValue + num;

    // Prevent leading zeros (except for decimals)
    if (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
      newValue = newValue.substring(1);
    }

    // Limit to reasonable length
    if (newValue.length > 12) return;

    this.state.update(s => ({ ...s, currentValue: newValue }));
    this.display.set(newValue || '0');
  }

  /**
   * Handle decimal point
   */
  handleDecimal(): void {
    const currentState = this.state();

    if (currentState.isError) {
      this.resetError();
    }

    let newValue = currentState.currentValue;

    // If no current value, start with 0
    if (!newValue) {
      newValue = '0.';
    } else if (!newValue.includes('.')) {
      // Only add decimal if not already present
      newValue += '.';
    }

    this.state.update(s => ({ ...s, currentValue: newValue }));
    this.display.set(newValue);
  }

  /**
   * Handle operator button click
   */
  handleOperator(op: string): void {
    const currentState = this.state();

    if (currentState.isError) {
      this.resetError();
    }

    const currentNum = parseFloat(currentState.currentValue) || 0;

    // If there's a pending operation, calculate it first
    if (currentState.operator && currentState.currentValue) {
      try {
        const result = this.performCalculation(
          currentState.previousValue!,
          currentNum,
          currentState.operator
        );
        
        this.state.update(s => ({
          ...s,
          previousValue: result,
          currentValue: '',
          operator: op,
          display: this.formatDisplay(result)
        }));
        this.display.set(this.formatDisplay(result));
      } catch {
        this.handleError();
      }
    } else {
      this.state.update(s => ({
        ...s,
        previousValue: currentNum,
        currentValue: '',
        operator: op
      }));
    }
  }

  /**
   * Handle percentage calculation
   */
  handlePercentage(): void {
    const currentState = this.state();

    if (currentState.isError) {
      this.resetError();
    }

    // Percentage of the previous value
    if (currentState.previousValue !== null && currentState.currentValue) {
      const current = parseFloat(currentState.currentValue);
      const percentage = (currentState.previousValue * current) / 100;
      this.state.update(s => ({
        ...s,
        currentValue: this.formatDisplay(percentage),
        display: this.formatDisplay(percentage)
      }));
      this.display.set(this.formatDisplay(percentage));
    }
  }

  /**
   * Toggle sign (positive/negative)
   */
  toggleSign(): void {
    const currentState = this.state();

    if (currentState.isError) {
      this.resetError();
    }

    if (currentState.currentValue) {
      const value = parseFloat(currentState.currentValue);
      const newValue = (-value).toString();
      this.state.update(s => ({ ...s, currentValue: newValue }));
      this.display.set(newValue);
    }
  }

  /**
   * Perform calculation
   */
  private performCalculation(prev: number, current: number, operator: string): number {
    switch (operator) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        if (current === 0) {
          throw new Error('Division by zero');
        }
        return prev / current;
      default:
        return current;
    }
  }

  /**
   * Calculate final result
   */
  calculate(): void {
    const currentState = this.state();

    if (!currentState.operator || !currentState.currentValue) {
      return;
    }

    try {
      const result = this.performCalculation(
        currentState.previousValue!,
        parseFloat(currentState.currentValue),
        currentState.operator
      );

      this.state.update(s => ({
        ...s,
        display: this.formatDisplay(result),
        previousValue: null,
        currentValue: this.formatDisplay(result),
        operator: null,
        isError: false
      }));
      this.display.set(this.formatDisplay(result));
    } catch {
      this.handleError();
    }
  }

  /**
   * Clear calculator
   */
  clear(): void {
    this.state.set({
      display: '0',
      previousValue: null,
      currentValue: '',
      operator: null,
      isError: false
    });
    this.display.set('0');
    this.isError.set(false);
  }

  /**
   * Format display value
   */
  private formatDisplay(value: number): string {
    // Handle very large or very small numbers
    if (Math.abs(value) > 1e10) {
      return value.toExponential(6);
    }

    // Round to avoid floating point errors
    const rounded = Math.round(value * 1e10) / 1e10;

    // Convert to string and limit decimal places
    const str = rounded.toString();
    const parts = str.split('.');

    if (parts.length === 2 && parts[1].length > 8) {
      return rounded.toFixed(8);
    }

    return str;
  }

  /**
   * Handle error state
   */
  private handleError(): void {
    this.state.update(s => ({
      ...s,
      display: 'Error',
      isError: true,
      currentValue: '',
      previousValue: null,
      operator: null
    }));
    this.display.set('Error');
    this.isError.set(true);
  }

  /**
   * Reset error state
   */
  private resetError(): void {
    this.state.update(s => ({ ...s, isError: false }));
    this.isError.set(false);
  }
}
