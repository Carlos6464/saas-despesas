import {
  Component,
  Input,
  forwardRef,
  OnInit,
  Injector,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from '@angular/core'; // 1. Importar ChangeDetectorRef
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  FormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [FormsModule, InputTextModule, MessageModule],
  templateUrl: './form-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true,
    },
  ],
})
export class FormInput implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() type:
    | 'text'
    | 'datetime-local'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'date'
    | 'password' = 'text';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  @Output() blurEvent = new EventEmitter<void>();

  value: any;
  isDisabled: boolean = false;
  ngControl: NgControl | null = null;

  onChange: any = () => {};
  onTouched: any = () => {};

  // 2. Injetar o ChangeDetectorRef no construtor
  constructor(private injector: Injector, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null);
  }

  // Chamado quando o valor do formulário muda externamente
  writeValue(value: any): void {
    this.value = value;

    // 3. A CORREÇÃO PRINCIPAL:
    // Avisa o Angular que o estado interno deste componente mudou
    // e que ele precisa ser verificado e atualizado na tela.
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    // Também é uma boa prática marcar para verificação aqui
    this.cdr.markForCheck();
  }

  onBlur() {
    this.onTouched();
    this.blurEvent.emit(); // <<< REPASSA O EVENTO PRO PAI
  }
}
