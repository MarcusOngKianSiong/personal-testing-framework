

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


