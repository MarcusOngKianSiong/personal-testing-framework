
const { EventEmitter } = require('events');
const myEmitter = new EventEmitter();

require('./testStatus.js')
require('./testStructure.js');
require('./testFileLocator.js');
// Run every single test file in the directory

myEmitter.on('Collected all test case data', (data) => {
    console.log('Custom event received with data:', data);
    processing(getFinalList());
});


// Go through the test file to check how many of specs are there. 
// const targetTestFileLocation = path.join(__dirname,'..','TestCases_fileManipulation','test.spec.js');
// const testFileLocation = findTestFileLocation('TestCases_fileManipulation','test.spec.js')
// console.log("Check this: ",testFileLocation)
const testFileLocation = '/Users/marcus/Desktop/testArea/personalTestingFramework/TestCases_fileManipulation/test.spec.js'
const output = findNumberOfSpec('spec(',testFileLocation)
output.then(numberOfSpecs=>{
    setNumberOfSpecs(numberOfSpecs);
    addEventEmitter(myEmitter);
    // Run all the test cases
    require('../TestCases_fileManipulation/test.spec.js')
    // What do I do next?
    // I need to figure out how to pass the data to the processing function. 
})


// format the data
// formatForAnalysis();



// Display the data


// HOW DO I MAKE SURE FORMATFORANALYSIS only runs after everything has finish running?
// 1. When does it finish running?
//          1. Check how many data spec() is there before running anything. 
                    // 1. Everytime .toBe concludes, add one to counter, check a counter in the object. 
                    //         1. If counter === number of spec(), 
                    //                 Run formatForAnalysis()
// 