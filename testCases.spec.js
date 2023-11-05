describe("something",()=>{
    // You pass me a function to run all the it cases. 
    // However, how do I make sure that these it cases attaches itself to the describe?
    it('test 1',async ()=>{
        expect(1).toBe(1)
    })
    it('test 2',async ()=>{
        expect(2).toBe(2)
    })
    
})
describe("nothing",()=>{
    // You pass me a function to run all the it cases. 
    // However, how do I make sure that these it cases attaches itself to the describe?
    it('test 2',()=>{
        expect(4).toBe(4)
    })
    it('test 1',async ()=>{
        
        expect(1).toBe(3)
    })
})