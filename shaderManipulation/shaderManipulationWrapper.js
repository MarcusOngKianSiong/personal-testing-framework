const {
    insertTextIntoSpecificFileSection,
    findAllUsingSpecificCriteria,
    replaceEntireFileContent, 
    retrieveFileContent,
    retrieveSpecificSection,
    appendToFile,
} = require('../Module_fileManipulation/editProgram.js');
module.exports = {spaceSeparatedStringToCommaSeparatedString}

const path = require('path'); 


// structure
const shaders = {
    standard: {
        vertex: `
            attribute vec2 a_position;
            void main(){
                // Scaler
                    
                    float scaledX = a_position.x/scalerX;
                    float scaledY = a_position.y/scalerY;
                // 
                gl_Position = vec4(scaledX,scaledY,0.0,1.0);
            }
        `,
        fragment: `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor = u_color;
            }
        `,
        variables: {
            attribute: ['a_position'],
            uniform: ['u_color'],
        }
    },
    grid: {
        vertex: `
            attribute vec2 a_position;
            varying vec2 current_fragment_position;
            void main(){
                // Scaler
                    
                    float scaledX = a_position.x/scalerX;
                    float scaledY = a_position.y/scalerY;
                // 
                gl_Position = vec4(scaledX,scaledY,0.0,1.0);
                current_fragment_position = vec2(a_position.x,a_position.y);
            }
        `,
        fragment: `
            precision mediump float;
            uniform vec4 default_color;
            uniform vec4 grid_color;
            uniform float number_of_rows;
            uniform float number_of_columns;
            uniform float shape_width;
            uniform float shape_height;
            varying vec2 current_fragment_position;  // Shows current fragment
            void main() {
                float blockWidth = shape_width/number_of_columns;
                float blockHeight = shape_height/number_of_rows; 
                float width_remainder = mod(current_fragment_position.x, blockWidth);
                float height_remainder = mod(current_fragment_position.y,blockHeight);
                if (width_remainder == 0.0) {
                    // This block is executed if either width_remainder or height_remainder is equal to 0.0
                    // Your code here
                    gl_FragColor = grid_color;
                }else if(height_remainder == 0.0){
                    gl_FragColor = grid_color;
                }else{
                    gl_FragColor = default_color;
                }
            }
        `,
        variables: {
            attribute: ["a_position"],
            uniform: ["default_color","grid_color","number_of_rows","number_of_columns","shape_width","shape_height"],
        }
    },
    border: {
        vertex: `
            attribute vec2 a_position;
            varying vec2 current_position;
            void main(){
                // Scaler
                    
                    float scaledX = a_position.x/scalerX;
                    float scaledY = a_position.y/scalerY;
                //
                current_position = vec2(a_position.x,a_position.y); 
                gl_Position = vec4(scaledX,scaledY,0.0,1.0);
            }
        `,
        fragment: `
            // How do I get this to work? -> I want the shader to check if the current fragment position is on the border
            precision mediump float;
            
            // What to check
            varying vec2 current_position;
            
            // To determine what coordinate (current_position) is at the edge
            uniform float xLeft;        //  0.0
            uniform float xRight;       // 0.3
            uniform float yTop;         // 0.0
            uniform float yBottom;      // 0.3

            uniform vec2 width; 
            uniform float border_size;

            uniform vec4 border_color;

            void main() {
                float left_limit_space = xLeft + width;
                float right_limit_space = xRight - width;
                float top_limit_space = yTop - width;
                float bottom_limit_space = yBottom + width;
                if(left_limit_space >= current_position.x){
                    gl_FragColor = border_color;
                }else if(right_limit_space <= current_position.x){
                    gl_FragColor = border_color;
                }else if(top_limit_space <= current_position.y){
                    gl_FragColor = border_color;
                }else if(bottom_limit_space >= current_position.y){
                    gl_FragColor = border_color;
                }
            }
        `,
        variables: {
            attribute: ["a_position"], 
            uniform: ["u_color", ]
        }
    }
}

/* 

    Design of content I am working with:
        - each key value in the shader represents a specific functionality of webgl
            e.g. create a grid, create a border, produce a 2d shape

    Design strategy:
        - Extract, break apart, edit components, fit together, return. 
    
    What will I do with each section?
        - variables: add or remove variable -> I will add or remove variable in the shader source code
        - add new functionality: create sections, piece them together, slot in the new key value pair in the original file. 

    What I need:
        1. How to extract the entire shader section?
        2. how do I determine what is a vertex shader source code or variable or section?
        3. How do I determine the section?

    Improvements:
        *I thought of having a single file or source folder with files that contains the source code and variables. 
            - Both modification (shader manipulation) and execution (displaying the shape) of the variables and source code 
              will be performed on that file. 
                OVERVIEW OF STRUCTURE: shaderManipulationWrapper.js -> Data source file -> customWebGL.js
                - I think it will be easier to execute that way. 
                    If I were to go this route:
                        1. customWebGL.js: Change the shader object explicitly written to one that retrieves data from the source file and construct the object from the data. 
                            - Think about how to structure the data within the file (source) -> Labelling, organizing, etc
                                - customWebGL.js: Think about how to convert the extracted data into the object
                        2. shaderManipulationWrapper.js: redirect the file target, 

            Notes:
                - Concerns:
                    1. Retrieving data from file will be tedious and creates lag when creating animations.
                        - Retrieving data from file is done in the set up, which means the retrieving will only
                          happen once. Any animation operations will use the data that has been established in setup. 
                    2. ***WHAT ABOUT TESTING****
                        ???????
*/              



class shaderManagement{
    
    constructor(){
        // INTERFACE LOCATION
        this.editFunctionalityInterfaceLocation = null;
        this.newFunctionalityInterfaceLocation = null;
        // DATA STORAGE LOCATION
        this.variablesStorageLocation = null;
        this.operationsStorageLocation = null;
        this.functionalityStorageLocation = null;
        // File content section indicator (Interface)
        this.rawFileContent = null;
        this.interfaceSectionSplit = null;
        // expected splitting format
        const sectionContent = null; 
        // const sectionIndication = {
        //     variables: {
        //         beginning: `// variable -> start`,
        //         ending: `// variable -> end`
        //     },
        //     vertex: {
        //         beginning: 'vertex: `',
        //         ending: '`,'
        //     },
        //     fragment: {
        //         beginning: 'fragment: `',
        //         ending: '`,'
        //     },
        // }
    }
    
    // Setters
    setInterfaceLocation(purpose,fileLocation){
        
        if(purpose === "edit"){
            this.editFunctionalityInterfaceLocation = fileLocation;
            return true;
        }
        if(purpose === "new"){
            this.newFunctionalityInterfaceLocation = fileLocation;
            return true;
        }
        throw new Error("interface type does not exist")
    }
    /**
     * @abstract Takes in an object that contains the name of the sections and the string that represents the section. 
     * @param {object} {sectionName: 'string representing section in the file location'}
     * @return {*} 
     * @memberof shaderManagement
     */
    setInterfaceSplit(obj){
        if(typeof obj !== "object"){
            throw new Error("input is not of type object");
        }
        if(this.isObjectEmpty(obj)){
            throw new Error("No interface split criteria specified in the object");
        }
        for(const key in obj){
            if(typeof obj[key] !== "string"){
                throw new Error(`interface split value under key called ${key} is not a string`);
            }
        }
        this.interfaceSectionSplit = obj;
        return true;
    }
    
    /**
     *
     * @abstract Takes string contents and split it apart into sections based on content section split criteria specified.
     * @param {string} content
     * @return {*} true
     * @changes {this.sectionContent} Now filled with criteria keys where each key holds array of string representing the lines in the section.
     * @memberof shaderManagement
     * 
     */
    splitContentIntoComponentsAndSetSectionContent(){

        // Step 1: Error checking
        this.checkContentSectionSplitAvailability();
        if(!this.checkRawFileContent()){
            throw new Error("Nothing to process. Raw file content variable is empty.")
        }
        const content = this.rawFileContent;
        // Step 2: Setup the array
        const splittedContent = content.split("\n");
        const length = splittedContent.length;
        
        // Step 3: Go through the array to identify the index of each criteria. 
        // Expected format: {sectionStringName: [1,5]} -> Contains index of lines that have the sectionString contained within
        const indexesOfCriteria = {}
        for (let i = 0;i<length;i++){
            const currentLine = splittedContent[i];
            // Does any of the stated criteria found in the current line?
            for(const sectionName in this.interfaceSectionSplit){
                const sectionString = this.interfaceSectionSplit[sectionName];
                // Check if the current line contains the currently iterated sectionString within.
                if(currentLine.includes(sectionString)){
                    // If the current sectionString does not exist in the object (indexesOfCriteria), specify it in the object and add array to it.
                    if(!indexesOfCriteria[sectionName]){
                        indexesOfCriteria[sectionName] = [];
                    }
                    indexesOfCriteria[sectionName].push(i);
                }
            }
        }
        
        // Step 4: Check if there is any error in the sectionString indexes
        /*
            Examples of errors:
                1. None found in the file
                2. Overlapping
                    - How do you even check if numbers are overlapping?
                        1. Which side is lower?
                        2. 
                    - Note:
                        There can be existence of encapsulation, but not overlapping. 
                3. A single sectionString have more than two found within the file
                4. A single sectionString have less than two found within the file
                5. Specified sections are not found within the file
        */
        /*1. */if(this.isObjectEmpty(indexesOfCriteria)){
            throw new Error("No specified section string found in the file");
        }
        /*5. */for(const sectionStringName in this.interfaceSectionSplit){
            const doesSectionExist = indexesOfCriteria[sectionStringName];
            if(!doesSectionExist){
                throw new Error(`$section string (${sectionStringName}) is not found in the file`);
            }
        }
        /*3, 4 */for(const sectionStringName in indexesOfCriteria){
            const currentSectionStringIndex = indexesOfCriteria[sectionStringName];
            const length = currentSectionStringIndex.length;
            if(length > 2){
                throw new Error("There are more than 2 section string specified in the file");
            }
            if(length < 2){
                throw new Error("There are less than 2 section string specified in the file");
            }
        }
        
        /* 
            Assumptions:
                - Order of numbers in array: Should be in ascending order -> I move down the array of string to find the indexes. 
                - Number of sections: 2
                - There can be an existence of encapsulation, but not overlapping
            Steps: 
                1. Go through each sectionStringName array [1,2]
                2. For each sectionStringName, go through each sectionStringName again.
                    - Skip the one that have the same name as the current (1) sectionStringName
                3. For each sectionStringName (2), check if the current sectionStringName (1) is overlapping
                    3.1. CONDITION 1: if (1)'s index 0 value is more than (2)'s index 0 value and less than (2)'s index 1 value
                    3.2. CONDITION 2: if (1)'s index 1 value is more than (2)'s index 1 value,
                    3.3. STATE OF CONDITION: If (3.1.) and (3.2.) is true, then there is an over lap
                        3.3.1 Throw an error if that is the case.
        */
        /*2. */ for(const CurrentCheckingSectionStringName in indexesOfCriteria){
            
            const check = indexesOfCriteria[CurrentCheckingSectionStringName];
            for(const checkAgainstSectionStringName in indexesOfCriteria){
                if(checkAgainstSectionStringName !== CurrentCheckingSectionStringName){
                    const against = indexesOfCriteria[checkAgainstSectionStringName];
                    let condition1 = false;
                    let condition2 = false;
                    /* CONDITION 1: */ if(check[0] > against[0] && check[0] < against[1]){
                        condition1 = true;
                    }
                    /* CONDITION 2: */ if(check[1] > against[1]){
                        condition2 = true;
                    }
                    /* STATE OF CONDITION: */ if(condition1 === true && condition2 === true){
                        throw new Error(`${CurrentCheckingSectionStringName} section is overlapping ${checkAgainstSectionStringName} section`);
                    }
                }
            }
        }
        // Split content (splittedContent) into sections based on the indexes found (indexesOfCriteria) and store it in sectionContent
        this.sectionContent = {}
        for(const sectionName in indexesOfCriteria){
            const sectionIndexes = indexesOfCriteria[sectionName];
            this.sectionContent[sectionName] = null;
            const sectionFromContent = splittedContent.slice(sectionIndexes[0]+1,sectionIndexes[1]);
            this.sectionContent[sectionName] = sectionFromContent;
        }
        return true;
    }
    convertVariablesToCommaSeparated(variables){
        /* 
            
            assumption:
                - Data received: attribute vec2 something; // some comment
        */
       let commaSeparatedVariables = '';
        const length = variables.length;
        for(let i = 0;i<length;i++){
            const current = variables[i];
            const splittedContent = current.split(';');
            const splitBySpace = splittedContent[0].split(" ");
            commaSeparatedVariables += splitBySpace.join(',') + '\n';
        }
        
        return commaSeparatedVariables.slice(0,commaSeparatedVariables.length-1);
    }
    setStorageLocation(variables,operations, functionality){
        if(typeof variables !== "string" || typeof operations !== "string" || typeof functionality !== "string" ){
            throw new Error("parameter is not a string");
        }
        if(!variables){
            throw new Error("variable location parameter is empty")
        }
        if(!operations){
            throw new Error("operations location parameter is empty")
        }
        if(!functionality){
            throw new Error("functionality location parameter is empty")
        }
        if(!this.doesRoutePointToAFile(variables) || !this.doesRoutePointToAFile(operations) || !this.doesRoutePointToAFile(functionality)){
            throw new Error("paramter is not a route.");
        }
        this.variablesStorageLocation = variables;
        this.operationsStorageLocation = operations;
        this.functionalityStorageLocation = functionality;
    }

    /* --- CHECKERS --- */
        // CHECK operations
            isObjectEmpty(obj) {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return false; // Object has at least one property, not empty
                    }
                }
                return true; // Object has no properties, it's empty
            }
                // Check if the content has the split formatting
            checkInterfaceContentFormatting(content){
                if(typeof content !== "string"){
                    throw new Error("content parameter is not a string");
                }
                // Does it explicity state the sections by shaders? -> /* --vertex shader-- */, /* --fragment shader-- */ 
                for(const key in this.interfaceSectionSplit){
                    if(!content.includes(this.interfaceSectionSplit[key])){
                        throw new Error(`'${this.interfaceSectionSplit[key]}' section formatting line not found in content`)
                    }
                }
                return true
            }
            checkContentSectionSplitAvailability(){
                if(this.interfaceSectionSplit === null || this.isObjectEmpty(this.interfaceSectionSplit)){
                    throw new Error("interface section split criteria is not properly set")
                }
                return true;
            }
            checkInterfaceLocationAvailability(theInterface){
                if(typeof theInterface !== "string"){
                    throw new Error(`parameter is not a string`);
                }
                if(theInterface === "edit"){
                    if(this.editFunctionalityInterfaceLocation !== null){
                        return true
                    }else{
                        return false
                    }
                }else if(theInterface === "new"){
                    if(this.newFunctionalityInterfaceLocation !== null){
                        return true
                    }else{
                        return false
                    }
                }else{
                    throw new Error(`${theInterface} interface does not exist`)
                }
            }
            checkRawFileContent(){
                if(this.rawFileContent === null){
                    return false
                }else{
                    return true
                }
            }
            isStringAFileName(fileName){
                
                    const regex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/;
                    return regex.test(fileName);
                    
                /*
                    Possible outcomes: 
                        1. There are no "/"
                        2. The end string after the last "/" is empty
                        3. The end string after the last "/" is just a word with no "."
                        4. The end string after the last "/" has ".", but it is at the beginning of the string
                        5. The end string after the last "/" has ".", bu
                */
            }
            doesRoutePointToAFile(route){
                if(typeof route !== "string"){
                    throw new Error("route parameter is not a string")
                }
                const splittedRoute = route.split('/');
                const outcome = this.isStringAFileName(splittedRoute[splittedRoute.length-1]);
                if(outcome){
                    return true
                }else{
                    return false;
                }
            }
            isStorageLocationsAvailable(){
                if(this.variablesStorageLocation === null || this.operationsStorageLocation === null || this.functionalityStorageLocation === null){
                    return false
                }
                return true
            }

        // CHECK file content
            async doesFunctionalityExist(functionality){
                if(this.functionalityStorageLocation === null){
                    throw new Error("Functionality storage file location does not exist")
                }
                if(typeof functionality !== "string"){
                    throw new Error("Functionality parameter is not a string")
                }
                const outcome = await retrieveFileContent(this.functionalityStorageLocation);
                const convertToArray = outcome.split('\n');
                const length = convertToArray.length;
                if(length === 0){
                    return false
                }
                for(let i = 0;i<length;i++){
                    if(convertToArray[i] === functionality){
                        return true
                    }
                }
                return false;
            }
            async isFunctionalityEmpty(functionality){
                /* 
                    Look at both the variable storage file and the operations storage file to see if there is any content tied to functionality

                */
                if(!this.isStorageLocationsAvailable()){
                    throw new Error("Cannot find storage location")
                }
                const variables = await this.findVariables(functionality);
                const func = await retrieveFileContent(this.functionalityStorageLocation);
                const operations = await retrieveFileContent(this.operationsStorageLocation);
                

            }

    // Getters
    getSectionContent(){
        return this.sectionContent
    }
    getInterfaceLocation(type){
        if(type === 'edit'){
            return this.editFunctionalityInterfaceLocation;
        }
        if(type === 'new'){
            return this.newFunctionalityInterfaceLocation;
        }
        throw new Error(`type ${type} does not exist.`)
    }
    getInterfaceSplitStrings(){
        return this.interfaceSectionSplit;
    }
    getRawFileContent(){
        return this.rawFileContent;
    }
    /**
     * @param {*} functionality
     * @param {boolean} [shader=false]
     * @param {boolean} [name=false]
     * @returns {obj} {}
     * @memberof shaderManagement
     */
    async findVariables(functionality, shader="both", name=""){

        if(!functionality){
            throw new Error("Functionality parameter is empty")
        }

        /* 
            How do I want to find the variables?
                You can choose the conditions you want to use. (Max 3);

                Each condition specified will form the very regex itself.
                Each condition not specified will use a wildcard regex (Except for the first);
        */

        // Step 1: Identify the regex pattern for two parameters
        const shaderRegex = shader === "" ? "\\w+" : shader;
        const nameRegex = name === "" ? "\\w+" : name;

        // Step 1: Construct the regex based on parameters
        const constructingRegexForASingleRow = new RegExp(`^${functionality},${shaderRegex},[a-z0-9]+,[a-z0-9]+,${nameRegex}$`);
        
        // Step 2: Extract variable file content
        const variables = await retrieveFileContent(this.variablesStorageLocation);

        // Step 3: Convert the contents into an array based on next lines
        const convertToArray = variables.split('\n');

        // Step 4: Find the lines that match the regex
        const length = convertToArray.length;
        const foundVariables = [];
        for(let i = 0;i<length;i++){
            const currentVariable = convertToArray[i];
            if(constructingRegexForASingleRow.exec(currentVariable)){
                foundVariables.push(currentVariable);
            }
        }
        
        if(foundVariables.length === 0){
            return false;
        }

        return foundVariables;

    }
    /**
     * @abstract Return the code relating to shader main functions based on functionality
     * 
     * @param {string} functionality
     * @param {string} shader -> Possible input: "Both", "vertex", "fragment"
     * @returns {object} {vertex: "", fragment: ""}
     * @memberof shaderManagement
     */
    async findOperations(functionality,shader="Both"){
        
        if(typeof functionality !== "string"){
            throw new Error("functionality parameter is not a string")
        }

        const sectionToLookFor = []

        if(shader === "Both"){
            sectionToLookFor.push(`--- ${functionality} -> vertex ---`);
            sectionToLookFor.push(`--- ${functionality} -> fragment ---`);
        }else if(shader === "vertex"){
            sectionToLookFor.push(`--- ${functionality} -> vertex ---`);
        }else if(shader === "fragment"){
            sectionToLookFor.push(`--- ${functionality} -> fragment ---`);
        }else{
            throw new Error("shader type does not exist")
        }

        for(let i = 0;i<sectionToLookFor.length;i++){
            const specificSections = await retrieveSpecificSection(this.operationsStorageLocation,sectionToLookFor[i],sectionToLookFor[i]);    
            
        }
        

    }
    // Basic functionality
    /**
     *  @note
     *      Assumptions: 
     *          - For each criteria, there should only be two that exist within the file
     * @param {*} content
     * @memberof shaderManagement
     */

    // File data extractor
    /**
     *
     * @abstract Go to file, use the split criteria to generate an array of lines that represent the content
     * @memberof shaderManagement
     */
    async extractFileContentFromInterface(theInterface){
        let fileContent = null
        if(theInterface === "edit"){
            if(this.checkInterfaceLocationAvailability("edit") === false){
                throw new Error("edit interface location not found")
            }
            fileContent = await retrieveFileContent(this.editFunctionalityInterfaceLocation);  
        }else if(theInterface === "new"){
            if(this.checkInterfaceLocationAvailability("new") === false){
                throw new Error("new interface location not found")
            }
            fileContent = await retrieveFileContent(this.newFunctionalityInterfaceLocation);
        }else{
            throw new Error(`${theInterface} interface does not exist.`);
        }
        this.rawFileContent = fileContent;
        return true
    }
    
    // Custom segmentor
    /**
     * @abstract Take the array of shader variable declaration and turn it into a comma separated string and post it up to the respective files in data_storage
     * @format 
     * @memberof shaderManagement
     *  @Note
     */
    async addShaderVariablesToDataStorage(){
        
        /*
            Note: If you execute this, you should have the core components in this format

                const expected = {
                    title: ['random'],
                    vertexShaderVariables: ['attribute vec2 a_position;',],
                    vertexShaderOperations: ['void main(){','}',],
                    fragmentShaderVariables: ['precision mediump float;',],
                    fragmentShaderOperations: ['void main() {','}',]
                }
                
                Expected outcome:
                    random,vertex,attribute,vec2,a_position
                    random,vertex,varying,vec2,current_fragment_position
                    random,fragment,precision,mediump,float
                    random,fragment,uniform,vec4,default_color
                    random,fragment,uniform,vec4,grid_color
                    random,fragment,uniform,float,number_of_rows
                    random,fragment,uniform,float,number_of_columns
                    random,fragment,uniform,float,shape_width
                    random,fragment,uniform,float,shape_height
                    random,fragment,varying,vec2,current_fragment_position

        */
        if(this.sectionContent === null){
            throw new Error("sectionContent is empty. Therefore, no variable to store");
        }

        // step 1: Extract all the variable key value pair
        const vertexShaderVariables = this.sectionContent["vertexShaderVariables"];
        const fragmentShaderVariables = this.sectionContent["fragmentShaderVariables"];
        const title = this.sectionContent["title"][0];
        
        // step 2: Turn each item into the comma separated string version
        const vertex = spaceSeparatedStringToCommaSeparatedString([title,"vertex"],3,vertexShaderVariables);
        const fragment = spaceSeparatedStringToCommaSeparatedString([title,"fragment"],3,fragmentShaderVariables);
        const final = "\n"+vertex+'\n'+fragment;
        await appendToFile(this.variablesStorageLocation,final,false)
        
        return true
    }
    splitOneVariable(variableString){
        
    }
    retrieveShader(fileName){
        const beginning = `/* shader programs - start */`;
        const ending = `/* shader programs - end */`;
    }
}


async function addNewFunctionality(name){
    const template = `${name}: {
        vertex: \`\`,
        fragment: \`\`,
        variables: {}
    },`
    const areaStart = '/* EDIT -> shader source code -> start */'
    const areaEnd = '/* EDIT -> shader source code -> end */' 
    const fileName = path.join(__dirname,"sampleShader.js"); 
    await insertTextIntoSpecificFileSection(areaStart,areaEnd,template,fileName); 
}

function spaceSeparatedStringToCommaSeparatedString(arrayValuesToAppend,NumberOfItemsToKeepFromStart,arr){
    
    const length = arr.length;
    const lengthOfItemsToAppend = arrayValuesToAppend.length;
    const data = []
    for(let i = 0;i<length;i++){
        const removeSemiColon = arr[i].replace(";"," ");
        const splitBySpace = removeSemiColon.split(" ");
        const isolateTheValues = splitBySpace.slice(0,NumberOfItemsToKeepFromStart);
        const combined = arrayValuesToAppend.concat(isolateTheValues);
        const joinedByComma = combined.join(",");
        data.push(joinedByComma)
    }
    const joinedArray = data.join("\n");
    
    return joinedArray;
    // I must convert it to string format
}

// addNewFunctionality("Hello")
global.shaderProcessing = new shaderManagement()


