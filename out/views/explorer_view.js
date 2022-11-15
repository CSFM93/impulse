"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeDataProvider = exports.FileExplorerView = void 0;
const vscode = require("vscode");
let _extensionUri;
class FileExplorerView {
    constructor(context) {
        _extensionUri = context.extensionUri;
        vscode.window.registerTreeDataProvider("impulse.mainCommandsView", treeDataProvider());
        const view = vscode.window.createTreeView("impulse.mainCommandsView", {
            treeDataProvider: treeDataProvider(),
            showCollapseAll: true,
        });
        context.subscriptions.push(view);
    }
}
exports.FileExplorerView = FileExplorerView;
const tree = {
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
const nodes = {};
function treeDataProvider() {
    return {
        getChildren: (element) => {
            return getChildren(element ? element.key : undefined).map((key) => getNode(key));
        },
        getTreeItem: (element) => {
            const treeItem = getTreeItem(element.key);
            treeItem.id = element.key;
            return treeItem;
        },
        getParent: ({ key }) => {
            const parentKey = key.substring(0, key.length - 1);
            return parentKey ? new Key(parentKey) : undefined;
        },
    };
}
exports.treeDataProvider = treeDataProvider;
function getChildren(key) {
    if (!key) {
        return Object.keys(tree);
    }
    return [];
}
function getTreeItem(key) {
    const treeElement = getTreeElement(key);
    return {
        label: treeElement.label,
        description: treeElement.description,
        tooltip: treeElement.description,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        iconPath: {
            light: vscode.Uri.joinPath(_extensionUri, "resources", treeElement.iconName),
            dark: vscode.Uri.joinPath(_extensionUri, "resources", treeElement.iconName),
        },
        command: { command: treeElement.command, title: treeElement.label },
    };
}
function getTreeElement(element) {
    let parent = tree[element];
    return parent;
}
function getNode(key) {
    if (!nodes[key]) {
        nodes[key] = new Key(key);
    }
    return nodes[key];
}
class Key {
    constructor(key) {
        this.key = key;
    }
}
//# sourceMappingURL=explorer_view.js.map