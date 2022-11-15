"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const vscode = require("vscode");
const quickPick_1 = require("../helpers/quickPick");
const mainCommands = require("./mainCommands");
const utils_1 = require("../helpers/utils");
const accountsManagerViewProvider_1 = require("../providers/accountsManagerViewProvider");
const callContractViewProvider_1 = require("../providers/callContractViewProvider");
function registerCommands(context) {
    let keys = context.globalState.keys();
    if (keys.length === 0) {
        context.globalState.update("Near.Network", "Testnet");
    }
    context.subscriptions.push(vscode.commands.registerCommand("impulse.createProject", async () => {
        let command = "npx create-near-app@latest";
        let terminalName = "Impulse";
        (0, utils_1.runCommandInNewTerminal)(command, terminalName);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("impulse.test", async () => {
        let placeHolder = "Choose a contract to test";
        let options = await (0, quickPick_1.createQuickPickOptions)("test", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            (0, utils_1.rememberQuickPickChoice)("test", result.value.manifestPath, context);
            mainCommands.testOrCompile(context, result.value, "test");
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("impulse.compile", async () => {
        let placeHolder = "Choose a contract to compile";
        let options = await (0, quickPick_1.createQuickPickOptions)("compile", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            (0, utils_1.rememberQuickPickChoice)("compile", result.value.manifestPath, context);
            mainCommands.testOrCompile(context, result.value, "build");
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("impulse.deploy", async () => {
        let placeHolder = "Choose a contract to deploy";
        let options = await (0, quickPick_1.createQuickPickOptions)("deploy", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        let network = context.globalState.get("Near.Network");
        let account = context.globalState.get("Near.Account");
        if (result !== undefined) {
            if (result.description.includes('Dev-Deploy')) {
                account = "Dev-account";
            }
            (0, utils_1.rememberQuickPickChoice)("deploy", result.value.manifestPath, context);
            mainCommands.deploy(result.value, network, account);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("impulse.call", async () => {
        let placeHolder = "Choose a contract to call";
        let options = await (0, quickPick_1.createQuickPickOptions)("call", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            (0, utils_1.rememberQuickPickChoice)("call", result.value.manifestPath, context);
            callContractViewProvider_1.CallContractPanel.createOrShow(context.extensionUri, result.value.manifestPath, context);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("impulse.selectAccount", async () => {
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
    context.subscriptions.push(vscode.commands.registerCommand("impulse.selectNetwork", async () => {
        let placeHolder = "Select a network";
        let options = await (0, quickPick_1.createQuickPickOptions)("selectNetwork", context);
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            context.globalState.update("Near.Network", result.value);
            context.globalState.update("Near.Account", '');
            vscode.window.showInformationMessage(`Network selected: ${result.value}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("impulse.accountManager", () => {
        accountsManagerViewProvider_1.AccountsManagerPanel.createOrShow(context.extensionUri);
    }));
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=commandsManager.js.map