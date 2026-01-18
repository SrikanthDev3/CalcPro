import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../core/services/calculator.service';

@Component({
    selector: 'app-calculator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
    private calcService = inject(CalculatorService);

    // Expose signals to template
    displayValue = this.calcService.display;

    // Button Configuration for clean template iteration
    buttons = [
        { label: 'C', type: 'function', action: 'clear', class: 'btn-func' },
        { label: '%', type: 'function', action: 'percent', class: 'btn-func' },
        { label: '🎤', type: 'voice', action: 'voice', class: 'btn-func disabled', disabled: true }, // Placeholder
        { label: '÷', type: 'operator', action: 'divide', class: 'btn-op' },

        { label: '7', type: 'number', action: '7', class: 'btn-num' },
        { label: '8', type: 'number', action: '8', class: 'btn-num' },
        { label: '9', type: 'number', action: '9', class: 'btn-num' },
        { label: '×', type: 'operator', action: 'multiply', class: 'btn-op' },

        { label: '4', type: 'number', action: '4', class: 'btn-num' },
        { label: '5', type: 'number', action: '5', class: 'btn-num' },
        { label: '6', type: 'number', action: '6', class: 'btn-num' },
        { label: '−', type: 'operator', action: 'subtract', class: 'btn-op' },

        { label: '1', type: 'number', action: '1', class: 'btn-num' },
        { label: '2', type: 'number', action: '2', class: 'btn-num' },
        { label: '3', type: 'number', action: '3', class: 'btn-num' },
        { label: '+', type: 'operator', action: 'add', class: 'btn-op' },

        { label: '0', type: 'number', action: '0', class: 'btn-num span-2' },
        { label: '.', type: 'number', action: '.', class: 'btn-num' },
        { label: '=', type: 'function', action: 'equals', class: 'btn-equal' },
    ];

    onButtonClick(btn: any) {
        if (btn.disabled) return;

        if (btn.type === 'number') {
            this.calcService.appendInput(btn.label);
        } else if (btn.type === 'operator') {
            this.calcService.setOperator(btn.label);
        } else if (btn.label === 'C') {
            this.calcService.reset();
        } else if (btn.label === '%') {
            this.calcService.calculatePercentage();
        } else if (btn.label === '=') {
            this.calcService.calculate();
        }
    }

    // Keyboard Support
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const key = event.key;

        // Numbers
        if (/^[0-9.]$/.test(key)) {
            this.calcService.appendInput(key);
        }
        // Operators
        else if (['/', '*', '-', '+'].includes(key)) {
            const map: { [key: string]: string } = { '/': '÷', '*': '×', '-': '−', '+': '+' };
            this.calcService.setOperator(map[key] || key);
        }
        // Enter / Equals
        else if (key === 'Enter' || key === '=') {
            this.calcService.calculate();
        }
        // Backspace / Escape
        else if (key === 'Backspace') {
            this.calcService.deleteLast(); // Exposed via method if we added it? 
            // I verified deleteLast exists in service, but I didn't verify I exported it properly
            // Actually I didn't expose strictly a `deleteLast` public method in Component wrapper? 
            // No, I can call service directly.
            this.calcService.deleteLast();
        }
        else if (key === 'Escape') {
            this.calcService.reset();
        }
    }
}
