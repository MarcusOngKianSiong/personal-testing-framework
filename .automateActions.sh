

# source /Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulation/.commands/commands.sh


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

# function show(){
#     var1=$2
#     if [ "$var1" == 'functionality' ]; then
#         # code /Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulation/shader_components/functionality/functionalityOperation.js
#         echo 'goodbye'
#     elif [ "$var1" == 'test' ]; then
#         echo 'successful'
#     else
#         echo "WHat"
#     fi
# }



function show() {
    var1=$1  # Use $1 to get the first argument

    if [[ "$var1" == 'functionality' ]]; then
        code /Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulation/shader_components/functionality/functionalityOperation.js
    elif [[ "$var1" == 'shaderOps' ]]; then
        code /Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulation/shader_components/operations/shaderOperations.js
    elif [[ "$var1" == 'variables' ]]; then
        code /Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulation/shader_components/variables/variablesOperations.js
    else
        echo '

            1. functionality
            2. shaderOps
            3. variables

        '
    fi
}



# // 
# function WebGL(){
#     value="$1"
    
#     # echo "$value There!!"
#     if [ $value == "function" ]; then
#         echo "Hello"
#     else
#         echo "goodbye"
#     fi
#     #     echo "The value is equal to 'functionality'"
#     # else
#     #     echo "The value is not equal to 'functionality'"
#     # fi
#     # echo "hello"
# }