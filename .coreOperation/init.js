require('./testStatus.js')
require('./testStructure.js');
// Run every single test file in the directory
require('../testCases.spec.js')

// format the data
formatForAnalysis();

// Display the data
processing(getFinalList());

