// file2.js
// console.log(globalThis.myGlobalVariable)
// console.log(hello())
group("something",()=>{
    spec("test 1",()=>{
        const hi = 1;
        const bye = 1;
        expect(hi).toBe(bye)
    })
    spec("test 2",()=>{
        const hi = 1;
        const bye = 1;
        expect(hi).toBe(bye)
    })
})



