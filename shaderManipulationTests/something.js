function isStringAFileName(fileName){
        
    const regex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/;
    return regex.test(fileName);
    
/*
    Possible outcomes: 
        1. There are no "/"
        2. The end string after the last "/" is empty
        3. The end string after the last "/" is just a word with no "."
        4. The end string after the last "/" has ".", but it is at the beginning of the string
        5. The end string after the last "/" has ".", bu
*/
}
function doesRoutePointToAFile(route){
    if(typeof route !== "string"){
        throw new Error("route parameter is not a string")
    }
    const splittedRoute = route.split('/');
    const outcome = isStringAFileName(splittedRoute[splittedRoute.length-1]);
    if(outcome){
        return true
    }else{
        return false;
    }
}

const x = 'something/nothing/hello/.lalajs';
console.log(doesRoutePointToAFile(x))

