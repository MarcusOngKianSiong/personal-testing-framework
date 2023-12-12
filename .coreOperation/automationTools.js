const fs = require('fs')
const path = require('path')

global.findAllFiles = function(pattern,currentDirectory=path.join(__dirname,".."),listOfMatchedFiles=[]){

    /*
        There are only two relevant actions here:
            1. Going down the list
            2. Going deeper into a directory
    */
    
    // read file sync focuses on the directory specified. 
    const data = fs.readdirSync(currentDirectory);
    const length = data.length;

    if(length === 0){
        return listOfMatchedFiles;
    }

    for(let i = 0 ; i<length ; i++){
        const currentDirectoryItem = data[i];
        const currentItemDirectory = currentDirectory + "/" + currentDirectoryItem;

        // If match
        if(currentDirectoryItem.includes(pattern)){
            
            listOfMatchedFiles.push(currentItemDirectory); 
            continue;
        }
        // If directory
        if(fs.statSync(currentItemDirectory).isDirectory()){
            
            listOfMatchedFiles = findAllFiles(pattern,currentItemDirectory,listOfMatchedFiles);
            continue;
        }

    }
    return listOfMatchedFiles;
}



