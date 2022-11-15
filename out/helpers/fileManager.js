"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfDirExists = exports.listFiles = exports.getText = void 0;
const fs = require("fs");
function getText(filePath) {
    try {
        let buff = fs.readFileSync(filePath, "utf8");
        try {
            let text = JSON.parse(buff);
            return text;
        }
        catch (error) {
            return buff;
        }
    }
    catch (error) {
        return undefined;
    }
}
exports.getText = getText;
function listFiles(dirPath) {
    try {
        let result = fs.readdirSync(dirPath);
        return result;
    }
    catch (error) {
        return undefined;
    }
}
exports.listFiles = listFiles;
function checkIfDirExists(dirPath) {
    if (fs.existsSync(dirPath)) {
        return true;
    }
    else {
        return false;
    }
}
exports.checkIfDirExists = checkIfDirExists;
//# sourceMappingURL=fileManager.js.map