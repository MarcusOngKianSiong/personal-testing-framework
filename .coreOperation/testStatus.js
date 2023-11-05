
/* 
    Components:
        1. Determining individual test result based on two pieces of data
        2. Loop through groups and specifications
        3. Storage of results
        4. display test results.

*/

class testStatus{
    constructor(testData){
        this.testData = testData;
        this.testResults = {};
        
    }

    equalComparison(actual,expected,specification){
        if(actual === expected){
            return '\x1b[32m'+'✔️ '+specification+'\x1b[30m';
        }else{
            return '\x1b[31m'+'✘ '+specification+'\x1b[30m';
        }
    }

    /**
     *  @assumption
     *      - data format: {something: {"nothing": {expected: 1, actual: 2}}}
     *  @memberof testStatus
     */
    generateResults(){
        for(const group in this.testData){
            for(const specification in this.testData[group]){
                const testStatus  = this.equalComparison(this.testData[group][specification].actual,this.testData[group][specification].expected,specification);
                if(!this.testResults[group]){
                    this.testResults[group] = {}
                }
                this.testResults[group][specification] = testStatus; 
            }
        }
    }
    displayResults(){
        for(const group in this.testResults){
            console.log(group)
            for(const specification in this.testResults[group]){
                console.log("    ",this.testResults[group][specification]);
            }
        }
    }
}

global.newTestStatusClass = function(data){
    return new testStatus(data);
}
