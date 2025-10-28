import { Component, Input, forwardRef } from '@angular/core';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Component({
  selector: 'app-primary-forms-input',
  standalone: true, // Since this doesn't use any Angular-specific features
  imports: [ ReactiveFormsModule ],
  templateUrl: './primary-forms-input.html',
  styleUrl: './primary-forms-input.css',
  providers: [
    {
      // Register this component as a ControlValueAccessor
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormsInput), // Forward reference to the component itself
      multi: true // Allows multiple value accessors to coexist
    }
  ]
})
export class FormsInput {
  @Input() showIconSlot: boolean = false;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() extraClass: string = '';

  // Value bound to the form control
  value: string = '';
  // Whether the input is disabled
  disabled: boolean = false;

  // Callback triggered when the value changes (provided by Angular forms)
  private onChange: (value: string) => void = () => {};
  // Callback triggered when the input is touched (blur event)
  private onTouched: () => void = () => {};

  /**
   * Handles input value changes from the user.
   * Updates the internal value and notifies the form control.
   */
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value); // Notify Angular forms of the new value
  }

  /**
   * Triggered when the input loses focus.
   * Marks the form control as "touched".
   */
  onBlur(): void {
    this.onTouched();
  }

  /**
   * Writes a value from the form model into the view (input).
   * Called when form control value changes externally.
   */
  writeValue(value: string): void {
    this.value = value || '';
  }

  /**
   * Registers a callback function that should be called when the value changes.
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the input is blurred.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Updates the disabled state of the input.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
