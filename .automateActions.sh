

# source /Users/marcus/Desktop/testArea/personalTestingFramework/shaderManipulation/.commands/commands.sh

# This is adaptive: The test will run based on the current testing framework you are in.
function test(){
    # STRATEGY: Go upward and check the files to find the first .automateActions.sh file. 
    # Step 1. The way to achieve this is by looping upwards until it finds the first .automateActions file, 
    # Step 2. then from that directory that has the .automateActions.sh file, go into the .coreOperations folder 
    # Step 3. and then run the init.js file within.
    original_directory=$(pwd)
    while true; do
        current_directory=$(pwd)
        if [[ $(ls .automateActions.sh) == ".automateActions.sh" ]]; then
            echo "\nProject location: $current_directory\n"
            echo "Running tests...\n"
            node "$current_directory/.coreOperation/init.js"
            echo "\n"
            break;
        fi
        if [[ "$current_directory" == "/Users" ]]; then
            echo "you are currently not in any project"
            break;
        fi
        cd ..
    done
    cd "$original_directory"
}

function refresh(){
    original_directory=$(pwd)
    while true; do
        current_directory=$(pwd)
        if [[ $(ls .automateActions.sh) == ".automateActions.sh" ]]; then
            echo "\nProject location: $current_directory\n"
            echo "Refreshing...\n"
            source .automateActions.sh
            break;
        fi
        if [[ "$current_directory" == "/Users" ]]; then
            echo "you are currently not in any project"
            break;
        fi
        cd ..
    done
    cd "$original_directory"
}

function listHelperFunctions(){
    code /Users/marcus/Desktop/testArea/personalTestingFramework/.coreOperation/checkingTools.js
}

function commands(){
    code /Users/marcus/Desktop/testArea/personalTestingFramework/.automateActions.sh
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