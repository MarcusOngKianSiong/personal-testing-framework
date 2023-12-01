const {spaceSeparatedStringToCommaSeparatedString} = require('../shaderManipulation/shaderManipulationWrapper.js')

describe('functional correctness: shader manipulation support function',()=>{

    it('string separated space to comma separated space (Meant for addShaderVariablesToDataStorage method)',()=>{
        const expected = 'random,vertex,attribute,vec2,a_position\nrandom,vertex,varying,vec2,current_fragment_position';
        const data = ['attribute vec2 a_position;','varying vec2 current_fragment_position;'];
        const outcome = spaceSeparatedStringToCommaSeparatedString(["random","vertex"],3,data);
        expect(outcome).toBe(expected)
    })
    
})

