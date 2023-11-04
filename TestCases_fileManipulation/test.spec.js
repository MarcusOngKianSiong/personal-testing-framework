const {insertTextIntoSpecificFileSection,findAllUsingSpecificCriteria,replaceEntireFileContent, retrieveFileContent} = require('../Module_fileManipulation/editProgram.js')
const path = require('path');
group("fileEditingProgram",()=>{

    spec("replace entire file content",async ()=>{
        
        // function name: replaceEntireFileContent
        
        // const fileName = '../TestCases_fileManipulation/sampleFiles/replaceEntireContent.js'
        // const fileName = '../TestCases_fileManipulation/sampleFiles/replaceEntireContent.js'
        const fileName = path.join(__dirname,"sampleFiles","replaceEntireContent.js")
        const data = 'something here'
        await replaceEntireFileContent(data,fileName);
        const outcome = await retrieveFileContent(fileName);
        expect(outcome).toBe("soemthign");
    })
    spec("input text into specific section of a file",()=>{
        // function name: insertTextIntoSpecificFileSection
        expect(1).toBe(1);
    })

})