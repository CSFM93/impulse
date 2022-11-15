"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aNodeWithIdTreeDataProvider = exports.ActivityBarView = void 0;
const vscode = require("vscode");
let _extensionUri;
class ActivityBarView {
    constructor(context) {
        _extensionUri = context.extensionUri;
        vscode.window.registerTreeDataProvider("impulse.activitybarView", aNodeWithIdTreeDataProvider());
        const view = vscode.window.createTreeView('impulse.activitybarView', { treeDataProvider: aNodeWithIdTreeDataProvider(), showCollapseAll: true });
        context.subscriptions.push(view);
    }
}
exports.ActivityBarView = ActivityBarView;
const tree = {
    'test': {
        label: "Test",
        iconName: "test.svg",
        description: "Test a smart contract",
        command: "impulse.test"
    },
    'compile': {
        label: "Compile",
        iconName: "test.svg",
        description: "Compile a smart contract",
        command: "impulse.compile"
    },
    'deploy': {
        label: "Deploy",
        iconName: "test.svg",
        description: "Deploy a smart contract",
        command: "impulse.deploy"
    },
    'call': {
        label: "Call",
        iconName: "test.svg",
        description: "Call a smart contract",
        command: "impulse.call"
    },
    'selectNetwork': {
        label: "Network",
        iconName: "test.svg",
        description: "Select a Near network (Testnet or Localnet)",
        command: "impulse.selectNetwork"
    },
    'selectAccount': {
        label: "Account",
        iconName: "test.svg",
        description: "Select a Near account",
        command: "impulse.selectAccount"
    },
    'accountManager': {
        label: "Account manager",
        iconName: "test.svg",
        description: "Manage your Near accounts",
        command: "impulse.accountManager"
    },
};
const nodes = {};
function aNodeWithIdTreeDataProvider() {
    return {
        getChildren: (element) => {
            return getChildren(element ? element.key : undefined).map(key => getNode(key));
        },
        getTreeItem: (element) => {
            const treeItem = getTreeItem(element.key);
            treeItem.id = element.key;
            return treeItem;
        },
        getParent: ({ key }) => {
            const parentKey = key.substring(0, key.length - 1);
            return parentKey ? new Key(parentKey) : undefined;
        }
    };
}
exports.aNodeWithIdTreeDataProvider = aNodeWithIdTreeDataProvider;
function getChildren(key) {
    if (!key) {
        return Object.keys(tree);
    }
    return [];
}
function getTreeItem(key) {
    const treeElement = getTreeElement(key);
    console.log("getTreeItem", key, treeElement);
    return {
        label: treeElement.label,
        description: treeElement.description,
        tooltip: treeElement.description,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        iconPath: {
            light: vscode.Uri.joinPath(_extensionUri, 'media', 'assets', treeElement.iconName),
            dark: vscode.Uri.joinPath(_extensionUri, 'media', 'assets', treeElement.iconName)
        },
        command: { command: treeElement.command, title: treeElement.label }
    };
}
function getTreeElement(element) {
    console.log("getTreeElement", element);
    let parent = tree[element];
    console.log("parent", parent);
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
//# sourceMappingURL=testView.js.map