"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainCommandsViewProvider = void 0;
const vscode = require("vscode");
class MainCommandsViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(data => {
            console.log("message", data);
            let msg = JSON.parse(data.value);
            switch (msg.command) {
                case 'test':
                    vscode.commands.executeCommand("impulse.test");
                    break;
                case 'compile':
                    vscode.commands.executeCommand("impulse.compile");
                    break;
                case 'deploy':
                    vscode.commands.executeCommand("impulse.deploy");
                    break;
                case 'call':
                    vscode.commands.executeCommand("impulse.call");
                    break;
                case 'accountManager':
                    vscode.commands.executeCommand("impulse.accountManager");
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'mainCommandsView', 'main.js'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'mainCommandsView', 'main.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'mainCommandsView', 'vscode.css'));
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleMainUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<title>Impulse</title>
			</head>
			<body>
				<ul>
				<button id="Test">Test</button>
				<button id="Compile">Compile</button>
				<button id="accountManager">Account manager</button>
				<button id="Deploy">Deploy</button>
				<button id="Call">Call</button>
				</ul>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
exports.MainCommandsViewProvider = MainCommandsViewProvider;
MainCommandsViewProvider.viewType = 'impulse.mainCommandsView';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=mainCommandsViewProvider.js.map