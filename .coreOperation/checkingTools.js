global.array_equal = function(a1,a2,orderConsideration=true){
    const length1 = a1.length;
    const  length2 = a2.length;
    if(length1 !== length2){
        return false
    }
    
    if(!orderConsideration){
        a1 = a1.sort()
        a2 = a2.sort()
    }
    
    for(let i = 0;i<length1;i++){
        if(a1[i] !== a1[i]){
            return false
        }
    }
    return true
}

global.object_equal = function (object1,object2){
    const object1_keys = Object.keys(object1);
    const object2_keys = Object.keys(object2);
    if(!array_equal(object1_keys,object2_keys,false)){
        return false;
    }
    for(const key in object1){
        // Check the data type
        if(typeof object1[key] === "array"){
            if(!array_equal(object1[key],object2[key])){
                return false
            }
        }
        else if(typeof object1[key] === "object"){
            if(!object_equal(object1[key],object2[key])){
                return false
            }
        }
        else if (object1[key] !== object2[key]){
            return false
        }
    }
    
    return true
}

global.displayDifferenceBetweenLinesInStrings = function(string1,string2){
    string1 = string1.split('\n');
    string2 = string2.split('\n');

    const string1Length = string1.length;
    const string2Length = string2.length;
    let coreLooper = null;
    if(string1Length>string2Length){
        coreLooper = string1Length;        
    }else{
        coreLooper = string2Length;
    }
    
    const errors = {}
    for(let i = 0;i<coreLooper;i++){
        if(string1[i] === string2[i]){
            continue;
        }
        
        errors[i] = locateIndexAreaOfDifferenceBetweenTwoStrings(string1[i],string2[i]);
    }

    console.log("---CHECKING DIFFERENCE---")
    for(const lineNumber in errors){
        console.log(lineNumber,": ",errors[lineNumber])
    }
    console.log("---Checking difference end---")
}

function locateIndexAreaOfDifferenceBetweenTwoStrings(string1, string2){
    if(string1 === undefined || string2 === undefined){
        return undefined
    }
    const string1Length = string1.length;
    const string2Length = string2.length;
    
    let longer = string1Length>string2Length ? string1Length : string2Length;
    
    let startIndex = null;
    let endIndex = null;
    for(let i = 0;i<longer;i++){
        if(string1[i] !== string2[i] && startIndex === null){
            startIndex = i;
        }
        if(string1[i] !== string2[i] && startIndex !== null){
            endIndex = i;
        }
    }

    if(endIndex === null){
        endIndex = startIndex
    }

    if(startIndex === null){
        return false
    }

    return startIndex === endIndex ? [startIndex] : [startIndex,endIndex];

}
