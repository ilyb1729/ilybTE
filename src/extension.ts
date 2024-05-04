// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { io } from 'socket.io-client';
import { Server } from 'socket.io';
import { Socket } from 'dgram';
import { connected } from 'process';
import { connect } from 'http2';

let connectedToServer = false;
let isSource = false;

// List of change objects
let uncommunicatedChanged: TreeNode[] = [];

const portNum = 3000;

// TODO:
// How can I tell when someon eleaves the session so that things need to be resynced?
// 		Oh a message saying you joined and request new info

export function activate(context: vscode.ExtensionContext) {
	// TODO:
	// Properly type this idfk what vscode automatically is doing
	// Properly handle if things disconnect
	let ios: any = null; // should be Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
	let socket: any | null = null; // should be Socket<DefaultEventsMap, DefaultEventsMap>
	
	console.log('"ilybTE" is now active!');
	let dispStart = vscode.commands.registerCommand('ilybte.startSharing', () => {
		if (!connectedToServer) {
			const ios = new Server(portNum);

			console.log("Started server at port %s", portNum);

			ios.on("connection", (socket) => {
				socket.emit("hello", "world");

				socket.on("howdy", (arg: string) => {
					console.log(arg);
				});
			});

			connectedToServer = true;
			isSource = true;
		}
	});

	let dispJoin = vscode.commands.registerCommand('ilybte.joinSharing', () => {
		if (!connectedToServer) {
			
			const socket = io("ws://localhost:" + portNum);

			console.log("Joined a sharing at port %s", portNum);

			socket.on("connect", () => {
				console.log("Connected to socket");
			});

			socket.on("disconnect", () => {
				console.log("Disconnected from socket");
			})

			socket.on("hello", (arg) => {
				console.log(arg);
			});

			socket.emit("howdy", "stranger");
			connectedToServer = true;
			isSource = false;
		}
	});

	let clientId = + isSource;
	
	function insertNode(node: TreeNode, ) {
		if (!connectedToServer) { return; }
	}	
	function deleteNode(info: TreeNode) {

	}

	vscode.workspace.onDidChangeTextDocument((event) => {
		console.log(event.contentChanges);
	});

	context.subscriptions.push(dispStart);
	context.subscriptions.push(dispJoin);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// TODO:
	// Disconnect from the server???
	// Dallocate the tree representing document?? sync one last time???
	if (connectedToServer) {

	}
	connectedToServer = false;
}

function parseNodeInfo(info: string) {
	const obj: TreeNode = JSON.parse(info);
	return obj;
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