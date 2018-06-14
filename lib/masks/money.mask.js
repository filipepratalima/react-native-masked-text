import BaseMask from './_base.mask'

const MONEY_MASK_SETTINGS = {
    precision: 2,
    separator: ',',
    delimiter: '.',
    unit: 'R$',
    suffixUnit: '',
    zeroCents: false
}

export default class MoneyMask extends BaseMask {
    static getType() {
        return 'money'
    }

    getValue(value, settings, oldValue) {
        const mergedSettings = super.mergeSettings(MONEY_MASK_SETTINGS, settings)
        const { unit, precision } = mergedSettings;

        // allow only numbers. allow also dots if precision
        let sanitized = precision > 0
            ? value.replace(/[^\d\.]/g, '')
                .replace(/\./, 'x')
                .replace(/\./g, '')
                .replace(/x/, '.')
            : value.replace(/[^\d]/g, '');

        // allow only first dot plus the number of precision decimals
        sanitized = sanitized.indexOf('.') >= 1 
            ? sanitized.substring(0, sanitized.indexOf('.') + precision + 1)
            : sanitized;

        // format to number with commas
        const formatted = sanitized.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

        // add unit
        const masked = (value !== unit && value !== `${unit}.`)
            ? `${unit}${formatted}`
            : '';

        return masked;
    }

    getRawValue(maskedValue, settings) {
        let normalized = Number(maskedValue.replace(/[^\d\.]/g, ''));
        return normalized;
    }

    validate(value, settings) {
        return true
    }

    _sanitize(value, settings) {
        if (typeof value === 'number') {
            return value.toFixed(settings.precision)
        }
        return value
    }

    _insert(text, index, string) {
        if (index > 0) {
            return (
                text.substring(0, index) +
                string +
                text.substring(index, text.length)
            )
        } else {
            return string + text
        }
    }
}