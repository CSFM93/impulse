/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import * as os from "os";

import { checkIfDirExists, getText } from "./fileManager";

export function getOS() {
  if (/^win/i.test(os.platform())) {
    return "Windows";
  } else {
    return "Unix";
  }
}

export function moveElementInArray(array: any, from: number, to: number) {
  let nrOfDeletedEl = 1;
  const element = array.splice(from, nrOfDeletedEl)[0];
  nrOfDeletedEl = 0;
  array.splice(to, nrOfDeletedEl, element);
  return array;
}

export function rememberQuickPickChoice(
  command: string,
  choice: string,
  context: vscode.ExtensionContext
) {
  context.globalState.update(`Choice.${command}`, choice);
}

export function getManifest(manifestPath: string) {
  let impulseManifestPath = manifestPath.replace(
    "package.json",
    "impulse.json"
  );
  let fileExists = checkIfDirExists(manifestPath);
  if (fileExists) {
    let text = getText(impulseManifestPath);
    return text;
  } else {
    return undefined;
  }
}

export function getTerminal(terminalName: string) {
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

export function runCommandInNewTerminal(command: string, terminalName: string) {
  const terminal = vscode.window.createTerminal(terminalName);
  terminal.show();
  terminal.sendText(command);
}

export function configureTerminal(terminalName: string) {
  let terminalOptions = {
    name: terminalName,
    shellPath: getOS() === "Unix" ? "/bin/bash" : "cmd.exe",
    env: getLocalnetVariables(),
  };

  let terminal = vscode.window.createTerminal(
    terminalOptions as vscode.TerminalOptions
  );

  return terminal;
}

export function getNetworkConfig() {
  const workbenchConfig = vscode.workspace.getConfiguration("impulse");
  let config = JSON.parse(JSON.stringify(workbenchConfig));
  return config;
}

export function setNearEnv(network: string) {
  let config = getNetworkConfig();
  let nearEnv = config[network.toLowerCase()].nearEnv;
  let command =
    getOS() === "Unix"
      ? `export NEAR_ENV="${nearEnv}" && `
      : `set NEAR_ENV=${nearEnv}& `;
  return command;
}

export function getLocalnetVariables() {
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

export function runCommand(terminalName: string, command: string) {
  let terminal = getTerminal(terminalName);

  if (terminal === undefined) {
    terminal = configureTerminal(terminalName);
    terminal.show();
    terminal.sendText(command);
  } else {
    terminal.show();
    terminal.sendText(command);
  }
}
