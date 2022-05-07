import * as vscode from 'vscode';

import * as remote_execution from './remote_execution'

/* 
		TODO : 
		 - replace console message by vscode.showMessage() ?
		 - check if await isn't better
*/


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	console.log('"vscode-to-unreal" is now active!');

	// Start the Unreal Engine Remote Session when Extension is activated
	// This will keep looking for nodes on the network. 
	const remote_exec:remote_execution.RemoteExecution = new remote_execution.RemoteExecution();
	remote_exec.start();


	// Get list of UE nodes asynchronously
	async function get_nodes(remote_exec:remote_execution.RemoteExecution){
		return new Promise((resolve,reject) => {
			const node_checker = setInterval(() =>{
				if(remote_exec.remote_nodes.length > 0){
					clearInterval(node_checker)
					resolve(remote_exec.remote_nodes)
				}
			})
			setTimeout(() => {
				clearInterval(node_checker)
				reject("Couldn't find any Unreal Engine Node")
			},10000)
		})
	}


	// Connecting to UE
	async function connecting_to_ue(remote_exec:remote_execution.RemoteExecution) {
		// disconnect the currrent command connection
		if(remote_exec.has_command_connection()){
			remote_exec.close_command_connection();
		}
		
		// get all found UE nodes on the network
		get_nodes(remote_exec).then(async (response) => {
			// create a QuickItemList
			const nodes_list = remote_exec.remote_nodes.map(x => {
				return {
					label: x["machine"],
					description: x["engine_version"],
					detail: x["project_root"],
					id: x["node_id"],
				}
			})
			
			// Create the list for the user
			const selected_node = await vscode.window.showQuickPick(nodes_list, { placeHolder: 'Select the Unreal to connect to.' })
			if (selected_node == null) return

			//Open a command connection to the selected UE Node
			console.log("Vscode connected to " + selected_node["label"])
			remote_exec.open_command_connection(selected_node["id"]);

		}).catch((error) => {
			console.error("Cannot find UE nodes on the network. Try again",error)
		})

	}


	// Get the code in current open file. 
	// If no selection, all the code is returned.
	function getText() {
		let editor = vscode.window.activeTextEditor;
		let selection = editor.selection;
		let text: string;

		if (selection.isEmpty != true) {
			console.log(`Getting selected code`);
			text = editor.document.getText(selection);
		} else {
			console.log(`Getting entire code`);
			text = editor.document.getText();
		}
		return text;
	}


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let send2ue = vscode.commands.registerCommand('vscode-to-unreal.send2ue', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Sending code to Unreal Engine');
		
		if(!remote_exec.has_command_connection()){
			connecting_to_ue(remote_exec)
		}

		// if connection is established send the code
		if(remote_exec.has_command_connection()){
			// TODO adding callback to get return
			remote_exec.run_command(getText(), true, 'ExecuteFile')
		}else{
			vscode.window.showInformationMessage('You need to connect to a UE node first');
		}
		
	});
	context.subscriptions.push(send2ue);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let connect2ue = vscode.commands.registerCommand('vscode-to-unreal.connect2ue', () => {
		
		connecting_to_ue(remote_exec)

	});

	context.subscriptions.push(connect2ue);
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
