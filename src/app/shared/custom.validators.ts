import { ValidationErrors } from '@angular/forms';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { isString } from 'util';
import { PhoneNumber, PhoneNumberUtil } from 'google-libphonenumber';


function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}
const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const passwordNumberRegex = new RegExp("^(?=.*[0-9])");
const passwordSpecialRegex = new RegExp("^(?=.*[!@#\$%\^&\*])");
const passwordUppercaseRegex = new RegExp("^(?=.*[A-Z])");
const passwordLowercaseRegex = new RegExp("^(?=.*[a-z])");

export class CustomValidators {

    static matchFieldsValidator(controlName: string, matchingControlName: string): ValidatorFn {

        return (control: AbstractControl): { [key: string]: any } | null => {
            const field = control.get(controlName).value;
            const matchingField = control.get(matchingControlName).value;

            if (!field || !matchingField) {
                return null;
            }

            if (field !== matchingField) {
                control.get(controlName).setErrors({ matchFields: true });
            } else {
                control.get(controlName).setErrors({ matchFields: null });
                control.get(controlName).updateValueAndValidity({ emitEvent: false, onlySelf: true });
                return null;
            }
        };

    }

    static discountValidator(price: string, discount: string, discountType: string): ValidatorFn {
        return (fg: FormGroup) => {
            if (fg.get(discountType).value === 'MONETARY') {
                if (Number(fg.get(discount).value) >= Number(fg.get(price).value)) {
                    return { invalidDiscount: true };
                }
            } else {
                return null;
            }
        };
    }

    static checkForOnlySpaces(fieldName: string, allowEmptyValue = false): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (allowEmptyValue && control.get(fieldName).value === '') {
                return null;
            }
            if (!allowEmptyValue && !control.get(fieldName).value) {
                return null;
            }
            const isWhitespace = (control.get(fieldName).value || '').trim().length === 0;
            if (isWhitespace) {
                control.get(fieldName).setErrors({ whitespace: true });
            } else {
                return null;
            }
        };
    }

    static luhnValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            const isValid = CustomValidators.luhnCheck(control.value);
            return isValid ? null : { luhnCheck: true };
        };
    }

    static luhnCheck = (cardNumber: string): boolean => {
        if (!cardNumber.length) {
            return;
        }

        // Remove all whitespaces from card number.
        cardNumber = cardNumber.replace(/\s/g, '');

        // 1. Remove last digit;
        const lastDigit = Number(cardNumber[cardNumber.length - 1]);

        // 2. Reverse card number
        const reverseCardNumber = cardNumber.slice(0, cardNumber.length - 1).split('').reverse().map(x => Number(x));
        let sum = 0;

        // 3. + 4. Multiply by 2 every digit on odd position. Subtract 9 if digit > 9
        for (let i = 0; i <= reverseCardNumber.length - 1; i += 2) {
            reverseCardNumber[i] = reverseCardNumber[i] * 2;
            if (reverseCardNumber[i] > 9) {
                reverseCardNumber[i] = reverseCardNumber[i] - 9;
            }
        }

        // 5. Make the sum of obtained values from step 4.
        sum = reverseCardNumber.reduce((acc, currValue) => (acc + currValue), 0);

        // 6. Calculate modulo 10 of the sum from step 5. and the last digit. If it's 0, you have a valid card number :)
        return ((sum + lastDigit) % 10 === 0);
    }
    
    static required(control: AbstractControl): ValidationErrors | null {
        return isEmptyInputValue(control.value) || (isString(control.value) && control.value.trim() === '') ?
            { required: true } :
            null;
    }

    static email(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }
        return EMAIL_REGEXP.test(control.value) ? null : { email: true };
    }

    static password(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null;  // don't validate empty values to allow optional controls
        }

        let result:{[key: string]: any} = {};

        if (!passwordNumberRegex.test(control.value.trim())) {
            result.passwordNumber = true;
        }

        if (!passwordSpecialRegex.test(control.value.trim())) {
            result.passwordSpecial = true;
        }

        if (!passwordUppercaseRegex.test(control.value.trim())) {
            result.passwordUppercase = true;
        }

        if (!passwordLowercaseRegex.test(control.value.trim())) {
            result.passwordLowercase = true;
        }
        
        return Object.keys(result).length === 0 ? null : result;
    }
    
    static pattern(pattern: string | RegExp): ValidatorFn {
        if (!pattern) { return null; }
        let regex: RegExp;
        let regexStr: string;
        if (typeof pattern === 'string') {
            regexStr = '';

            if (pattern.charAt(0) !== '^') { regexStr += '^'; }

            regexStr += pattern;

            if (pattern.charAt(pattern.length - 1) !== '$') { regexStr += '$'; }

            regex = new RegExp(regexStr);
        } else {
            regexStr = pattern.toString();
            regex = pattern;
        }
        return (control: AbstractControl): ValidationErrors | null => {

            if (isEmptyInputValue(control.value)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const value: string = control.value.trim();
            return regex.test(value) ? null :
                { pattern: { requiredPattern: regexStr, actualValue: value } };
        };
    }

    static phone(control: AbstractControl): ValidationErrors | null {
        const error = { phone: true };
        const isRequired = control.errors && control.errors.required;
        let phoneNumber: PhoneNumber;
    
        try {
          phoneNumber = PhoneNumberUtil.getInstance().parse(
            control.value.number,
            control.value.isoCode
          );
        } catch (e) {
          if (!isRequired) {
            return error;
          }
        }
    
        if (control.value) {
          if (!phoneNumber) {
            return error;
          } else {
            if (
              !PhoneNumberUtil.getInstance().isValidNumberForRegion(
                phoneNumber,
                control.value.isoCode
              )
            ) {
              return error;
            }
          }
        }
        return;
      }
}
