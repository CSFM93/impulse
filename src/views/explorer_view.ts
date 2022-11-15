import * as vscode from "vscode";
let _extensionUri: vscode.Uri;

export class FileExplorerView {
  constructor(context: vscode.ExtensionContext) {
    _extensionUri = context.extensionUri;
    vscode.window.registerTreeDataProvider(
      "impulse.mainCommandsView",
      treeDataProvider()
    );
    const view = vscode.window.createTreeView("impulse.mainCommandsView", {
      treeDataProvider: treeDataProvider(),
      showCollapseAll: true,
    });
    context.subscriptions.push(view);
  }
}

const tree: any = {
  test: {
    label: "Test",
    iconName: "flask.png",
    description: "Test a smart contract",
    command: "impulse.test",
  },
  compile: {
    label: "Compile",
    iconName: "build.png",
    description: "Compile a smart contract",
    command: "impulse.compile",
  },
  deploy: {
    label: "Deploy",
    iconName: "cloud.png",
    description: "Deploy a smart contract",
    command: "impulse.deploy",
  },
  call: {
    label: "Call",
    iconName: "call.png",
    description: "Call a smart contract",
    command: "impulse.call",
  },
  accountManager: {
    label: "Account manager",
    iconName: "account_manager.png",
    description: "Manage your Near accounts",
    command: "impulse.accountManager",
  },
};

const nodes: any = {};

export function treeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
  return {
    getChildren: (element: { key: string }): { key: string }[] => {
      return getChildren(element ? element.key : undefined).map((key) =>
        getNode(key)
      );
    },
    getTreeItem: (element: { key: string }): vscode.TreeItem => {
      const treeItem = getTreeItem(element.key);
      treeItem.id = element.key;
      return treeItem;
    },
    getParent: ({ key }: { key: string }): { key: string } | undefined => {
      const parentKey = key.substring(0, key.length - 1);
      return parentKey ? new Key(parentKey) : undefined;
    },
  };
}

function getChildren(key: string | undefined): string[] {
  if (!key) {
    return Object.keys(tree);
  }

  return [];
}

function getTreeItem(key: string): vscode.TreeItem {
  const treeElement = getTreeElement(key);
  return {
    label: treeElement.label,
    description: treeElement.description,
    tooltip: treeElement.description,
    collapsibleState: vscode.TreeItemCollapsibleState.None,
    iconPath: {
      light: vscode.Uri.joinPath(
        _extensionUri,
        "resources",
        treeElement.iconName
      ),
      dark: vscode.Uri.joinPath(
        _extensionUri,
        "resources",
        treeElement.iconName
      ),
    },
    command: { command: treeElement.command, title: treeElement.label },
  };
}

function getTreeElement(element: string): any {
  let parent = tree[element];
  return parent;
}

function getNode(key: string): { key: string } {
  if (!nodes[key]) {
    nodes[key] = new Key(key);
  }
  return nodes[key];
}

class Key {
  constructor(readonly key: string) {}
}
