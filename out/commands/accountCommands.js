"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.sendTokens = exports.getState = exports.createAccount = exports.getAccounts = void 0;
const fileManager_1 = require("../helpers/fileManager");
const utils_1 = require("../helpers/utils");
const path = require("path");
const homedir = require("os").homedir();
const credentialsDir = ".near-credentials";
const credentialsPath = path.join(homedir, credentialsDir);
const testnetWalletPath = path.join(credentialsPath, "testnet");
const localnetWalletPath = path.join(credentialsPath, "localnet");
let selectedNetwork = "Testnet";
let terminalName = `Impulse Account manager`;
async function getAccounts(network) {
    let files = [];
    let accounts = [];
    selectedNetwork = network;
    switch (selectedNetwork) {
        case "Testnet":
            files = (0, fileManager_1.listFiles)(testnetWalletPath);
            if (files !== undefined && files.length > 0) {
                files.map((file) => {
                    if (file.includes(".json")) {
                        accounts.push(file.replace(".json", ""));
                    }
                });
            }
            return accounts;
        case "Localnet":
            files = (0, fileManager_1.listFiles)(localnetWalletPath);
            if (files !== undefined && files.length > 0) {
                files.map((file) => {
                    if (file.includes(".test.near.json")) {
                        accounts.push(file.replace(".json", ""));
                    }
                });
            }
            return accounts;
    }
}
exports.getAccounts = getAccounts;
function createAccount(data) {
    selectedNetwork = data.network;
    let command = (0, utils_1.setNearEnv)(selectedNetwork);
    command += `near create-account ${data.newAccount} `;
    command += `--masterAccount ${data.parentAccount} `;
    command += `--initialBalance ${parseFloat(data.initialBalance)}`;
    (0, utils_1.runCommand)(terminalName, command);
}
exports.createAccount = createAccount;
function getState(data) {
    selectedNetwork = data.network;
    let command = (0, utils_1.setNearEnv)(selectedNetwork);
    command += `near state ${data.accountId}`;
    (0, utils_1.runCommand)(terminalName, command);
}
exports.getState = getState;
function sendTokens(data) {
    selectedNetwork = data.network;
    let command = (0, utils_1.setNearEnv)(selectedNetwork);
    command += `near send ${data.sender} ${data.receiver} ${parseFloat(data.amount)}`;
    (0, utils_1.runCommand)(terminalName, command);
}
exports.sendTokens = sendTokens;
function deleteAccount(data) {
    selectedNetwork = data.network;
    let command = (0, utils_1.setNearEnv)(selectedNetwork);
    command += `near delete ${data.account} ${data.beneficiaryAccount}`;
    (0, utils_1.runCommand)(terminalName, command);
}
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=accountCommands.js.map