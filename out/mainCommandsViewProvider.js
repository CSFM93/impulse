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
                    {
                        vscode.commands.executeCommand("impulse.test");
                        break;
                    }
                case 'compile':
                    {
                        vscode.commands.executeCommand("impulse.compile");
                        break;
                    }
                case 'call':
                    {
                        vscode.commands.executeCommand("impulse.call");
                        break;
                    }
            }
        });
    }
    addColor() {
        if (this._view) {
            this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
            this._view.webview.postMessage({ type: 'addColor' });
        }
    }
    clearColors() {
        if (this._view) {
            this._view.webview.postMessage({ type: 'clearColors' });
        }
    }
    _getHtmlForWebview(webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media/mainCommandsView', 'main.js'));
        // Do the same for the stylesheet.
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media/mainCommandsView', 'main.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media/mainCommandsView', 'vscode.css'));
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
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