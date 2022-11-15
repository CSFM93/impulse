"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const vscode = require("vscode");
const quickPick_1 = require("./quickPick");
const mainCommands = require("../commands/mainCommands");
const utils_1 = require("./utils");
const accountsManagerViewProvider_1 = require("../providers/accountsManagerViewProvider");
const callContractViewProvider_1 = require("../providers/callContractViewProvider");
function registerCommands(context) {
    let keys = context.globalState.keys();
    if (keys.length === 0) {
        context.globalState.update("Near.Network", "Testnet");
    }
    console.log("registering commands");
    context.subscriptions.push(vscode.commands.registerCommand('impulse.test', async () => {
        console.log("test");
        let placeHolder = "Choose a contract to test";
        let options = await (0, quickPick_1.createQuickPickOptions)("test", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            console.log('result', result.value);
            (0, utils_1.rememberQuickPickChoice)("test", result.value.manifestPath, context);
            mainCommands.testOrCompile(context, result.value, "test");
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.compile', async () => {
        console.log("compile");
        let placeHolder = "Choose a contract to compile";
        let options = await (0, quickPick_1.createQuickPickOptions)("compile", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            console.log('result', result.value);
            (0, utils_1.rememberQuickPickChoice)("compile", result.value.manifestPath, context);
            mainCommands.testOrCompile(context, result.value, "build");
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.deploy', async () => {
        console.log("deploy");
        let placeHolder = "Choose a contract to deploy";
        let options = await (0, quickPick_1.createQuickPickOptions)("deploy", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        let network = context.globalState.get("Near.Network");
        let account = context.globalState.get("Near.Account");
        if (result !== undefined) {
            console.log('result', result.value);
            (0, utils_1.rememberQuickPickChoice)("deploy", result.value.manifestPath, context);
            mainCommands.deploy(result.value, network, account);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.call', async () => {
        console.log("call");
        let placeHolder = "Choose a contract to call";
        let options = await (0, quickPick_1.createQuickPickOptions)("call", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            console.log('result', result.value);
            (0, utils_1.rememberQuickPickChoice)("call", result.value.manifestPath, context);
            callContractViewProvider_1.CallContractPanel.createOrShow(context.extensionUri, result.value.manifestPath, context);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.selectAccount', async () => {
        console.log("select an network");
        let placeHolder = "Select an account";
        let options = await (0, quickPick_1.createQuickPickOptions)("selectAccount", context);
        if (options?.length !== 0) {
            let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
            if (result !== undefined) {
                context.globalState.update("Near.Account", result.value);
                (0, utils_1.rememberQuickPickChoice)("selectAccount", result.value, context);
                vscode.window.showInformationMessage(`Account selected: ${result.value}`);
            }
        }
        else {
            vscode.window.showErrorMessage(`Please make sure that you stored your accounts in the .near-credentials directory`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.selectNetwork', async () => {
        console.log("select  a network");
        let placeHolder = "Select a network";
        let options = await (0, quickPick_1.createQuickPickOptions)("selectNetwork", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            context.globalState.update("Near.Network", result.value);
            vscode.window.showInformationMessage(`Network selected: ${result.value}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.accountManager', () => {
        console.log("accountManager");
        accountsManagerViewProvider_1.AccountsManagerPanel.createOrShow(context.extensionUri);
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(accountsManagerViewProvider_1.AccountsManagerPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel, state) {
                console.log(`Got state: ${state}`);
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = (0, accountsManagerViewProvider_1.getWebviewOptions)(context.extensionUri);
                accountsManagerViewProvider_1.AccountsManagerPanel.revive(webviewPanel, context.extensionUri);
            }
        });
    }
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=commandsManager.js.map