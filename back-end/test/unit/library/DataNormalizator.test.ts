import DataNormalizator from '../../../src/library/DataNormalizator';
import { InvalidDataError } from '../../../src/library/InvalidDataError';

describe('DataNormalizator', () => {
    describe('capitalizeFirstLetter', () => {
        it('should capitalize the first letter of a string', () => {
            const input = 'example';
            const expectedOutput = 'Example';
            const result = DataNormalizator.capitalizeFirstLetter(input);
            expect(result).toEqual(expectedOutput);
        });

        it("should return the same input if it's not a string", () => {
            const input = '123';
            const result = DataNormalizator.capitalizeFirstLetter(input);
            expect(result).toEqual(input);
        });
    });

    describe('emailNormalizator', () => {
        it('should normalize a valid email address', () => {
            const input = 'test.test@GMAIL.com';
            const expectedOutput = 'test.test@gmail.com';
            const result = DataNormalizator.emailNormalizator(input);
            expect(result).toEqual(expectedOutput);
        });

        it('should normalize a valid email address', () => {
            const input = 'test+test@gmail.COM';
            const expectedOutput = 'test@gmail.com';
            const result = DataNormalizator.emailNormalizator(input);
            expect(result).toEqual(expectedOutput);
        });

        it('should throw an InvalidDataError for an invalid email address', () => {
            const input = 'invalid_email';
            expect(() => {
                DataNormalizator.emailNormalizator(input);
            }).toThrow(InvalidDataError);
        });
    });
});
