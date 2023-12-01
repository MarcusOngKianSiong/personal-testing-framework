const { appendFile } = require('fs');
const path = require('path')
const fs = require('fs').promises;


class shaderOperations{

    constructor(){
        this.detailsLocation = path.join(__dirname,"storage","details.txt");
        this.sectionLocation = path.join(__dirname,"storage","sections.txt");
        this.SectionIndication = {
            functionality: "//---Section name: {}---//",
            vertex: "//---vertex---//",
            fragment: "//---fragment---//"
        }
    }

    changeStorageLocation(section,details){
        this.detailsLocation = details;
        this.sectionLocation = section;
    }

    async getSectionContent(){
        const data = await fs.readFile(this.sectionLocation,'utf8');
        return data.split("\n");
    }
    async doesSectionExist(section){
        const data = await this.getSectionContent();
        
        return data.includes(section);
    }
    
    async addSection(sectionName){
        await fs.appendFile(this.sectionLocation,sectionName,'utf8');
        return true;
    }
    async editSection(oldSection,newSection){
        if(!await this.doesSectionExist(oldSection)){
            throw new Error(`${oldSection} section does not exist`);
        }
        const data = await this.getSectionContent();
        const index = data.indexOf(oldSection);
        data[index] = newSection;
        fs.writeFile(this.sectionLocation,data.join('\n'),'utf8');
        return true;
    }
    async removeSection(section){
        if(!await this.doesSectionExist(section)){
            throw new Error("Section does not exist");
        }
        const data = await this.getSectionContent()
        const index = data.indexOf(section);
        data.splice(index,1);
        fs.writeFile(this.sectionLocation,data.join('\n'),'utf8');
        return true;
    }



    /*  
        Return Format:
                {
                    sectionName: {
                        vertex: "",
                        fragment: ""
                    },
                }
    */
    async #sectionDetailsDecomposition(stringSplit){

        // set up the necessary things
        const indexes = {
            functionality: [],
            vertex: [],
            fragment: []
        }
        const decomposedData = {}
        const functionalityRegex = new RegExp(this.SectionIndication.functionality.replace("{}","(.+)"));
        const vertexRegex = new RegExp(this.SectionIndication.vertex);
        const fragmentRegex = new RegExp(this.SectionIndication.fragment);
        const sections = await this.getSectionContent();
        const numberOfSections = sections.length;

        const length = stringSplit.length;
        
        for(let i = 0;i<length;i++){
            const current = stringSplit[i];
            if(functionalityRegex.exec(current)){
                indexes.functionality.push(i);
                continue;
            }
            
            if(vertexRegex.exec(current)){
                indexes.vertex.push(i);
                continue;
            }
            if(fragmentRegex.exec(current)){
                indexes.fragment.push(i);
                continue;
            }
        }
        
        // perform decomposition
        for(let i = 0;i<numberOfSections;i++){
            const currentSectionName = functionalityRegex.exec(stringSplit[indexes.functionality[i*2]])[1];
            const currentSectionVertexContent = stringSplit.slice(indexes.vertex[i*2]+1,indexes.vertex[i*2+1]).join('\n');
            const currentSectionFragmentContent = stringSplit.slice(indexes.fragment[i*2]+1,indexes.fragment[i*2+1]).join("\n");
            decomposedData[currentSectionName] = {
                vertex: currentSectionVertexContent,
                fragment: currentSectionFragmentContent
            }
        }

        return decomposedData;
    }
    #sectionDetailsRecombination(decomposedData){
        let string = ''
        
        for(const sectionName in decomposedData){
            
            const constructedVertex = this.#constructSingleSectionContent(decomposedData[sectionName].vertex,"vertex");
            const constructedFragment = this.#constructSingleSectionContent(decomposedData[sectionName].fragment,"fragment");
            const grouped = this.#constructGroup(sectionName,constructedVertex,constructedFragment);
            string += (grouped + '\n')
        }
        string = string.slice(0,string.length-1);
        return string
    }

    async getSectionDetails(){

        /*

            return value format:
                {
                    sectionName: {
                        vertex: "",
                        fragment: ""
                    },
                }
            
            What you will receive:
                //--- section name: lalala---//
                //---vertex---//
                ....
                //---vertex---//
                //---fragment---//
                ....
                //---fragment---//
                //--- section name: lalala---//
        
            Steps:
                1. Look for the indexes with the functionality indication pattern
                2. Look for the indexes with the vertex pattern
                3. Look for the indexes with the fragment pattern.

            Assumptions:
                1. Each pattern comes in pairs. 
                2. vertex and fragment pattern is beside each other. 
                3. vertex and fragment pattern is between the pair of functionality indication pattern. 
            
        */

        const data = await fs.readFile(this.detailsLocation,'utf8');
        const decomposedData = this.#sectionDetailsDecomposition(data.split("\n"));
        return decomposedData
    }
    async getSpecificSectionDetails(sectionDetailsName){
        
        if(!await this.doesSectionExist(sectionDetailsName)){
            throw new Error(`${sectionDetailsName} section does not exist.`);
        }
        const decomposedData = await this.getSectionDetails();
        return decomposedData[sectionDetailsName]
    }
    
    async modifySectionName(oldName, newName){
        const decomposedData = await this.getSectionDetails();
        
        // THIS IS NOT VARIABLES. THIS IS SHADER OPERATIONS. SO IT SHOULD BE A STRING
        const temporaryStorage = decomposedData[oldName];
        
        delete decomposedData[oldName];
        decomposedData[newName] = temporaryStorage;
        
        const recombinedData = this.#sectionDetailsRecombination(decomposedData);
        // Change both section file and details file
        await fs.writeFile(this.detailsLocation,recombinedData,'utf8');
        const data = fs.readFile(this.sectionLocation,'utf8');
        const split = (await data).split('\n');
        const length = split.length;
        for(let i = 0;i<length;i++){
            if(split[i] === oldName){
                split[i] = newName;
                break;
            }
        }
        const merge = split.join('\n');
        await fs.writeFile(this.sectionLocation,merge,'utf8');
        return true;
    }
    async editSectionDetails(section, shader, code){
        const decomposedData = await this.getSectionDetails();
        
        decomposedData[section][shader] = code;
        const recombinedData = this.#sectionDetailsRecombination(decomposedData);
        fs.writeFile(this.detailsLocation,recombinedData,'utf8');
    }

    async addNew(functionalityName, vertex,fragment){
        if(!this.#isAShader(vertex) || !this.#isAShader(fragment)){
            throw new Error("vertex or fragment shader is not enclosed in void main function");
        }
        const vertexSection = this.#constructSingleSectionContent(vertex,"vertex");
        const fragmentSection = this.#constructSingleSectionContent(fragment,"fragment");
        const groupSection = this.#constructGroup(functionalityName,vertexSection,fragmentSection);
        await fs.appendFile(this.detailsLocation,groupSection,'utf8');
        await fs.appendFile(this.sectionLocation,"\n"+functionalityName,'utf8');
        return true;
    }
    
    async editSpecificSectionDetail(functionalityName,shader,data){
        if(vertex === null && fragment === null){
            throw new Error("No vertex nor fragment shader passed")
        }
        const outcome = await this.getSectionContent()
        if(!this.doesSectionExist(functionalityName)){
            throw new Error("Functionality does not exist")
        }
        
        const decomposedData = this.getSectionDetails();
        decomposedData[functionalityName][shader] = data;
        const combinedString = this.#sectionDetailsRecombination(decomposedData);
        fs.writeFile(this.detailsLocation,combinedString,'utf8');
        return true;

    }
    
    #isAShader(content){
        const split = content.split('\n');
        const length = split.length;
        if(split[0] === "void main(){" && split[length-1] === "}"){
            return true;
        }
        return false;
    }

    #doesSectionLabelExist(section,type){
        
        const split = section.split("\n");
        const length = split.length;
        if(split[0]+'\n' !== this.SectionIndication[type] + '\n'){
            throw new Error("Section head does not match requirement");
        }
        if(split[length-1] !== this.SectionIndication[type]){
            throw new Error("Section tail does not match requirement")
        }
        return true;
    }
    
    #constructGroup(functionalityName,vertex,fragment){
        const sectionIndication = this.SectionIndication.functionality;
        const namedSection = sectionIndication.replace("{}",functionalityName);
        if(this.#doesSectionLabelExist(vertex,"vertex") && this.#doesSectionLabelExist(fragment,"fragment")){
            return namedSection + '\n' + vertex + '\n' + fragment + '\n' + namedSection;
        }
        return false;
    }
    
    #constructSingleSectionContent(content,type){
        return this.SectionIndication[type] + "\n" + content + "\n" + this.SectionIndication[type];
    }
    
}

// I learned that if you prepare the information your mind 
module.exports = {
    shaderOperations
}