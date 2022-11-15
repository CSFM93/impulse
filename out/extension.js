"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const commandsManager_1 = require("./commands/commandsManager");
const contractIdentifier_1 = require("./helpers/contractIdentifier");
const activity_bar_view_1 = require("./views/activity_bar_view");
const explorer_view_1 = require("./views/explorer_view");
async function showWelcomePage(context) {
    setTimeout(async () => {
        let contracts = await (0, contractIdentifier_1.getContractsDirectories)();
        if (contracts.length === 0) {
            vscode.commands.executeCommand("setContext", "impulse.showWelcomePage", true);
            showWelcomePage(context);
        }
        else {
            vscode.commands.executeCommand("setContext", "impulse.showWelcomePage", false);
            new activity_bar_view_1.ActivityBarView(context);
        }
    }, 1000);
}
async function activate(context) {
    showWelcomePage(context);
    new explorer_view_1.FileExplorerView(context);
    (0, commandsManager_1.registerCommands)(context);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map