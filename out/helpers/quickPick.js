"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showQuickPick = exports.createQuickPickOptions = void 0;
const vscode_1 = require("vscode");
const accountCommands_1 = require("../commands/accountCommands");
const contractIdentifier_1 = require("./contractIdentifier");
const utils_1 = require("./utils");
async function createQuickPickOptions(command, context) {
    let network = context.globalState.get("Near.Network");
    let allContracts = await (0, contractIdentifier_1.getContractsDirectories)();
    let options = [];
    switch (command) {
        case "test": {
            options = testOrCompile(context, command, allContracts);
            return options;
        }
        case "compile": {
            options = testOrCompile(context, command, allContracts);
            return options;
        }
        case "deploy": {
            let allCompiledContracts = await (0, contractIdentifier_1.getCompiledContracts)();
            let account = context.globalState.get("Near.Account");
            if (account === undefined) {
                allCompiledContracts.map((contract) => {
                    let devOption = {
                        label: `$(cloud-upload)    ${contract.projectName}`,
                        detail: `Language: ${contract.language}, Network: ${network}, Path: ${contract.binaryPath}`,
                        description: `Dev-Deploy ${contract.binaryName} To Dev Account`,
                        value: contract,
                    };
                    options.push(devOption);
                });
                options = organizeOptions(options, context, command);
                return options;
            }
            allCompiledContracts.map((contract) => {
                let option = {
                    label: `$(cloud-upload)    ${contract.projectName}`,
                    detail: `Language: ${contract.language}, Network: ${network}, Path: ${contract.binaryPath}`,
                    description: `Deploy ${contract.binaryName} To account ${account}`,
                    value: contract,
                };
                options.push(option);
                let devOption = {
                    label: `$(cloud-upload)    ${contract.projectName}`,
                    detail: `Language: ${contract.language}, Network: ${network}, Path: ${contract.binaryPath}`,
                    description: `Dev-Deploy ${contract.binaryName} To Dev Account`,
                    value: contract,
                };
                options.push(devOption);
            });
            options = organizeOptions(options, context, command);
            return options;
        }
        case "call": {
            let allContracts = await (0, contractIdentifier_1.getContractsDirectories)();
            allContracts.map((contract) => {
                let option = {
                    label: `$(notebook-execute)    ${contract.name}`,
                    detail: `Language: ${contract.language}, Path: ${contract.manifestPath}`,
                    description: `Call contract ${contract.name}`,
                    value: contract,
                };
                options.push(option);
            });
            options = organizeOptions(options, context, command);
            return options;
        }
        case "selectAccount": {
            if (network !== undefined) {
                let accounts = await (0, accountCommands_1.getAccounts)(network);
                accounts?.map((account) => {
                    let option = {
                        label: `$(account)    ${account}`,
                        detail: `Network: ${network}`,
                        description: "",
                        value: `${account}`,
                    };
                    options.push(option);
                });
            }
            return options;
        }
        case "selectNetwork": {
            options = [
                {
                    label: "$(settings-more-action)    Testnet",
                    detail: "This network is intended for testing all aspects of the NEAR platform prior to mainnet deployment.",
                    description: "",
                    value: "Testnet",
                },
                {
                    label: "$(settings-more-action)    Localnet",
                    detail: "This network is intended for developers who want to work with the NEAR platform independent of the public blockchain. Make sure you are running a Kurtosis Localnet before choosing this option",
                    description: "Kurtosis",
                    value: "Localnet",
                },
            ];
            return options;
        }
    }
}
exports.createQuickPickOptions = createQuickPickOptions;
async function showQuickPick(options, placeHolder) {
    let result = await vscode_1.window.showQuickPick(options, {
        placeHolder: placeHolder,
    });
    return result;
}
exports.showQuickPick = showQuickPick;
function testOrCompile(context, command, allContracts) {
    let options = [];
    let icon = command === "test" ? "$(test-view-icon)" : "$(package)";
    allContracts.map((contract) => {
        let option = {
            label: `${icon}    ${contract.name}`,
            detail: `Language: ${contract.language}, path: ${contract.manifestPath}`,
            description: `${command} ${contract.name} `,
            value: contract,
        };
        options.push(option);
    });
    options = organizeOptions(options, context, command);
    return options;
}
function organizeOptions(options, context, command) {
    let previousChoice = context.globalState.get(`Choice.${command}`);
    if (previousChoice !== undefined) {
        for (let i = 0; i < options.length; i++) {
            if (previousChoice === options[i].value.manifestPath) {
                options = (0, utils_1.moveElementInArray)(options, i, 0);
                break;
            }
        }
    }
    return options;
}
//# sourceMappingURL=quickPick.js.map