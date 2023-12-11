import { applyStringTemplate } from '@/util/Strings';

describe('applyStringTemplate', () => {
    it('should replace placeholders with values', () => {
        const template = 'Hello, ${name}! You are ${age} years old.';
        const variables = {
            name: 'John',
            age: '25'
        };
        const expected = 'Hello, John! You are 25 years old.';
        const result = applyStringTemplate(template, variables);
        expect(result).toEqual(expected);
    });

    it('should replace empty values with (NULL)', () => {
        const template = '${name} is ${gender}.';
        const variables = {
            name: 'Alice',
            gender: ''
        };
        const expected = 'Alice is (NULL).';
        const result = applyStringTemplate(template, variables);
        expect(result).toEqual(expected);
    });
});
