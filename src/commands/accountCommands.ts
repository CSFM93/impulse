import { getText, listFiles } from "../helpers/fileManager";
import { setNearEnv, runCommand } from "../helpers/utils";
import * as vscode from "vscode";

const path = require("path");
const homedir = require("os").homedir();

const credentialsDir = ".near-credentials";
const credentialsPath = path.join(homedir, credentialsDir);

const testnetWalletPath = path.join(credentialsPath, "testnet");
const localnetWalletPath = path.join(credentialsPath, "localnet");

let selectedNetwork = "Testnet";
let terminalName = `Impulse Account manager`;

export async function getAccounts(network: string) {
  let files: string[] | undefined = [];
  let accounts: string[] = [];
  selectedNetwork = network;

  switch (selectedNetwork) {
    case "Testnet":
      files = listFiles(testnetWalletPath);
      if (files !== undefined && files.length > 0) {
        files.map((file) => {
          if (file.includes(".json")) {
            accounts.push(file.replace(".json", ""));
          }
        });
      }
      
      return accounts;

    case "Localnet":
      files = listFiles(localnetWalletPath);
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



type CreateAccountsArgs = {
  command: string;
  network: string;
  parentAccount: string;
  newAccount: string;
  initialBalance: string;
};

export function createAccount(data: CreateAccountsArgs) {
  selectedNetwork = data.network;
  let command: string = setNearEnv(selectedNetwork);

  command += `near create-account ${data.newAccount} `;
  command += `--masterAccount ${data.parentAccount} `;
  command += `--initialBalance ${parseFloat(data.initialBalance)}`;
  runCommand(terminalName, command);
}

type GetBalanceArgs = {
  command: string;
  network: string;
  accountId: string;
};

export function getState(data: GetBalanceArgs) {
  selectedNetwork = data.network;
  let command: string = setNearEnv(selectedNetwork);

  command += `near state ${data.accountId}`;
  runCommand(terminalName, command);
}

type SendTokensArgs = {
  command: string;
  network: string;
  sender: string;
  receiver: string;
  amount: string;
};

export function sendTokens(data: SendTokensArgs) {
  selectedNetwork = data.network;
  let command: string = setNearEnv(selectedNetwork);

  command += `near send ${data.sender} ${data.receiver} ${parseFloat(
    data.amount
  )}`;
  runCommand(terminalName, command);
}

type DeleteAccountArgs = {
  command: string;
  network: string;
  account: string;
  beneficiaryAccount: string;
};

export function deleteAccount(data: DeleteAccountArgs) {
  selectedNetwork = data.network;
  let command: string = setNearEnv(selectedNetwork);

  command += `near delete ${data.account} ${data.beneficiaryAccount}`;
  runCommand(terminalName, command);
}
