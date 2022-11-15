"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewOptions = exports.AccountsManagerPanel = void 0;
const vscode = require("vscode");
const accountCommands_1 = require("../commands/accountCommands");
class AccountsManagerPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
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
                case "createAccount":
                    (0, accountCommands_1.createAccount)(msg);
                    break;
                case "getState":
                    (0, accountCommands_1.getState)(msg);
                    break;
                case "sendTokens":
                    (0, accountCommands_1.sendTokens)(msg);
                    break;
                case "deleteAccount":
                    (0, accountCommands_1.deleteAccount)(msg);
                    break;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (AccountsManagerPanel.currentPanel) {
            AccountsManagerPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel(AccountsManagerPanel.viewType, "Accounts Manager", column || vscode.ViewColumn.One, getWebviewOptions(extensionUri));
        AccountsManagerPanel.currentPanel = new AccountsManagerPanel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        AccountsManagerPanel.currentPanel = new AccountsManagerPanel(panel, extensionUri);
    }
    sendMessage(message) {
        this._panel.webview.postMessage(message);
    }
    dispose() {
        AccountsManagerPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "accountManagerView", "main.js"));
        const nonce = getNonce();
        return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
        <title>Account Manager</title>
    </head>
    
    <body class="bg-dark">
        <div class="card position-absolute top-50 start-50 translate-middle bg-dark" style="width: 90%;height: 95%">
            <div class="card-body">
                <div class="container text-center">
                    <div class="row align-items-start">
                        <div class="col-9 pe-3">
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button class="nav-link active" id="nav-create-account-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-create-account" type="button" role="tab"
                                        aria-controls="nav-create-account" aria-selected="true">Create Account</button>
                                    <button class="nav-link " id="nav-account-state-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-account-state" type="button" role="tab"
                                        aria-controls="nav-account-state" aria-selected="false">Get Account
                                        State</button>
                                    <button class="nav-link " id="nav-send-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-send" type="button" role="tab" aria-controls="nav-send"
                                        aria-selected="false">Send Tokens</button>
                                    <button class="nav-link text-danger" id="nav-delete-account-tab" data-bs-toggle="tab"
                                        data-bs-target="#nav-delete-account" type="button" role="tab"
                                        aria-controls="nav-delete-account" aria-selected="false">Delete Account</button>
                                </div>
                            </nav>
                        </div>
                        <div class="col-3 row justify-content-end">
                            <div class="col-12 mt-1">
                                <select class="form-select bg-dark text-primary mt-8" id="selectNetwork">
                                    <option value="Testnet">Testnet</option>
                                    <option value="Localnet">Localnet</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active ps-5" id="nav-create-account" role="tabpanel"
                        aria-labelledby="nav-create-account-tab" tabindex="0">
                        <form id="form-create-account">
                            <div class="mt-5">
                                <div class="col-6">
                                    <label for="selectAccount-tab1" class="col-form-label text-light ">Parent
                                        Account</label>
                                    <div class="row">
                                        <div class="col-10">
                                            <select class="form-select bg-dark text-primary mt-8 selectAccountElement"
                                            id="selectAccount-tab1">
                                        </select>
                                        </div>
                                        <div class="col-2">
                                            <button id="btnRefreshAccounts" class="btn btn-primary "><i class="fa fa-refresh"></i></button>
                                        </div>
                                      
                                    </div>
    
                                </div>
                                <div class="col-5 mt-3">
                                    <label for="inputNewAccountName" class="col-form-label text-light">New account
                                        name</label>
                                    <input type="text" class="form-control bg-dark text-light" id="inputNewAccountName"
                                        name="newAccount">
                                </div>
                                <div class="col-5 mt-2">
                                    <label for="inputOptionalAmount" class="col-form-label text-light">Initial state</label>
                                    <input type="text" class="form-control bg-dark text-light" id="inputInitialBalance"
                                        name="initialBalance">
                                    <div class="form-text">Amount In Near Tokens. This state will be taken from the parent
                                        account</div>
                                </div>
                                <div class="col-3 mt-2">
                                    <button type="submit" class="btn btn-primary">Create account</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="tab-pane fade ps-5" id="nav-account-state" role="tabpanel"
                        aria-labelledby="nav-account-state-tab" tabindex="0">
                        <div class="col-6">
                            <form id="form-account-state">
                                <div class="mt-5">
                                    <div class="col-10">
                                        <label for="selectAccount-tab2" class="col-form-label text-light">Account</label>
                                        <select class="form-select bg-dark text-primary mt-8 selectAccountElement"
                                            id="selectAccount-tab2">
    
                                        </select>
                                    </div>
                                    <div class="col-6 mt-4">
                                        <button type="submit" class="btn btn-primary">Get state</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="tab-pane fade ps-5" id="nav-send" role="tabpanel" aria-labelledby="nav-send-tab"
                        tabindex="0">
                        <form id="form-send-tokens">
                            <div class="mt-5">
                                <div class="col-5">
                                    <label for="selectAccount-tab3" class="col-form-label text-light">Sender
                                        Account</label>
                                    <select class="form-select bg-dark text-primary mt-8 selectAccountElement"
                                        id="selectAccount-tab3">
                                    </select>
                                </div>
                                <div class="col-5 mt-2">
                                    <label for="inputAmount" class="col-form-label text-light">Amount</label>
                                    <input type="text" class="form-control bg-dark text-light" id="inputAmount">
                                    <div class="form-text">Amount In Near Tokens</div>
                                </div>
                                <div class="col-5 mt-2">
                                    <label for="inputReceiverAccount" class="col-form-label text-light">Receiver
                                        account</label>
                                    <input type="text" class="form-control bg-dark text-light" id="inputReceiverAccount">
                                </div>
                                <div class="col-3 mt-3">
                                    <button type="submit" class="btn btn-primary">Send Tokens</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="tab-pane fade ps-5" id="nav-delete-account" role="tabpanel"
                        aria-labelledby="nav-delete-account-tab" tabindex="0">
                        <form id="form-delete-account">
                            <div class="mt-5">
                                <div class="col-5">
                                    <label for="selectAccount-tab4" class="col-form-label text-light">Account</label>
                                    <select class="form-select bg-dark text-primary mt-8 selectAccountElement"
                                        id="selectAccount-tab4">
                                    </select>
                                    <div class="form-text">The account that you wish to delete</div>
                                </div>
                                <div class="col-5 mt-3">
                                    <label for="inputBeneficiaryAccount" class="col-form-label text-light">Beneficiary
                                        account</label>
                                    <input type="text" class="form-control bg-dark text-light" id="inputBeneficiaryAccount">
                                    <div class="form-text">The ID of the account that is going to receive the remaining
                                        account balance of the deleted account.
                                    </div>
                                </div>
    
                            </div>
                            <div class="col-3 mt-4">
                                <button type="submit" class="btn btn-danger">Delete account</button>
                            </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    
            <script nonce="${nonce}" src="${scriptUri}"></script>
            <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
                crossorigin="anonymous"></script>   
    </body>
        
</html>`;
    }
}
exports.AccountsManagerPanel = AccountsManagerPanel;
AccountsManagerPanel.viewType = "AccountsManager";
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
//# sourceMappingURL=accountsManagerViewProvider.js.map