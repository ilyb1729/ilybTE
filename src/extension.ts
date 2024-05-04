// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { io } from 'socket.io-client';
import { Server } from 'socket.io';
import { notDeepEqual } from 'assert';

class TreeNode
{
	public parent: TreeNode | null;
	public children: TreeNode[] = [];

	public depth: number;
	public siteNum: number;
	public time: number;

	public text: string;

	constructor(parent: TreeNode | null, depth: number, siteNum: number, time: number, text: string) 
	{
		this.parent = parent;
		this.depth = depth;
		this.siteNum = siteNum;
		this.time = time;
		this.text = text;
		if (this.parent) {
			this.parent.children.push(this);
		}
	}
}

let connectedToServer = false;
let isSource = false;
let clientId = -1;

// List of change objects that still need to be sent
let uncommunicatedChanges: TreeNode[] = [];
let curDoc: TreeNode = new TreeNode(null, 0, -1, 0, '');

function depthToSize(n: number) {
	return 32 * (2 ** n);
}

function allocateTreeNode(string: string) {

	return node;	
} 

// TODO:
// Properly type this
let ios: any = null; // should be Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
let socket: any | null = null; // should be Socket<DefaultEventsMap, DefaultEventsMap>
const portNum = 3000;

// TODO:
// How can I tell when someon eleaves the session so that things need to be resynced?
// 		Oh a message saying you joined and request new info
export function activate(context: vscode.ExtensionContext) {	
	console.log('"ilybTE" is now active!');
	let dispStart = vscode.commands.registerCommand('ilybte.startSharing', () => {
		if (!connectedToServer) {
			ios = new Server(portNum);

			console.log("Started server at port %s", portNum);
	
			ios.on("connection", (socket: any) => { // fix typing
				console.log("Successfully connected");

				socket.emit("hello", "world");

				socket.on("howdy", (arg: string) => {
					console.log(arg);
				});	

				socket.on("disconnect", (reason: any) => { // fix typing
					console.log("Disconnected");
				});
			});

			connectedToServer = true;
			isSource = true;
		}
	});

	let dispJoin = vscode.commands.registerCommand('ilybte.joinSharing', () => {
		if (!connectedToServer) {
			socket = io("ws://localhost:" + portNum);

			console.log("Joined a sharing at port %s", portNum);

			socket.on("connect", () => {
				console.log("Connected to socket");
			});

			socket.on("disconnect", () => {
				console.log("Disconnected from socket");
			})

			socket.on("hello", (arg: string) => {
				console.log(arg);
			});

			socket.emit("howdy", "stranger");
			connectedToServer = true;
			isSource = false;
		}
	});

	
	function insertNode(node: TreeNode) {
		if (isSource) {

		}
	}	
	function deleteNode(info: TreeNode) {

	}

	vscode.workspace.onDidChangeTextDocument((event) => {
		clientId = + isSource;
		let s = isSource ? ios : socket;

		// let node: TreeNode = TreeNode();
		

		// s.emit("insert", node);

		console.log(event.contentChanges[0]);
	});

	context.subscriptions.push(dispStart);
	context.subscriptions.push(dispJoin);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// TODO:
	// Disable the socket
	// Dallocate the tree representing document?? sync one last time???
	if (connectedToServer) {
		if (isSource) {
			// NEED SOCKET TO BE GLOBAL???
		}
	}
	connectedToServer = false;
}

function parseNodeInfo(info: string) {
	const obj: TreeNode = JSON.parse(info);
	return obj;
}


