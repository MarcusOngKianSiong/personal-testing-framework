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
[x]  If I have different projects and each have the testing infrastructure, won’t the `test` command conflict with each other simply because they are the same command and `source` command makes the command global?
    [x]  Add an additional step for each bash function to run `source` on the bash file in the current position in the file system.
        - If outside a testing infrastructure → Error: No such file
        - If inside a testing infrastructure → the local bash script will be the `sourced`
        **Another problem:** 
            How to make it such that test command will always run the right test no matter how deep I go into the folders within the project?
                I was thinking of going through each of the directories one by one up the hierarchy, and in each, look to see whether the `.automateActions.sh` is there or not. The first encounter of that file represents the root of the project.

