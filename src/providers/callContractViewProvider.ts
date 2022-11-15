import * as vscode from "vscode";
import { getAccounts } from "../commands/accountCommands";
import { getText } from "../helpers/fileManager";
import { getManifest } from "../helpers/utils";
import { call } from "../commands/mainCommands";

export class CallContractPanel {
  public static currentPanel: CallContractPanel | undefined;

  public static readonly viewType = "CallContract";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  public readonly _manifestPath: string;

  public static createOrShow(
    extensionUri: vscode.Uri,
    manifestPath: string,
    context: vscode.ExtensionContext
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (CallContractPanel.currentPanel) {
      CallContractPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      CallContractPanel.viewType,
      "Call contract view",
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri)
    );

    CallContractPanel.currentPanel = new CallContractPanel(
      panel,
      extensionUri,
      manifestPath,
      context
    );
  }

  public static revive(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    manifestPath: string,
    context: vscode.ExtensionContext
  ) {
    CallContractPanel.currentPanel = new CallContractPanel(
      panel,
      extensionUri,
      manifestPath,
      context
    );
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    manifestPath: string,
    context: vscode.ExtensionContext
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._manifestPath = manifestPath;

    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      async (data) => {
        let msg = JSON.parse(data.value);

        switch (msg.command) {
          case "getAccounts":
            let accounts = await getAccounts(msg.selectedNetwork);
            let message = { type: "accounts", accounts: accounts };
            this.sendMessage(message);
            break;

          case "getManifest":
            let manifest = getManifest(this._manifestPath);
            this.sendMessage({ type: "manifest", value: manifest });
            break;

          case "showNotification":
            vscode.window.showErrorMessage(msg.text);
            break;

          case "callMethod":
            let projectName = getText(this._manifestPath).name;
            msg.projectName = projectName;
            call(msg);
            break;
        }
      },
      null,
      this._disposables
    );
  }

  public sendMessage(message: any) {
    this._panel.webview.postMessage(message);
  }

  public dispose() {
    CallContractPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "callContractView",
        "main.js"
      )
    );
    const vueURI = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "callContractView",
        "js",
        "vue.global.js"
      )
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

            <title>Call contract</title>
        </head>
        
        <body class="bg-dark">
            <div id="app"></div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>
            <script nonce="${nonce}" src="${vueURI}"></script>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        
        </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getWebviewOptions(
  extensionUri: vscode.Uri
): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [extensionUri],
    
  };
}
