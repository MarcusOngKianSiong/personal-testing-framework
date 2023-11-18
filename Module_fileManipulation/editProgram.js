const fs = require('fs').promises; // Import the 'fs' module
const path = require('path');
const filePath = 'testing.js'; // Replace with the path to your file

module.exports = {
    insertTextIntoSpecificFileSection,
    findAllUsingSpecificCriteria,
    replaceEntireFileContent, 
    retrieveFileContent,
    retrieveSpecificSection,
    appendToFile
}

/*
    Program requirement:
        - Add new purpose
            - add -> vertex: `
                    // add variables
                    void main(){
                        // add operations

                    }
            `
            - add -> fragment: `
                    // add variables
                    void main() {
                        // add operations
                    }
            `
            - Add -> variables: {}
    
            Program design:
*/

// insertTextIntoSpecificFileSection("const shader = {","}","something here",'./sample2.js').then(res=>{
//     console.log(res.send)
// })

/* ---CORE FUNCTIONS--- */
async function replaceEntireFileContent(data,fileName){
    
        if(typeof data !== "string"){
            throw new Error("data parameter is not a string");
        }
        if(typeof fileName !== "string"){
            throw new Error("fileName parameter is not a string");   
        }
        if(!fileName.includes('.')){
            throw new Error("fileName parameter does not have a file extension");
        }
        
        // try{
        //     // Check if the file exist or not
        //     /*Error 4*/await fs.access(fileName, fs.constants.F_OK);
        // }catch(err){
        //     throw new Error("file does not exist: ",err.message);
        // }

        // Inject data into file
        const outcome = await fs.writeFile(fileName,data,'utf8');

        if(outcome === undefined){
            return true; 
        }
}
async function insertTextIntoSpecificFileSection(beginningTarget,endingTarget,input,fileName){
    /*

        assumptions: 
            1. Order of beginning target and ending target: Beginning target will come first, then ending target
            2. Text to input
                - Have the indentation based on its own parents
                - Have indentation based on where the input is inputted from 
                    - (e.g. input from within a function, so parent function indentation is embedded within)
        
        Potential problems:
            - There are already inputs between the beginning target and the ending target (e.g. the section is for variables, but there are variables within it already)
                Solution: Look at the (ending index - 1) as the start. 

        If I want to add something to a file, what do I need to know?
            1. Which line do I want to add something into
                1. How do I determine which line? 
                    1. find the line with the exact text
            2. How many indentation do I want to add
                1. How to find the encapsulation parent?
            3. How to insert between the beginning and ending?
                - Insert into array, turn array into string
            
    */
    
    try{
        /*Errors*/
            if (typeof beginningTarget !== 'string') {
                throw new Error(1);
            }
            if (typeof endingTarget !== 'string') {
                throw new Error(2);
            }
            if(!fileName.includes('.')){
                throw new Error(3)
            }
            if (typeof input !== 'string') {
                throw new Error(4);
            }
            
            const data = await fs.readFile(fileName, 'utf8')
            // Convert the text to an array split by next line
            const arr = data.split("\n")
            const length = arr.length
            
            // Setup the necessary variables
            const encapsulationParent = {
                lineIndex: 0,
                numberOfSpaces: 0
            }
            const areaOfInput = {
                beginningIndex: -1,
                endingIndex: -1
            }

            // FIND AREA OF INPUT
            for(let i = 0;i<length;i++){                    /* (1) */ 
                // Remove any leading white space
                const line = arr[i];
                const lineWithoutLeadingWhiteSpace = line.replace(/^\s+/g, '');
                // Compare the current text with target text
                if(lineWithoutLeadingWhiteSpace === beginningTarget){
                    areaOfInput.beginningIndex = i;
                }
                if(lineWithoutLeadingWhiteSpace === endingTarget){
                    areaOfInput.endingIndex = i;
                    break;
                }
            }

            // CHECK IF THERE IS THE AREA OR NOT
            if(areaOfInput.beginningIndex === -1){
                throw new Error("5")
            }
            if(areaOfInput.endingIndex === -1){
                throw new Error("6");
            }

            // FIND INDENTATION INFORMATION
            const controlNumberOfSpaces = countLeadingSpacesInLine(arr[areaOfInput.beginningIndex]);
            for(let i = areaOfInput.beginningIndex-1;i > 0;i--){
                const checkCurrentLineNumberOfSpaces = countLeadingSpacesInLine(arr[i]);
                const difference = controlNumberOfSpaces - checkCurrentLineNumberOfSpaces;
                if(difference >= 3){
                    encapsulationParent.lineIndex = i;
                    encapsulationParent.numberOfSpaces = checkCurrentLineNumberOfSpaces;
                    break;
                }
            }
            
            // Convert input text into one having the correct indentation (based on target parent encapsulation)
            const textToBeInputted = input.split('\n');
            const inputLength = textToBeInputted.length;
            
            const numberOfIndentationToAdd = encapsulationParent.numberOfSpaces + 4;
            for(let i = 0;i<inputLength;i++){
                const currentInputLine = textToBeInputted[i];
                const inputLineWithNewWhiteSpace = ' '.repeat(numberOfIndentationToAdd) + currentInputLine;
                textToBeInputted[i] = inputLineWithNewWhiteSpace;
            }

            // Add it into the original array. 
            const startInsertingAt = areaOfInput.endingIndex;
            Array.prototype.splice.apply(arr, [startInsertingAt, 0].concat(textToBeInputted));
            const newLength = arr.length;
            
            // Check everything. 
            const newVersionCombined = arr.join("\n");
            const outcome = await fs.writeFile(fileName,newVersionCombined,'utf8');
            
            if(outcome === undefined){
                return true
            }
            
    }catch(err){
        if(err.code === "ENONET"){
            // file not found 
            /*Error 7*/ throw new Error("--Error--\nFile name: editProgram.js\nLocation: replaceFileContent\nStatus: File not found\n--- ");
        }else{
            switch(err.message){
                case "1":
                    throw new Error("--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: Beginning target is not a string\n--- ")
                case "2":
                    throw new Error("--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: Ending target is not a string\n--- ")
                case "3":
                    throw new Error(`--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: FIle name does not have a file extension -> ${fileName}\n--- `)
                case "4":
                    throw new Error("--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: text to be inputted is not a string\n--- ")
                case "5":
                    throw new Error("--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: Beginning target not found in file\n--- ")
                case "6":
                    throw new Error("--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: Ending target not found in file\n--- ")
                default:
                    throw new Error(`--Error--\nFile name: editProgram.js\nLocation: insertTextIntoSpecificFileSection\nStatus: UNKNOWN ERROR: ${err.message}\n--- `)
            }
        }
    }
    
}
/**
 * @abstract Goes through each line in the file, finds the lines that match the regex stated, returns an array that contains those match.
 *
 * @param {string} criteria                     Takes in a regex
 * @param {func} [formatting=null]              Takes in a function to format each line match found in the file
 * @param {string} fileName                     The file to analyse
 * @return {promise}                            then: An array of lines in the file that match the regex, catch: an error message
 * @throws {error}                              
 *      - "1": Criteria must be a string or a regular expression.
 *      - "2": FileName must be a string with an extension.
 *      - "3": File name does not have an extension.
 *      - "5": Criteria is not a valid regular expression.
 *      - "7": Match not found.
 *      - "8": Formatting function output is empty.
 *      - Default: An unknown error occurred. 
 */
async function findAllUsingSpecificCriteria(criteria,fileName,formatting=null){ 
    try{
        /*Errors*/
            if (typeof criteria !== 'string') {
                throw new Error(1);
            }
            if (typeof fileName !== 'string') {
                throw new Error(2);
            }
            if(!fileName.includes('.')){
                throw new Error(3)
            }
            if (!isRegExpString(criteria)) {
                throw new Error(5);
            }

        /*Errors*/
        let output = null;
        const regexObject = new RegExp(criteria)
        const data = await fs.readFile(fileName,'utf8');
            
            // Data setup
            const arr = data.split('\n');
            const length = arr.length;

            // Find lines that match regex
            const collectedMatch = [];
            for(let i = 0;i < length;i++){
                const currentLine = arr[i]
                const status = regexObject.test(currentLine);
                if(status){
                    collectedMatch.push(currentLine); 
                }
            }
            
            // ERROR CHECKING: Check if there is even any match or not
            if(collectedMatch.length === 0){
                throw new Error(7);
            }

            const formattedLineMatches = []
            // If there is a formatting function
            if(formatting!==null){
                const theLength = collectedMatch.length;
                // ERROR CHECKING: Check if the function actually produces anything
                const testOutputForEmptiness = formatting(collectedMatch[0])
                if(testOutputForEmptiness === undefined || testOutputForEmptiness === null){
                    throw new Error(8)
                }
                // Run formatting function against each regex line match
                for(let i = 0;i < theLength;i++){
                    formattedLineMatches.push(formatting(collectedMatch[i]));
                }
                return formattedLineMatches;
            // If there is no formatting function
            }else{
                return collectedMatch;
            }
    }catch(err){
        switch(err.message){
            case "1":
                throw new Error('--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: Criteria must be a string.\n--- ')
            case "2":
                throw new Error('--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: FileName must be a string.\n--- ');
            case "3":
                throw new Error('--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: file name does not have an extension.\n--- ')
            case "5":
                throw new Error('--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: Criteria is not a valid regular expression.\n--- ')
            case "7": 
                throw new Error('--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: Match not found.\n--- ')
            case "8":
                throw new Error('--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: formatting function output is empty\n--- ');
            default:
                throw new Error(`--Error--\nFile name: editProgram.js\nLocation: findAllUsingSpecificCriteria\nStatus: UNKNOWN ERROR: -> ${err.message}\n`)
        }
    }
    
}

async function retrieveSpecificSection(fileName, beginningTarget,endingTarget){

    if(typeof beginningTarget !== "string"){
        throw new Error("beginning target parameter is not a string");
    }
    if(typeof endingTarget !== "string"){
        throw new Error("ending target parameter is not a string");
    }
    if(typeof fileName !== "string"){
        throw new Error("fileName parameter is not a string");   
    }
    if(!fileName.includes('.')){
        throw new Error("fileName parameter does not have a file extension");
    }

    const fileContent = await fs.readFile(fileName,'utf8');
    
    const convertToArray = fileContent.split('\n');
    const length = convertToArray.length;
    let beginningIndex = null;
    let endingIndex = null;


    // Find the index of begining and end
    for(let i = 0;i < length;i++){
        const currentLine = convertToArray[i];
        if(currentLine === beginningTarget){
            beginningIndex = i;
        }
        if(currentLine === endingTarget){
            endingIndex = i;
            break;
        }
    }
    

    // error checking
    if(beginningIndex === null || endingIndex === null){
        throw new Error("Beginning target and ending target parameters are not properly set or does not exist.");
    }
    if(beginningIndex >= endingIndex){
        throw new Error("Beginning target parameter comes after ending target parameter in the file");
    }
    if((endingIndex - beginningIndex) === 1){
        throw new Error("There is nothing between the target parameters");
    }

    // Extract the section from the array of lines (from original file)
    const sectionContent = convertToArray.slice(beginningIndex + 1,endingIndex);
    

    // Re-combine the section array into a string and return it. 
    return sectionContent.join('\n');

}

async function appendToFile(fileName, content,nextLine=false){
    if(typeof fileName !== "string"){
        throw new Error("file name is not a string");
    }
    if(typeof content !== "string"){
        throw new Error("content parameter is not a string");
    }
    if(typeof nextLine !== "boolean"){
        throw new Error("next line parameter is not a boolean");
    }
    if(nextLine === true){
        content = '\n' + content;
    }
    const outcome = await fs.appendFile(fileName,content,'utf8');
    return outcome;
}

async function retrieveFileContent(fileName){
    
        if(typeof fileName !== "string"){
            throw new Error("file name is not a string");
        }
        if(!fileName.includes('.')){
            throw new Error("No files specified");
        }
        // Check if file exists
        await fs.access(fileName, fs.constants.F_OK);
        const outcome = await fs.readFile(fileName,'utf8');
        return outcome;
    
    
}
/* ---CORE FUNCTIONS--- */



/* ---SUPPORT FUNCTIONS--- */
// Check if the contents of a string represents a regex
function isRegExpString(str) {
    try {
        new RegExp(str);
        return true; // It's a valid regular expression string
    } catch (error) {
        return false; // It's not a valid regular expression string
    }
}
// Count how may spaces in a single 
function countLeadingSpacesInLine(line) {
    const leadingSpacesPattern = /^ +/; // Regular expression for leading spaces
    const matches = line.match(leadingSpacesPattern);
    return matches ? matches[0].length : 0;

}
/* ---SUPPORT FUNCTIONS--- */



const name = "something"
const data = `
            ${name}: {
                vertex: '
                    /* ${name} -> vertex -> add variables -> start */

                    /* ${name} -> vertex -> add variables -> end */
                    void main(){
                        /* ${name} -> vertex -> add operations -> start */

                        /* ${name} -> vertex -> add operations -> end */
                    }
                ',
                fragment: '
                    /* ${name} -> fragment -> add variables -> start */

                    /* ${name} -> fragment -> add variables -> end */
                    void main(){
                        /* ${name} -> fragment -> add operations -> start */

                        /* ${name} -> fragment -> add operations -> end */
                    }
                ',
                variables: {
                    /* ${name} -> variables -> add variables -> start */

                    /* ${name} -> variables -> add variables -> end */
                }
            }
        `
// read('const shader = {','}',data)


function addTemplate(name){
    /*
        Problems: 
            1. It delete the previous data -> DONE
            2. It does not indent
                - Check how many tab indentation the previous line has
                    - How to add tab space?                 -> \t
                    - How to check how many tab space?      -> countLeadingSpacesInLine
                - Steps
                    - Find encapsulation head
                    - Check how many leading spaces are there
                    - For each item you want to add into the encapsulation section, 
                        - add the number of spaces the encapsulation head has + 4.
                    - Upload to the section. 

    */
    // Lets assume that I will just inject the data into a specific line in the file. 
    const data = `
            ${name}: {
                vertex: '
                    /* ${name} -> vertex -> add variables -> start */

                    /* ${name} -> vertex -> add variables -> end */
                    void main(){
                        /* ${name} -> vertex -> add operations -> start */

                        /* ${name} -> vertex -> add operations -> end */
                    }
                ',
                fragment: '
                    /* ${name} -> fragment -> add variables -> start */

                    /* ${name} -> fragment -> add variables -> end */
                    void main(){
                        /* ${name} -> fragment -> add operations -> start */

                        /* ${name} -> fragment -> add operations -> end */
                    }
                ',
                variables: {
                    /* ${name} -> variables -> add variables -> start */

                    /* ${name} -> variables -> add variables -> end */
                }
            }
        `
        const filePath = 'testing.js'
        // Use the 'fs' module to write data to the file
        fs.appendFile(filePath, data, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to the file:', err);
                return;
            }
            
            console.log('Data has been appended to the file.');
        });


}
