const { toNamespacedPath } = require('path');
const {
    isRegExpString,
    countLeadingSpacesInLine,
    convertNewLineSymbolBasedOnOS
} = require('../Module_fileManipulation/editProgram.js')
const os = require('os')

describe("Functional correctness: Supporting functions in editProgram",()=>{
    it("Check if new line is being converted properly",()=>{
        if(os.platform().toLowerCase() === "win32"){
            const testData = 'something\n';
            const outcome = convertNewLineSymbolBasedOnOS(testData);
            expect(outcome).toBe('something\r');
        }
        if(os.platform().toLowerCase() === "darwin"){
            const testData = 'something\r';
            const outcome = convertNewLineSymbolBasedOnOS(testData);
            expect(outcome).toBe('something\n');
        }
    })
    
})