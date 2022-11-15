"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewOptions = exports.CallContractPanel = void 0;
const vscode = require("vscode");
const accountCommands_1 = require("../commands/accountCommands");
const fileManager_1 = require("../helpers/fileManager");
const utils_1 = require("../helpers/utils");
const mainCommands_1 = require("../commands/mainCommands");
class CallContractPanel {
    constructor(panel, extensionUri, manifestPath, context) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._manifestPath = manifestPath;
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(async (data) => {
            let msg = JSON.parse(data.value);
            switch (msg.command) {
                case "getAccounts":
                    let accounts = await (0, accountCommands_1.getAccounts)(msg.selectedNetwork);
                    let message = { type: "accounts", accounts: accounts };
                    this.sendMessage(message);
                    break;
                case "getManifest":
                    let manifest = (0, utils_1.getManifest)(this._manifestPath);
                    this.sendMessage({ type: "manifest", value: manifest });
                    break;
                case "showNotification":
                    vscode.window.showErrorMessage(msg.text);
                    break;
                case "callMethod":
                    let projectName = (0, fileManager_1.getText)(this._manifestPath).name;
                    msg.projectName = projectName;
                    (0, mainCommands_1.call)(msg);
                    break;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri, manifestPath, context) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (CallContractPanel.currentPanel) {
            CallContractPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(CallContractPanel.viewType, "Call contract view", column || vscode.ViewColumn.One, getWebviewOptions(extensionUri));
        CallContractPanel.currentPanel = new CallContractPanel(panel, extensionUri, manifestPath, context);
    }
    static revive(panel, extensionUri, manifestPath, context) {
        CallContractPanel.currentPanel = new CallContractPanel(panel, extensionUri, manifestPath, context);
    }
    sendMessage(message) {
        this._panel.webview.postMessage(message);
    }
    dispose() {
        CallContractPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "callContractView", "main.js"));
        const vueURI = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "callContractView", "js", "vue.global.js"));
        const nonce = getNonce();
        return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

            <title>Call contract</title>
        </head>
        
        <body class="bg-dark">
            <div id="app"></div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
            <script nonce="${nonce}" src="${vueURI}"></script>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        
        </html>`;
    }
}
exports.CallContractPanel = CallContractPanel;
CallContractPanel.viewType = "CallContract";
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function getWebviewOptions(extensionUri) {
    return {
        enableScripts: true,
        localResourceRoots: [extensionUri],
    };
}
exports.getWebviewOptions = getWebviewOptions;
//# sourceMappingURL=callContractViewProvider.js.map