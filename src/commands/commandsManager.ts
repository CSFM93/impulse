import * as vscode from "vscode";
import { createQuickPickOptions, showQuickPick } from "../helpers/quickPick";
import * as mainCommands from "./mainCommands";
import {
  rememberQuickPickChoice,
  runCommandInNewTerminal,
} from "../helpers/utils";
import {
  AccountsManagerPanel,
  getWebviewOptions,
} from "../providers/accountsManagerViewProvider";
import { CallContractPanel } from "../providers/callContractViewProvider";

export function registerCommands(context: vscode.ExtensionContext) {
  let keys = context.globalState.keys();
  if (keys.length === 0) {
    context.globalState.update("Near.Network", "Testnet");
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.createProject", async () => {
      let command = "npx create-near-app@latest";
      let terminalName = "Impulse";
      runCommandInNewTerminal(command, terminalName);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.test", async () => {
      let placeHolder = "Choose a contract to test";
      let options = await createQuickPickOptions("test", context);
      let result = await showQuickPick(options, placeHolder);
      if (result !== undefined) {
        rememberQuickPickChoice("test", result.value.manifestPath, context);
        mainCommands.testOrCompile(context, result.value, "test");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.compile", async () => {
      let placeHolder = "Choose a contract to compile";
      let options = await createQuickPickOptions("compile", context);
      let result = await showQuickPick(options, placeHolder);
      if (result !== undefined) {
        rememberQuickPickChoice("compile", result.value.manifestPath, context);
        mainCommands.testOrCompile(context, result.value, "build");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.deploy", async () => {
      let placeHolder = "Choose a contract to deploy";
      let options = await createQuickPickOptions("deploy", context);
      let result = await showQuickPick(options, placeHolder);
      let network = context.globalState.get("Near.Network");
      let account = context.globalState.get("Near.Account");

      if (result !== undefined) {
        if(result.description.includes('Dev-Deploy')){
          account = "Dev-account";
        }
        rememberQuickPickChoice("deploy", result.value.manifestPath, context);
        mainCommands.deploy(result.value, network, account);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.call", async () => {
      let placeHolder = "Choose a contract to call";
      let options = await createQuickPickOptions("call", context);
      let result = await showQuickPick(options, placeHolder);
      if (result !== undefined) {
        rememberQuickPickChoice("call", result.value.manifestPath, context);
        CallContractPanel.createOrShow(
          context.extensionUri,
          result.value.manifestPath,
          context
        );
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.selectAccount", async () => {
      let placeHolder = "Select an account";
      let options = await createQuickPickOptions("selectAccount", context);
      if (options?.length !== 0) {
        let result = await showQuickPick(options, placeHolder);
        if (result !== undefined) {
          context.globalState.update("Near.Account", result.value);
          rememberQuickPickChoice("selectAccount", result.value, context);
          vscode.window.showInformationMessage(
            `Account selected: ${result.value}`
          );
        }
      } else {
        vscode.window.showErrorMessage(
          `Please make sure that you stored your accounts in the .near-credentials directory`
        );
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.selectNetwork", async () => {
      let placeHolder = "Select a network";
      let options = await createQuickPickOptions("selectNetwork", context);
      let result = await showQuickPick(options, placeHolder);
      if (result !== undefined) {
        context.globalState.update("Near.Network", result.value);
        context.globalState.update("Near.Account", '');

        vscode.window.showInformationMessage(
          `Network selected: ${result.value}`
        );
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("impulse.accountManager", () => {
      AccountsManagerPanel.createOrShow(context.extensionUri);
    })
  );

}
