import { getObjectKey } from '@/util/Objects';

describe('getObjectKey', () => {
    it('should return the value of the specified key for a simple object', () => {
        const obj = {
            name: 'John',
            age: 25
        };
        const key = 'name';
        const expectedResult = 'John';
        const result = getObjectKey(obj, key);
        expect(result).toEqual(expectedResult);
    });

    it('should return the value of the specified key for a nested object', () => {
        const obj = {
            person: {
                name: 'John',
                age: 25
            }
        };
        const key = 'person.name';
        const expectedResult = 'John';
        const result = getObjectKey(obj, key);
        expect(result).toEqual(expectedResult);
    });

    it('should return undefined for a non-existing key', () => {
        const obj = {
            name: 'John',
            age: 25
        };
        const key = 'address';
        const expectedResult = undefined;
        const result = getObjectKey(obj, key);
        expect(result).toEqual(expectedResult);
    });

    it('should return undefined for an object with an undefined key', () => {
        const obj = {
            name: 'John',
            age: 25
        };
        const key = 'name.undefinedKey';
        const expectedResult = undefined;
        const result = getObjectKey(obj, key);
        expect(result).toEqual(expectedResult);
    });
});
