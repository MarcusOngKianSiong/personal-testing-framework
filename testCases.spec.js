const {
    retrieveSpecificSection,
    insertTextIntoSpecificFileSection,
    findAllUsingSpecificCriteria,
    replaceEntireFileContent, 
    retrieveFileContent,
    appendToFile
} = require('./Module_fileManipulation/editProgram.js')
const path = require('path')

describe("file manipulation: functional correctness",()=>{
    // You pass me a function to run all the it cases. 
    // However, how do I make sure that these it cases attaches itself to the describe?

    it("retrieve the contents of a file",async ()=>{
        const fileName = path.join(__dirname,"sampleFiles","retrieveDataFromFiles.js")
        const outcome = await retrieveFileContent(fileName);
        const expected = 'Hello there'
        expect(outcome).toBe(expected);
    })

    it("replace entire file content",async ()=>{
        // function name: replaceEntireFileContent
        // const fileName = '../TestCases_fileManipulation/sampleFiles/replaceEntireContent.js'
        // const fileName = '../TestCases_fileManipulation/sampleFiles/replaceEntireContent.js'
        const fileName = path.join(__dirname,"sampleFiles","replaceEntireContent.js")
        const data = 'something here';
        await replaceEntireFileContent(data,fileName);
        const outcome = await retrieveFileContent(fileName);
        // NOTE!!!! -> Expect to be wrong
        expect(outcome).toBe(data);
    })
    
    it("find all lines that have the string inside",async ()=>{
        const fileName = path.join(__dirname,"sampleFiles","findAllLinesWithSpecificText.js");
        const outcome = await findAllUsingSpecificCriteria('Hello',fileName);
        const expected = ["Hello","Hello","Helloooooo"];
        let status = true;
        for(let i = 0;i<expected.length;i++){
            if(expected[i] !== outcome[i]){
                status = false;
                break;
            }
        }
        expect(status).toBe(true)
    })
    
    // it("insert text into specific section of a file",async ()=>{
    //     const fileName = path.join(__dirname,"sampleFiles","insertText.js");
    //     const data = 'something here'
    //     const initial = `const shader = {\n}`
    //     const expected = `const shader = {\n    something here\n}`
    //     await insertTextIntoSpecificFileSection("const shader = {","}",data,fileName)
    //     const newState = await retrieveFileContent(fileName);
    //     await replaceEntireFileContent(initial,fileName);
    //     expect(newState).toBe(expected);
    // })
    
    it("Retrieve specific section in a file",async ()=>{
        const beginningTarget = "// Hello\n"
        const endingTarget = "// Goodbye\r"
        const expected = 'muffy\npuffy\ntuffy'
        console.log("SOMETHING: ",__dirname)
        const fileName = path.join(__dirname,"sampleFiles","retrieveSpecificSection.js");
        const outcome = await retrieveSpecificSection(fileName,beginningTarget,endingTarget);
        retrieveSpecificSection()
        expect(outcome).toBe(expected);
    })

    it("append content to file",async ()=>{
        const original = "something\nnothing\nhello\ngoodbye";
        const input = "what\nis\nthere?"
        const expected = "something\nnothing\nhello\ngoodbye\nwhat\nis\nthere?";
        const fileName = path.join(__dirname,"sampleFiles","appendContentToFile.js");
        await appendToFile(fileName,input,true);
        const outcome = await retrieveFileContent(fileName);
        await replaceEntireFileContent(original,fileName);
        expect(outcome).toBe(expected);
    })
    
})

