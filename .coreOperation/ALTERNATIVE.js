
function individualStorage(){
    let collection = {}
    function it(description, func){
        const testData = {expected: null, actual: null};
        const expect = (value) => {
            testData.actual = value;
            return {
                toBe: (value) => {
                    testData.expected = value;
                    collection[description] = testData;
                },
            };
        };
        func(expect); 
    }
    function returnCollection(){
        const secureCollection = collection;
        emptyCollection()
        return secureCollection;
    }
    function emptyCollection(){
        collection = {};
    }
    return {it,returnCollection};
}

function groupStorage(){
    const finalOutput = {}
    function describe(name,func){
        finalOutput[name] = null;
        func();
        finalOutput[name] = returnCollection()
    }
    function returnFinalOutput(){
        return finalOutput;
    }
    return {describe,returnFinalOutput};
}
const {describe,returnFinalOutput} = groupStorage();
const {it,returnCollection} = individualStorage()



// describe("something",()=>{
//     it("nothing",(expect)=>{
//         expect(1).toBe(1)
//     })
// })
// describe("hi",()=>{
//     it("bye",(expect)=>{
//         expect(2).toBe(1)
//     })
//     it("hey",async (expect)=>{
//         expect(3).toBe(4)
//     })
// })

// console.log(returnFinalOutput())



// const {add,checkData} = something();
// console.log(checkData())
// add()
// add()
// add()
// console.log(checkData())