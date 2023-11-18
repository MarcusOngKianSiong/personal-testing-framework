const path = require('path')


// 1. Set up interface location
require('./shaderManipulationWrapper.js')
const newFunctionalityInterfaceLocation = path.join(__dirname,"interface","new_functionality.txt");
const editFunctionalityInterfaceLocation = path.join(__dirname,"interface","edit_functionality.txt");
shaderProcessing.setInterfaceLocation("new",newFunctionalityInterfaceLocation);
shaderProcessing.setInterfaceLocation("edit",editFunctionalityInterfaceLocation);

// 2. Set up section indication specified in interface
const criteria = {
    vertexShaderVariables: '/* -------- VERTEX SHADER VARIABLES -------- */',
    fragmentShaderVariables: '/* -------- FRAGMENT SHADER VARIABLES -------- */',
    vertexShaderOperations: '/* -------- VERTEX SHADER OPERATIONS -------- */',
    fragmentShaderOperations: '/* -------- FRAGMENT SHADER OPERATIONS -------- */'
}
shaderProcessing.setInterfaceSplit(criteria)

// 3. extract and split file into sections (based on criteria)
shaderProcessing.extractFileSections("new");

// 4. 
shaderProcessing.storeShaderVariables();


/*
    1. write out the shader in the interface
    2. Split the data into sections: 
        - Functionality: vertex, fragment
        - operations: anything within main function
        - variables: Anything above the main functions.
    3. 
*/

