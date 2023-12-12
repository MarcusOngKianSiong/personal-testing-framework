## Getting Started

```javascript
describe("something",()=>{
    it("test 1",()=>{
        const hi = 1;
        const bye = 1;
        expect(hi).toBe(bye)
    })
    it("test 2",()=>{
        const hi = 1;
        const bye = 2;
        expect(hi).toBe(bye)
    })
    it("test 3",async ()=>{
        
    })
})
```
![Output image](./.readme/basicOutput.png)

## Limitations
- expect().toBe() only checks surface level values.


## Additional Tools
- Used in test cases:                       checkingTools.js
- Improve testing framework operations:     automationTools.js

## Improvements
[] Specify the reason for failed test
[x] How can I be sure that data manipulation by previous test cases do not affect the data collected by other test cases?
[x] The test case can handle normal standard data. How to make it handle async functions?
