"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = exports.deploy = exports.testOrCompile = void 0;
const fileManager_1 = require("../helpers/fileManager");
const quickPick_1 = require("../helpers/quickPick");
const utils_1 = require("../helpers/utils");
async function testOrCompile(context, contract, keyword) {
    let command = "";
    let packageFileText = (0, fileManager_1.getText)(contract.manifestPath);
    let scriptKeys = Object.keys(packageFileText.scripts);
    let options = [];
    let icon = keyword === "test" ? "$(test-view-icon)" : "$(package)";
    scriptKeys.map((key) => {
        if (key.includes(keyword)) {
            let option = {
                label: `${icon}    ${key}`,
                detail: `${packageFileText.scripts[key]}`,
                description: ``,
                value: packageFileText.scripts[key],
            };
            options.push(option);
        }
    });
    if (options.length > 0) {
        let placeHolder = "Choose a script to run";
        let result = await (0, quickPick_1.showQuickPick)(options, placeHolder);
        if (result !== undefined) {
            let workDir = contract.manifestPath
                .replace("/package.json", "")
                .replace("\\package.json", "");
            command = `cd ${workDir} && ${result.value}`;
            let terminalName = `Impulse ${contract.name}`;
            (0, utils_1.runCommand)(terminalName, command);
        }
    }
}
exports.testOrCompile = testOrCompile;
async function deploy(contract, network, account) {
    let terminalName = `Impulse ${contract.projectName}`;
    let command = (0, utils_1.setNearEnv)(network);
    command +=
        account !== "Dev-account"
            ? `near deploy --accountId ${account} --wasmFile ${contract.binaryPath}`
            : `near dev-deploy --wasmFile ${contract.binaryPath}`;
    (0, utils_1.runCommand)(terminalName, command);
}
exports.deploy = deploy;
async function call(commandSpec) {
    let network = commandSpec.network;
    let account = commandSpec.account;
    let terminalName = `Impulse ${commandSpec.projectName}`;
    let command = (0, utils_1.setNearEnv)(network);
    command += `near ${commandSpec.methodType} ${commandSpec.contractName} `;
    command += `${commandSpec.methodName} ${commandSpec.commandArgs} `;
    command += `--accountId ${account}`;
    if (commandSpec.methodType === "call" && commandSpec.gas > 0) {
        if (commandSpec.token === "Near") {
            command += ` --deposit ${commandSpec.gas}`;
        }
        else {
            command += ` --depositYocto ${commandSpec.gas}`;
        }
    }
    (0, utils_1.runCommand)(terminalName, command);
}
exports.call = call;
//# sourceMappingURL=mainCommands.js.map