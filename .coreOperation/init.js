/*
    Structure:
        1. Set up the functions                             ->      
        2. Run the tests                                    ->      How to make it as convenient as jasmine testing (npm test)?
        3. Retrieve data from testStructure function        ->      returnFinalOutput
        4. Analyse and display                              ->      testStatus class object
*/

/* 
    Problems:
        1. How can I be sure that test cases do not affect the data collected by other test cases?
        2. How do I make sure that all the tests have been completed before getting all the test data to perform the check?
        3. The test case can handle normal standard data. How to make it handle async functions?
            - 
*/


// SETUP
require('./testStructure.js');      // Produce the functionality for writing test cases
require('./testStatus.js');         // Produce the test outcome message
require('./checkingTools.js');      // Tools that you can use in your test case
require('./automationTools.js')
// Run test cases


const data = findAllFiles('.spec.js');
const length = data.length;
for(let i = 0;i<length;i++){
    require(data[i]);
}
// require('/Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulationTests/supportFunctionTests.spec.js')
// require('../TestCases_fileManipulation/supportingFunctions.spec.js');
// require('../TestCases_fileManipulation/coreFunctions.spec.js')
// require('../shaderManipulationTests/shaderManipulationTests.spec.js')

// Package, analyse, and show test results
unpackSpecifications()
runAllTests().then(res=>{
    const testStatus = newTestStatusClass(res)
    testStatus.generateResults();
    testStatus.displayResults();
})
