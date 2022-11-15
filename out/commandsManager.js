"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const vscode = require("vscode");
function registerCommands(context) {
    getContractsDirectories();
    let keys = context.globalState.keys();
    console.log("keys", keys);
    if (keys.length === 0) {
        context.globalState.update("Near.Network", "Testnet");
    }
    console.log("Near.Network", context.globalState.get("Near.Network"));
    console.log("registering commands");
    context.subscriptions.push(vscode.commands.registerCommand('impulse.test', async () => {
        console.log("test");
        let allContracts = await getContractsDirectories();
        let network = context.globalState.get("Near.Network");
        let options = [];
        allContracts.map(contract => {
            let option = {
                label: `$(test-view-icon)    ${contract.dirName}`,
                detail: `Language: ${contract.type}, Network: ${network}, path: ${contract.manifestPath}`,
                description: `Test ${contract.dirName} `,
                value: JSON.stringify(contract)
            };
            options.push(option);
        });
        const result = await vscode.window.showQuickPick(options, {
            placeHolder: 'Choose a contract to test'
        });
        if (result !== undefined) {
            vscode.window.showInformationMessage(`contract selected: ${result}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.compile', () => {
        console.log("compile");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.call', () => {
        console.log("call");
    }));
    context.subscriptions.push(vscode.commands.registerCommand('impulse.selectNetwork', async () => {
        console.log("select  a network");
        let options = [
            {
                label: '$(settings-more-action)    Testnet',
                detail: "This network is intended for testing all aspects of the NEAR platform prior to mainnet deployment."
            },
            {
                label: '$(settings-more-action)    Localnet',
                detail: "This network is intended for developers who want to work with the NEAR platform independent of the public blockchain. Make sure you are running a Kurtosis Localnet before choosing this option",
                description: "Kurtosis"
            }
        ];
        const result = await vscode.window.showQuickPick(options, {
            placeHolder: 'Choose a network'
        });
        if (result !== undefined) {
            vscode.window.showInformationMessage(`Network selected: ${result}`);
            context.globalState.update("Near.Network", result);
        }
    }));
}
exports.registerCommands = registerCommands;
async function getContractsDirectories() {
    const rustContracts = await vscode.workspace.findFiles("**/Cargo.toml");
    const assemblyScriptContracts = await vscode.workspace.findFiles("**/package.json", "**/node_modules/**");
    console.log("length:", rustContracts.length);
    let allContracts = [];
    rustContracts.map(rustContract => {
        let splitPath = rustContract.path.split("/");
        let dirName = splitPath[splitPath.length - 2];
        let contract = {
            type: "Rust",
            dirName: dirName,
            manifestPath: rustContract.path
        };
        console.log("contract", contract);
        allContracts.push(contract);
    });
    assemblyScriptContracts.map(AsContract => {
        let splitPath = AsContract.path.split("/");
        let dirName = splitPath[splitPath.length - 2];
        let contract = {
            type: "AssemblyScript",
            dirName: dirName,
            manifestPath: AsContract.path
        };
        console.log("contract", contract);
        allContracts.push(contract);
    });
    return allContracts;
}
//# sourceMappingURL=commandsManager.js.map