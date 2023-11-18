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

