// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import * as remote_execution from './remote_execution'
import * as remote_execution from './remote_execution'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-to-unreal" is now active!');

	let remote_exec:any = null;
	let remote_node_id:string = null;

	function getText() {
		let editor = vscode.window.activeTextEditor;
		let selection = editor.selection;
		let text: string;

		if (selection.isEmpty != true) {
			console.log(`Sending selected code to UE`);
			text = editor.document.getText(selection);
		} else {
			console.log(`Sending all code to ue`);
			text = editor.document.getText();
		}
		return text;
	}


	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-to-unreal.send2ue', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Sending code to Unreal Engine');
		
		if(remote_node_id){
			console.log(remote_exec.run_command(getText(), 'ExecuteFile'))
		}else{
			console.log("Not connected to any remote UE. Please connect first.")
		}
		
	});

	context.subscriptions.push(disposable);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let py2ue = vscode.commands.registerCommand('vscode-to-unreal.connect2ue', () => {

		if(remote_exec === null){
			remote_exec = new remote_execution.RemoteExecution();
			remote_exec.start();
			const detect_node = setInterval(()=>{
				if(!remote_node_id){
					if(remote_exec.remote_nodes.length > 0){
						remote_node_id = remote_exec.remote_nodes[0]["node_id"];
						console.log("connected to " + remote_node_id)
						remote_exec.open_command_connection(remote_node_id);
					}
				}else{
					clearInterval(detect_node);
				}
			})
		}else{
			remote_exec.stop();
			remote_exec = null;
		}
		
	});

	context.subscriptions.push(py2ue);
}

// this method is called when your extension is deactivated
export function deactivate() {
	/*
	if(remote_exec){
		remote_exec.stop();
		remote_exec = null;
	}
	*/
}
