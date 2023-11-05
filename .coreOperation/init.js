/*
    Structure:
        1. Set up the functions                             ->      
        2. Run the tests                                    ->      How to make it as convenient as jasmine testing (npm test)?
        3. Retrieve data from testStructure function        ->      returnFinalOutput
        4. Analyse and display                              ->      testStatus class object
*/


// SETUP
require('./testStructure.js');
require('./testStatus.js');

// Run test cases
require('../testCases.spec.js')


// Package, analyse, and show test results
unpackSpecifications()
runAllTests().then(res=>{
    const testStatus = newTestStatusClass(res)
    testStatus.generateResults();
    testStatus.displayResults();
})


















