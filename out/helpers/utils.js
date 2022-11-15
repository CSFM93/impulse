"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = exports.getLocalnetVariables = exports.setNearEnv = exports.getNetworkConfig = exports.configureTerminal = exports.runCommandInNewTerminal = exports.getTerminal = exports.getManifest = exports.rememberQuickPickChoice = exports.moveElementInArray = exports.getOS = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const vscode = require("vscode");
const os = require("os");
const fileManager_1 = require("./fileManager");
function getOS() {
    if (/^win/i.test(os.platform())) {
        return "Windows";
    }
    else {
        return "Unix";
    }
}
exports.getOS = getOS;
function moveElementInArray(array, from, to) {
    let nrOfDeletedEl = 1;
    const element = array.splice(from, nrOfDeletedEl)[0];
    nrOfDeletedEl = 0;
    array.splice(to, nrOfDeletedEl, element);
    return array;
}
exports.moveElementInArray = moveElementInArray;
function rememberQuickPickChoice(command, choice, context) {
    context.globalState.update(`Choice.${command}`, choice);
}
exports.rememberQuickPickChoice = rememberQuickPickChoice;
function getManifest(manifestPath) {
    let impulseManifestPath = manifestPath.replace("package.json", "impulse.json");
    let fileExists = (0, fileManager_1.checkIfDirExists)(manifestPath);
    if (fileExists) {
        let text = (0, fileManager_1.getText)(impulseManifestPath);
        return text;
    }
    else {
        return undefined;
    }
}
exports.getManifest = getManifest;
function getTerminal(terminalName) {
    let terminals = vscode.window.terminals;
    if (terminals.length > 0) {
        for (let i = 0; i < terminals.length; i++) {
            if (terminals[i].name === terminalName) {
                return terminals[i];
            }
        }
    }
    return undefined;
}
exports.getTerminal = getTerminal;
function runCommandInNewTerminal(command, terminalName) {
    const terminal = vscode.window.createTerminal(terminalName);
    terminal.show();
    terminal.sendText(command);
}
exports.runCommandInNewTerminal = runCommandInNewTerminal;
function configureTerminal(terminalName) {
    let terminalOptions = {
        name: terminalName,
        shellPath: getOS() === "Unix" ? "/bin/bash" : "cmd.exe",
        env: getLocalnetVariables(),
    };
    let terminal = vscode.window.createTerminal(terminalOptions);
    return terminal;
}
exports.configureTerminal = configureTerminal;
function getNetworkConfig() {
    const workbenchConfig = vscode.workspace.getConfiguration("impulse");
    let config = JSON.parse(JSON.stringify(workbenchConfig));
    return config;
}
exports.getNetworkConfig = getNetworkConfig;
function setNearEnv(network) {
    let config = getNetworkConfig();
    let nearEnv = config[network.toLowerCase()].nearEnv;
    let command = getOS() === "Unix"
        ? `export NEAR_ENV="${nearEnv}" && `
        : `set NEAR_ENV=${nearEnv}& `;
    return command;
}
exports.setNearEnv = setNearEnv;
function getLocalnetVariables() {
    const workbenchConfig = vscode.workspace.getConfiguration("impulse");
    let config = JSON.parse(JSON.stringify(workbenchConfig));
    let nearEnv = config.localnet.nearEnv;
    let nearCLILocalnetNetworkId = config.localnet.nearCLILocalnetNetworkId;
    let nearNodeURL = config.localnet.nearNodeURL;
    let nearCLILocalnetKeyPath = config.localnet.nearCLILocalnetKeyPath;
    let nearWalletURL = config.localnet.nearWalletURL;
    let nearHelperURL = config.localnet.nearHelperURL;
    let nearHelperAccount = config.localnet.nearHelperAccount;
    let nearExplorerURL = config.localnet.nearExplorerURL;
    let localNetVariables = {
        NEAR_ENV: nearEnv,
        NEAR_CLI_LOCALNET_NETWORK_ID: nearCLILocalnetNetworkId,
        NEAR_NODE_URL: nearNodeURL,
        NEAR_CLI_LOCALNET_KEY_PATH: nearCLILocalnetKeyPath,
        NEAR_WALLET_URL: nearWalletURL,
        NEAR_HELPER_URL: nearHelperURL,
        NEAR_HELPER_ACCOUNT: nearHelperAccount,
        NEAR_EXPLORER_URL: nearExplorerURL,
    };
    return localNetVariables;
}
exports.getLocalnetVariables = getLocalnetVariables;
function runCommand(terminalName, command) {
    let terminal = getTerminal(terminalName);
    if (terminal === undefined) {
        terminal = configureTerminal(terminalName);
        terminal.show();
        terminal.sendText(command);
    }
    else {
        terminal.show();
        terminal.sendText(command);
    }
}
exports.runCommand = runCommand;
//# sourceMappingURL=utils.js.map