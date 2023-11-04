const fs = require('fs');
const path = require('path');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

global.findTestFileLocation = function(route1,route2){
    return path.join(__dirname,"..",route1,route2)
}

global.findNumberOfSpec = async (criteria,fileName,formatting=null)=>{ 
    
        /*Errors*/
            if (typeof criteria !== 'string') {
                throw new Error("Criteria must be a string");
            }
            if (typeof fileName !== 'string') {
                throw new Error("FileName must be a string");
            }
            if(!fileName.includes('.')){
                throw new Error("fileName has no file extension")
            }
            // if (!isRegExpString(criteria)) {
            //     throw new Error("Criteria must be a regex");
            // }

        /*Errors*/
        let output = null;
        const data = await readFileAsync(fileName, 'utf8');
        // console.log("THIS: ",data)
            
            // Data setup
            const arr = data.split('\n');
            const length = arr.length;

            // // Find lines that match regex
            const collectedMatch = [];
            for(let i = 0;i < length;i++){
                const currentLine = arr[i];
                const status = currentLine.includes(criteria);
                // console.log(i,currentLine)
                if(status){
                    // console.log("SUCCESS!!!!")
                    collectedMatch.push(currentLine); 
                }
            }
            
            // // ERROR CHECKING: Check if there is even any match or not
            if(collectedMatch.length === 0){
                throw new Error("No criteria match found in file");
            }

            return collectedMatch.length
    
    
}



// const path = require('path');

// const route = '../../spec'
// const paths = fs.readdirSync(path.join(__dirname,".."));
// console.log(paths)


// How to get all the files that have .spec in the name?

// Find all the files in the personal testing framework directory. 


