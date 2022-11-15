"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityBarViewProvider = void 0;
const vscode = require("vscode");
class ActivityBarViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
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
                case 'selectAccount':
                    vscode.commands.executeCommand("impulse.selectAccount");
                    break;
                case 'selectNetwork':
                    vscode.commands.executeCommand("impulse.selectNetwork");
                    break;
                case 'accountManager':
                    vscode.commands.executeCommand("impulse.accountManager");
                    break;
            }
        });
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'mainCommandsView', 'main.js'));
        const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'activityBarView', 'styles.css'));
        const testIconURI = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'assets', 'test.svg'));
        const nonce = getNonce();
        return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
            <link rel="stylesheet" href="${stylesUri}">
        
            <title>Impulse</title>
        </head>
        
        <body class="bg-dark">
            <div class="list-group ">
            <a href="#" class="list-group-item list-group-item-action bg-dark text-light fs-6 border-0"><img
            src="${testIconURI}" style="height:24px;width: 24px;"> Test </a>
    <a href="#" class="list-group-item list-group-item-action text-light bg-dark  fs-5 border-0">Compile</a>
    <a href="#" class="list-group-item list-group-item-action text-light bg-dark  fs-5 border-0">Deploy</a>
            <script nonce="${nonce}" src="${scriptUri}"></script>
            <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
                crossorigin="anonymous"></script>
        </body>
        
        </html>`;
    }
}
exports.ActivityBarViewProvider = ActivityBarViewProvider;
ActivityBarViewProvider.viewType = 'impulse.activitybarView';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=activityBarViewProvider.js.map