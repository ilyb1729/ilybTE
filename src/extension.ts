// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { io } from 'socket.io-client';
import { Server } from 'socket.io';
import { Socket } from 'dgram';
import { connected } from 'process';

let connectedToServer = false;

const portNum = 3000;


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	

	
	// // Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only e executed once when your extension is activated
	// console.log('Congratulations, your extension "ilybte" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('ilybte.helloWorld', () => {	
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from I fucking hate myself !!!!!');
	// });

	// context.subscriptions.push(disposable);

	let dispStart = vscode.commands.registerCommand('ilybte.startSharing', () => {
		const io = new Server(3000);

		console.log("Started server at port $s", portNum);

		io.on("connection", (socket) => {
			socket.emit("hello", "world");

			socket.on("howdy", (arg) => {
				console.log(arg);
			});
		});

		connectedToServer = true;
	});;

	let dispJoin = vscode.commands.registerCommand('ilybte.joinSharing', () => {

		const socket = io("ws://localhost:3000");

		console.log("Joined a sharing at port %s", portNum);

		socket.on("hello", (arg) => {
			console.log(arg);
		});

		socket.emit("howdy", "stranger");
	});
}

// This method is called when your extension is deactivated
export function deactivate() {
	// TODO:
	// Disconnect from the server
	if (connectedToServer) {

	}
	connectedToServer = false;
}

// TODO:
// Make a global mapping from depth number to a BASE size
class TreeNode
{
	public parent: TreeNode | null;
	public children: TreeNode[] = [];

	public depth: number;
	public siteNum: number;
	public time: number;

	constructor(parent: TreeNode | null, depth: number, siteNum: number, time: number) 
	{
		this.parent = parent;
		this.depth = depth;
		this.siteNum = siteNum;
		this.time = time;
		if (this.parent) {
			this.parent.children.push(this);
		}
	}
}