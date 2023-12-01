function test(){
    node /Users/marcus/Desktop/testArea/personalTestingFramework/.coreOperation/init.js
}

function listHelperFunctions(){
    code /Users/marcus/Desktop/testArea/personalTestingFramework/.coreOperation/checkingTools.js
}

function commands(){
    code /Users/marcus/Desktop/testArea/personalTestingFramework/.automateActions.sh
}

function refresh(){
    source /Users/marcus/Desktop/testArea/personalTestingFramework/.automateActions.sh
}

// 
function WebGL(){
    value="$1"
    
    # echo "$value There!!"
    if [ $value == "function" ]; then
        echo "Hello"
    else
        echo "goodbye"
    fi
    #     echo "The value is equal to 'functionality'"
    # else
    #     echo "The value is not equal to 'functionality'"
    # fi
    # echo "hello"
}