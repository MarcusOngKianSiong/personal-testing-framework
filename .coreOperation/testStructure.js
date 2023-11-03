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
    }
}

const outcomes = new comparisons()

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

global.group = function(groupName,func){
    outcomes.addnewGroup(groupName);
    outcomes.setGroupFocus(groupName);
    func()
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