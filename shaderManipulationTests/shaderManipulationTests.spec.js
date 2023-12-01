require('../shaderManipulation/shaderManipulationWrapper');

const expected = `/* -------- VERTEX SHADER VARIABLES -------- */
attribute vec2 a_position;
varying vec2 current_fragment_position;
/* -------- VERTEX SHADER VARIABLES -------- */
/* -------- VERTEX SHADER OPERATIONS -------- */
void main(){
    // Scaler
        float scaledX = a_position.x/scalerX;
        float scaledY = a_position.y/scalerY;
    // 
    gl_Position = vec4(scaledX,scaledY,0.0,1.0);
    current_fragment_position = vec2(a_position.x,a_position.y);
}
/* -------- VERTEX SHADER OPERATIONS -------- */
/* -------- FRAGMENT SHADER VARIABLES -------- */
precision mediump float;
uniform vec4 default_color;
uniform vec4 grid_color;
uniform float number_of_rows;
uniform float number_of_columns;
uniform float shape_width;
uniform float shape_height;
varying vec2 current_fragment_position;  // Shows current fragment
/* -------- FRAGMENT SHADER VARIABLES -------- */
/* -------- FRAGMENT SHADER OPERATIONS -------- */
void main() {
    float blockWidth = shape_width/number_of_columns;
    float blockHeight = shape_height/number_of_rows; 
    float width_remainder = mod(current_fragment_position.x, blockWidth);
    float height_remainder = mod(current_fragment_position.y,blockHeight);
    if (width_remainder == 0.0) {
        // This block is executed if either width_remainder or height_remainder is equal to 0.0
        // Your code here
        gl_FragColor = grid_color;
    }else if(height_remainder == 0.0){
        gl_FragColor = grid_color;
    }else{
        gl_FragColor = default_color;
    }
}
/* -------- FRAGMENT SHADER OPERATIONS -------- */`

const path = require('path');
const { retrieveFileContent, replaceEntireFileContent } = require('../Module_fileManipulation/editProgram');
// Interface
const generalInterfaceFileName = path.join(__dirname,'test_interface','generalInterface.txt');
const editInterfaceLocation = path.join(__dirname,'test_interface','edit_functionality.txt');
const newInterfaceLocation = path.join(__dirname,'test_interface','new_functionality.txt');
// storage
const variableStorage = path.join(__dirname,'test_data_storage','variables.txt');
const functionality = path.join(__dirname,'test_data_storage','functionality.txt');
const operations = path.join(__dirname,'test_data_storage','operations.txt');
// Interface content section indicator
const criteria = {
    title: '/* ---TITLE--- */',
    vertexShaderVariables: '/* -------- VERTEX SHADER VARIABLES -------- */',
    fragmentShaderVariables: '/* -------- FRAGMENT SHADER VARIABLES -------- */',
    vertexShaderOperations: '/* -------- VERTEX SHADER OPERATIONS -------- */',
    fragmentShaderOperations: '/* -------- FRAGMENT SHADER OPERATIONS -------- */'
}



describe('shader manipulation',()=>{
    // Store interface location 
    it('store edit interface location',()=>{
        shaderProcessing.setInterfaceLocation('edit',editInterfaceLocation);
        const outcome = shaderProcessing.getInterfaceLocation('edit');
        expect(outcome).toBe(editInterfaceLocation);
    })
    it('store new interface location',()=>{
        shaderProcessing.setInterfaceLocation('new',newInterfaceLocation);
        const outcome = shaderProcessing.getInterfaceLocation('new');
        expect(outcome).toBe(newInterfaceLocation);
    })

    // store storage location
    it('STORE STORAGE LOCATION',()=>{
        shaderProcessing.setStorageLocation(variableStorage,operations,functionality);
        const outcome = shaderProcessing.isStorageLocationsAvailable()
        expect(outcome).toBe(true);
    })

    // Store section criteria
    it('store section indication criteria',()=>{
        shaderProcessing.setInterfaceSplit(criteria);
        const storedCriteria = shaderProcessing.getInterfaceSplitStrings();
        let status = true;
        for(const key in criteria){
            const actual = criteria[key];
            const outcome = storedCriteria[key];
            if(actual !== outcome){
                status = false;
            }
        }
        expect(status).toBe(true)
    })
    
    // Steps in management execution
    it('extract file content from interface into rawFileContent variable',async ()=>{
        
        const expected = `/* ---TITLE--- */
random
/* ---TITLE--- */


/* -------- VERTEX SHADER VARIABLES -------- */
attribute vec2 a_position;
varying vec2 current_fragment_position;
/* -------- VERTEX SHADER VARIABLES -------- */


/* -------- VERTEX SHADER OPERATIONS -------- */
void main(){
    // Scaler
        float scaledX = a_position.x/scalerX;
        float scaledY = a_position.y/scalerY;
    // 
    gl_Position = vec4(scaledX,scaledY,0.0,1.0);
    current_fragment_position = vec2(a_position.x,a_position.y);
}
/* -------- VERTEX SHADER OPERATIONS -------- */


/* -------- FRAGMENT SHADER VARIABLES -------- */
precision mediump float;
uniform vec4 default_color;
uniform vec4 grid_color;
uniform float number_of_rows;
uniform float number_of_columns;
uniform float shape_width;
uniform float shape_height;
varying vec2 current_fragment_position;  // Shows current fragment
/* -------- FRAGMENT SHADER VARIABLES -------- */

/* -------- FRAGMENT SHADER OPERATIONS -------- */
void main() {
    float blockWidth = shape_width/number_of_columns;
    float blockHeight = shape_height/number_of_rows; 
    float width_remainder = mod(current_fragment_position.x, blockWidth);
    float height_remainder = mod(current_fragment_position.y,blockHeight);
    if (width_remainder == 0.0) {
        // This block is executed if either width_remainder or height_remainder is equal to 0.0
        // Your code here
        gl_FragColor = grid_color;
    }else if(height_remainder == 0.0){
        gl_FragColor = grid_color;
    }else{
        gl_FragColor = default_color;
    }
}
/* -------- FRAGMENT SHADER OPERATIONS -------- */`
        await shaderProcessing.extractFileContentFromInterface("new")
        const outcome = shaderProcessing.getRawFileContent();
        
        expect(outcome).toBe(expected);
    })

    it(`extract section from rawFileContent variable`,()=>{
        
        const expected = {
            title: ['random'],
            vertexShaderVariables: [
              'attribute vec2 a_position;',
              'varying vec2 current_fragment_position;',
            ],
            vertexShaderOperations: [
              'void main(){',
              '    // Scaler',
              '        float scaledX = a_position.x/scalerX;',
              '        float scaledY = a_position.y/scalerY;',
              '    // ',
              '    gl_Position = vec4(scaledX,scaledY,0.0,1.0);',
              '    current_fragment_position = vec2(a_position.x,a_position.y);',
              '}',
            ],
            fragmentShaderVariables: [
              'precision mediump float;',
              'uniform vec4 default_color;',
              'uniform vec4 grid_color;',
              'uniform float number_of_rows;',
              'uniform float number_of_columns;',
              'uniform float shape_width;',
              'uniform float shape_height;',
              'varying vec2 current_fragment_position;  // Shows current fragment',
            ],
            fragmentShaderOperations: [
              'void main() {',
              '    float blockWidth = shape_width/number_of_columns;',
              '    float blockHeight = shape_height/number_of_rows; ',
              '    float width_remainder = mod(current_fragment_position.x, blockWidth);',
              '    float height_remainder = mod(current_fragment_position.y,blockHeight);',
              '    if (width_remainder == 0.0) {',
              '        // This block is executed if either width_remainder or height_remainder is equal to 0.0',
              '        // Your code here',
              '        gl_FragColor = grid_color;',
              '    }else if(height_remainder == 0.0){',
              '        gl_FragColor = grid_color;',
              '    }else{',
              '        gl_FragColor = default_color;',
              '    }',
              '}',
            ]
        }
        
        shaderProcessing.splitContentIntoComponentsAndSetSectionContent()
        const sectionContent = shaderProcessing.getSectionContent();
        const outcome = object_equal(sectionContent,expected);
        // console.log("checking: ",array_equal([1,2,3],[1,2,3]))
        expect(outcome).toBe(true);

    })
    it('Can the variables split properly? (Comma separated values)',()=>{
        /* 
            Key location of usage: To be used in "addShaderVariablesToDataStorage()"
        */
        const data = [
            'precision mediump float;',
            'uniform vec4 default_color;',
            'uniform vec4 grid_color;',
            'uniform float number_of_rows;',
            'uniform float number_of_columns;',
            'uniform float shape_width;',
            'uniform float shape_height;',
            'varying vec2 current_fragment_position;',
        ]
        const expected = 'precision,mediump,float\nuniform,vec4,default_color\nuniform,vec4,grid_color\nuniform,float,number_of_rows\nuniform,float,number_of_columns\nuniform,float,shape_width\nuniform,float,shape_height\nvarying,vec2,current_fragment_position'
        const outcome = shaderProcessing.convertVariablesToCommaSeparated(data);
        expect(outcome).toBe(expected)
    })
    
    it('Add the variables into data storage (variables.js)',async ()=>{
        /* 
            Layers to check:
                1. Is append function working?
            What am I working with here?
        */
            const initial = await retrieveFileContent(variableStorage);
            const additionalVariables = `random,vertex,attribute,vec2,a_position
random,vertex,varying,vec2,current_fragment_position
random,fragment,precision,mediump,float
random,fragment,uniform,vec4,default_color
random,fragment,uniform,vec4,grid_color
random,fragment,uniform,float,number_of_rows
random,fragment,uniform,float,number_of_columns
random,fragment,uniform,float,shape_width
random,fragment,uniform,float,shape_height
random,fragment,varying,vec2,current_fragment_position`
        const expected = initial+'\n'+additionalVariables;
        
        await shaderProcessing.addShaderVariablesToDataStorage()
        const outcome = await retrieveFileContent(variableStorage);
        await replaceEntireFileContent(initial,variableStorage);
        
        expect(outcome).toBe(expected);

    })

    it('find variable',async ()=>{
        const functionality = "grid"
        const shader = "vertex"
        const name = "current_fragment_position";
        const expected = ["grid,fragment,varying,vec2,current_fragment_position"];
        const arr = await shaderProcessing.findVariables(functionality,shader,name);
        const outcome = array_equal(expected,arr);
        console.log(arr);
        expect(outcome).toBe(true);
        
    })

})


function splittingAndShowing(string){
    const item = string.split('\n');
    const length = item.length
    for(let i = 0;i<length;i++){
        console.log(`${i+1}: ${item[i]}`)
    }
}
