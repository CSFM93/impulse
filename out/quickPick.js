"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showQuickPick = void 0;
const vscode_1 = require("vscode");
/**
 * Shows a pick list using window.showQuickPick().
 */
async function showQuickPick() {
    const result = await vscode_1.window.showQuickPick(['Testnet', 'Localnet'], {
        placeHolder: 'Choose a network'
    });
    vscode_1.window.showInformationMessage(`Selected: ${result}`);
}
exports.showQuickPick = showQuickPick;
//# sourceMappingURL=quickPick.js.map