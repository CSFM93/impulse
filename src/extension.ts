import * as vscode from "vscode";
import { registerCommands } from "./commands/commandsManager";
import { getContractsDirectories } from "./helpers/contractIdentifier";
import { ActivityBarView } from "./views/activity_bar_view";
import { FileExplorerView } from "./views/explorer_view";

async function showWelcomePage(context: vscode.ExtensionContext) {
  setTimeout(async () => {
    let contracts = await getContractsDirectories();
    if (contracts.length === 0) {
      vscode.commands.executeCommand(
        "setContext",
        "impulse.showWelcomePage",
        true
      );
      showWelcomePage(context);
    } else {
      vscode.commands.executeCommand(
        "setContext",
        "impulse.showWelcomePage",
        false
      );
      new ActivityBarView(context);
    }
  }, 1000);
}

export async function activate(context: vscode.ExtensionContext) {
  showWelcomePage(context);
  new FileExplorerView(context);
  registerCommands(context);
}
