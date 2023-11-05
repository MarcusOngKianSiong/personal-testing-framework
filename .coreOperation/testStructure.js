// Since when you run the arrow function passed to group function, it is typically not a promise. 
// If it is typically not a promise, then I can potentially do it by order. 


/*
    main problem: 
        Async functions will affect the order of execution, which affects the attachment of data to 
        their respective groups or specification.
        
    Strategy: 
        Collect arrow functions, group them by steps (group arrow functions, spec arrow functions), execute in order

    Description:
        Collect all the arrow functions, execute the arrow functions in order, in an async function, to prevent
        functions from executing before the completion of the previous. 

*/


const fs = require('fs').promises
const path = require('path')

class testCaseManagement{
    constructor(){
        // Gather all arrow functions passed to describes
        this.testGroupsFuncs = {};
        // Gather all the arrow functions passed to it, grouped based on group name
        this.testGroupSpecs = {};
        // The final output (expected, actual) to be passed for checking if test is successful
        this.testCaseComparisonData = {};
        // Check current group to gather arrow functions from
        this.currentTestGroup = null;
        // Meant for 
        
    }
    insertNewGroup(groupName,func){
        this.testGroupsFuncs[groupName] = {
            unpackSpecs: func,
        }
    }
    // Create a new section
    unpackSpecifications(){
        // console.log("Check test group funcs: ",this.testGroupsFuncs)
        for(const name in this.testGroupsFuncs){
            this.currentTestGroup = name;
            this.testGroupsFuncs[name].unpackSpecs();
        }
        this.currentTestGroup = null;
        // console.log("check test group specs: ",this.testGroupSpecs);
    }
    insertSpecFunction(name,func){
        // If in process
        if(!this.testGroupSpecs[this.currentTestGroup]){
            this.testGroupSpecs[this.currentTestGroup] = {};
        }
        this.testGroupSpecs[this.currentTestGroup][name] = func;
    }
    insertComparisonData(type,data){
        if(this.testCaseComparisonData[this.comparisonData_currentTestGroup][this.comparisonData_currentSpecification]){
            if(type === "expected"){
                this.testCaseComparisonData[this.comparisonData_currentTestGroup][this.comparisonData_currentSpecification].expected = data;
                return true;
            }
            if(type === "actual"){
                this.testCaseComparisonData[this.comparisonData_currentTestGroup][this.comparisonData_currentSpecification].actual = data;
                return true;
            }
        }else{
            throw new Error("No such specification")
        }
    }

    checkCurrentTestGroup(){
        /*Work in unison with unpackSpecifications method */
        return this.currentTestGroup
    }
    checkComparisonData_currentTestGroup(){
        if(this.comparisonData_currentTestGroup){
            return this.comparisonData_currentTestGroup
        }else{
            throw new Error("runAllTests() not executed");
        }
    }
    checkComparisonData_currentSpecification(){
        if(this.comparisonData_currentSpecification){
            return this.comparisonData_currentSpecification
        }else{
            throw new Error("runAllTests() not executed");
        }
    }
    
    /**
     *
     * @Concerns
     *  1. How can I be sure each 
     * @memberof testCaseManagement
     */
    async runAllTests(){
        if(!this.testGroupSpecs){
            throw new Error("test group no ready");
        }
        // Specify counters
        this.comparisonData_currentTestGroup = null;
        this.comparisonData_currentSpecification = null;

        for(const groupName in this.testGroupSpecs){
            const groupSpecs = this.testGroupSpecs[groupName];                                              // Isolate the group specification to be looped
            this.testCaseComparisonData[groupName] = {}                                                     // setup testCaseComparisonData with current group focus
            this.comparisonData_currentTestGroup = groupName;                                               // Specify current group
            for(const specName in groupSpecs){
                this.testCaseComparisonData[groupName][specName] = {expected: null, actual: null};          // Setup testCaseComparisonData with current specification and object to collect expected and actual data.
                const currentSpec = groupSpecs[specName];                                                   // Isolate the single specification to be executed
                this.comparisonData_currentSpecification = specName;                                        // Specify current specification
                if(currentSpec[Symbol.toStringTag] === "AsyncFunction"){
                    await currentSpec(); 
                }else{
                    currentSpec();
                    // console.log("    ",groupSpecs[specName]())
                }
            }
        }
        // console.log("Check final outcome: ",this.testCaseComparisonData)
        return this.testCaseComparisonData;
    }
}

const testRound = new testCaseManagement()


// Debugging tools
global.viewAll = function(){
    console.log("Test group functions: ",testRound.testGroupsFuncs);
    console.log("Test group specifications: ",testRound.testGroupSpecs);
    console.log("Final output: ",testRound.testCaseComparisonData);
}


//WRAPPER
global.unpackSpecifications = function(){
    testRound.unpackSpecifications()
}
global.runAllTests = async function(){
    return testRound.runAllTests()
}


// WHAT TO USE
global.describe = function(name,func){
    testRound.insertNewGroup(name,func);
}

global.it = function(name,func){
    testRound.insertSpecFunction(name,func);
}

global.expect = function(actual){
    testRound.insertComparisonData("actual",actual);
    return {toBe: (expected)=>{
        testRound.insertComparisonData("expected",expected);
    }}
}

// describe("something",()=>{
//     // You pass me a function to run all the it cases. 
//     // However, how do I make sure that these it cases attaches itself to the describe?
//     it('test 1',async ()=>{
//         expect(1).toBe(1)
//     })
//     it('test 2',async ()=>{
//         expect(2).toBe(2)
//     })
    
// })
// describe("nothing",()=>{
//     // You pass me a function to run all the it cases. 
//     // However, how do I make sure that these it cases attaches itself to the describe?
//     it('test 2',()=>{
//         expect(4).toBe(4)
//     })
//     it('test 1',async ()=>{
//         const outcome = await someRandomFile()
//         expect(outcome).toBe(3)
//     })
// })



// // WHAT OT RUN AFTER
// testRound.unpackSpecifications()
// testRound.runAllTests()

// async function something(){
//     return "lalala"
// }

// async function someRandomFile(){
//     const dir = path.join(__dirname,"sample.txt")
//     const text = await fs.readFile(dir,'utf8');
//     return text;
// }
