myGlobalVariable = 'Hello from file1!';

global.hello = function(){
    return 1
}

class comparisons{
    constructor(){
        this.specs = {}
        this.finalForm = null;
        this.currentFocus = {
            groupName: null,
            specName: null
        }
        this.numberOfSpecs = 0;
        this.specCompletionCounter = 0;
        this.eventEmitter = null
    }
    addEventEmitter(eventEmitterObject){
        this.eventEmitter = eventEmitterObject
    }
    addnewGroup(groupName){
        this.specs[groupName] = {}
    }
    addNewSpec(groupName,specName){
        this.specs[groupName][specName] = {
            expected: null,
            actual: null
        }
    }
    addExpectedOutput(groupName,specName,expectedOutput){
        this.specs[groupName][specName].expected = expectedOutput;
    }
    addActualOutput(groupName,specName,actualOutput){
        this.specs[groupName][specName].actual = actualOutput;
    }
    setNumberOfSpecs(number){
        this.numberOfSpecs = number
    }
    setGroupFocus(groupName){
        this.currentFocus.groupName = groupName;
    }
    setSpecFocus(specName){
        this.currentFocus.specName = specName;
    }
    getCurrentGroup(){
        return this.currentFocus.groupName;
    }
    getCurrentSpec(){
        return this.currentFocus.specName;
    }
    resetCurrentFocus(){
        this.currentFocus.groupName = null;
        this.currentFocus.specName = null;
    }
    toBe(expected){
        this.specs[this.currentFocus.groupName][this.currentFocus.specName].expected = expected;
        this.specCompletionCounter += 1;
        if(this.numberOfSpecs === this.specCompletionCounter){
            this.formatForAnalysis()
            // console.log("Checking final form: ",this.finalForm)
        }
    }
    checkNumberOfSpecsCompleted(){
        return this.specCompletionCounter;
    }
    formatForAnalysis(){
            /*
        Expected input format:
            1. groupName            -> "something"
            2. testDescription      -> [
                {
                    description: "lalala",
                    status: true
                },
                {
                    description: "blablabla",
                    status: false
                }
            ]
    */
            const finalForm = {}
            for(const groupName in this.specs){
                finalForm[groupName] = [];
                const specs = this.specs[groupName];
                for(const spec in specs){
                    const specActualAndExpected = specs[spec];
                    finalForm[groupName].push({
                        description: spec,
                        actual: specActualAndExpected.actual,
                        expected: specActualAndExpected.expected
                    })
                }
            }
            this.finalForm = finalForm;
            this.eventEmitter.emit("Collected all test case data",this.finalForm)
            return this.finalForm
    }
}

const outcomes = new comparisons()

global.addEventEmitter = function(eventEmitterObject){
    outcomes.addEventEmitter(eventEmitterObject);
}

// SPECS
global.setNumberOfSpecs = function(number){
    outcomes.setNumberOfSpecs(number);
}
global.checkNumberOfSpecs = function(){
    return outcomes.numberOfSpecs
}
global.checkNumberOfSpecsCompleted = function(){
    outcomes.checkNumberOfSpecsCompleted()
}

// Convert for test case analysis and display
global.formatForAnalysis = function(){
    outcomes.formatForAnalysis()
}

global.getFinalList = function(){
    return outcomes.finalForm
}

/*
    How do I want to design how I would write the tests? 
        group("group name",()=>{
            spec("spec name",()=>{

            })
            spec("spec name",()=>{
                expect(x).toBe(x)
            })
        })
*/

global.expect = function(outcome){
    
    const finalGroupName = outcomes.getCurrentGroup();
    const finalSpecName = outcomes.getCurrentSpec();
    outcomes.addActualOutput(finalGroupName,finalSpecName,outcome);
    return outcomes;
    
}


global.spec = function(specName,func){
    const groupName = outcomes.getCurrentGroup();
    outcomes.addNewSpec(groupName,specName);
    outcomes.setSpecFocus(specName);
    func()
    
}

global.group = async function(groupName,func){
    
    outcomes.addnewGroup(groupName);
    outcomes.setGroupFocus(groupName);
    
    func()
    return true
}

// group("something",()=>{
//     spec("test 1",()=>{
//         const hi = 1;
//         const bye = 1;
//         expect(hi).toBe(bye)
//     })
//     spec("test 2",()=>{
//         const hi = 1;
//         const bye = 1;
//         expect(hi).toBe(bye)
//     })
// })
// outcomes.formatForAnalysis()
// console.log(outcomes.finalForm)