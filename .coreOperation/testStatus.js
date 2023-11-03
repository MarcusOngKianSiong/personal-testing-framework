function success(description){
    return '\x1b[32m'+'✔️ '+description+'\x1b[30m'
}
function failure(description){
    return '\x1b[31m'+'✘ '+description+'\x1b[30m'
    // console.log('\x1b[31m','✘',description,'\x1b[30m');
}

function equalTest(data1,data2){
    return data1 === data2;
}


function generateOneStatus(description, data1, data2){
    return {
        description: description,
        status: equalTest(data1,data2)
    }
}

/**
 * @abstract generate all the console test outcome messages
 * @param {string} groupName
 * @param {[{description: "lalala",status: true}]} testDescriptions;
 */
function displayTestStatus(groupName,testDescriptions){
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

    if(typeof groupName !== "string"){
        throw new Error("grouping groupName parameter is not a string")
    }
    if(!Array.isArray(testDescriptions)){
        throw new Error("grouping testDescriptions parameter is not an array");
    }
    if(testDescriptions.length === 0){
        throw new Error("grouping testDescriptions parameter has no value in its array");
    }

    // ERROR CHECKING: Array values error checking
        const length = testDescriptions.length
        for(let i = 0;i<length;i++){
            const currentInstance = testDescriptions[i];
            if(currentInstance.description === undefined){
                throw new Error("array data error 1.0: description key does not exist");
            }else if(typeof currentInstance.description !== "string"){
                throw new Error("array data error 1.1: description is not a string")
            }
            if(currentInstance.status === undefined){
                throw new Error("array data error 2.0: status key does not exist");
            }else if(typeof currentInstance.status !== "boolean"){
                throw new Error("array data error 2.1: status value is not a boolean");
            }
        }

    console.log(groupName);
    for(let i = 0;i<length;i++){
        const currentInstance = testDescriptions[i];
        let statusMessage = null;
        if(currentInstance.status === false){
            statusMessage = failure(currentInstance.description);
        }
        if(currentInstance.status === true){
            statusMessage = success(currentInstance.description);
        }
        console.log("    ",statusMessage);
    }
}

global.processing = function(data){
    /*
            Expected input format: 
                - data: {groupName: [{description: value,  expected: value, actual: value},...]};
    */
    
    const testGroupLength = Object.keys(data).length;
    for(const groupName in data){
        const testCases = data[groupName];
        const testCaseLength = testCases.length;
        const processedTests = []
        for(let i = 0;i<testCaseLength;i++){
            processedTests.push(generateOneStatus(testCases[i].description,testCases[i].expected,testCases[i].actual));
        }
        displayTestStatus(groupName,processedTests);
    }

}



/*--------------------------------------------------------------------------------------------------------------*/

const something = {
    "hello": [
        {
            description: "test 1",
            expected: 1, 
            actual: 2
        },
        {
            description: "test 2",
            expected: 1, 
            actual: 2
        },{
            description: "test 3",
            expected: 2, 
            actual: 2
        }
    ],
    goodbye: [
        {
            description: "test 1",
            expected: 1, 
            actual: 2
        },
        {
            description: "test 2",
            expected: 2, 
            actual: 2
        },{
            description: "test 3",
            expected: 2, 
            actual: 2
        }
    ],

}

// processing(something);

// I think that displaying everything on a single line is better. Error: expect: xxxx -> got: xxxx
// What if you want to handle an outcome that is not captured?
    // Generated an error when it should have succeeded. How to capture that in the message?


