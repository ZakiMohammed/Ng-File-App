import { isImage } from "./file-type";

describe('file type', () => {
    it('should check image or not', () => {
        expect(isImage('foo.docx')).toBeFalsy();
        expect(isImage('foo.pdf')).toBeFalsy();
        expect(isImage('foo.txt')).toBeFalsy();
        expect(isImage('foo.xls')).toBeFalsy();

        expect(isImage('foo.jpeg')).toBeTruthy();
        expect(isImage('foo.jpg')).toBeTruthy();
        expect(isImage('foo.png')).toBeTruthy();
    })
});