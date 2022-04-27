# vscode-to-unreal

A Visual Code extension to send python code to Unreal Engine. 

## Usage

To run the test you need to first, enable the python scripting plugin and turn on “Enable Remote Execution” under “Project settings” => Plugins => Python =>Python Remote Execution

In Visual Code with the python code you want to run in UE opened : 
- Open Command Palette (CTRL + Shift + P)
- type : Unreal
- click on "Connect Visual Code to Unreal"
(Visual Code should connect to the first unreal node it will find)

Every time you want to send code (after connection is done) : 
- Open Command Palette (CTRL + Shift + P)
- type : Unreal
- click on "Send current code to Unreal Engine"

NB : If code is selected, only that snippet will be sent. If no selection, the entire file is sent. 


## Unreal Engine remote_execution.py to remote_execution.ts

remote_execution.ts is a direct port of remote_execution.py to TypeScript. 
Original repository is here : https://github.com/francoisgfx/remote_execution.ts


## Todo

The Visual Code extension is not complete and still in development as I am quite new to this. Most of the work has been done on remote_execution.ts. 
- UI to select the remote box 
- bind shortcut to commands

