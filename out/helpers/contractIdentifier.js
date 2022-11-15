"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompiledContracts = exports.getContractsDirectories = void 0;
const vscode = require("vscode");
const fileManager_1 = require("./fileManager");
const path = require("path");
async function getContractsDirectories() {
    const projects = await vscode.workspace.findFiles("**/package.json", "**/node_modules/**");
    let allContracts = [];
    try {
        projects.map(async (project) => {
            let contractSubDirPath = project.fsPath.replace("package.json", "contract");
            let dirExists = (0, fileManager_1.checkIfDirExists)(contractSubDirPath);
            if (dirExists) {
                let files = (0, fileManager_1.listFiles)(contractSubDirPath);
                if (files !== undefined && files.length > 0) {
                    // console.log("found: ", files);
                    if (files.includes("Cargo.toml")) {
                        let mainPackageFileText = (0, fileManager_1.getText)(project.fsPath);
                        let contract = {
                            name: mainPackageFileText.name,
                            language: "Rust",
                            manifestPath: project.fsPath,
                        };
                        allContracts.push(contract);
                    }
                    else {
                        if (files.includes("package.json")) {
                            let packageFilePath = path.join(contractSubDirPath, "package.json");
                            let packageFileText = (0, fileManager_1.getText)(packageFilePath);
                            let contract = checkIfContractIsJSorAS(packageFileText, project.fsPath);
                            if (contract !== undefined) {
                                allContracts.push(contract);
                            }
                        }
                    }
                }
            }
        });
        // console.log("allContracts", allContracts);
        return allContracts;
    }
    catch (error) {
        return allContracts;
    }
}
exports.getContractsDirectories = getContractsDirectories;
function checkIfContractIsJSorAS(packageFileText, path) {
    if ((packageFileText.dependencies !== undefined &&
        packageFileText.dependencies["near-sdk-js"] !== undefined) ||
        (packageFileText.devDependencies !== undefined &&
            packageFileText.devDependencies["near-sdk-js"] !== undefined)) {
        // console.log("javascript project", path);
        let contract = {
            name: packageFileText.name,
            language: "JavaScript",
            manifestPath: path,
        };
        return contract;
    }
    else if ((packageFileText.dependencies !== undefined &&
        packageFileText.dependencies["near-sdk-as"] !== undefined) ||
        (packageFileText.devDependencies !== undefined &&
            packageFileText.devDependencies["near-sdk-as"] !== undefined)) {
        // console.log("assemblyScript project", path);
        let contract = {
            name: packageFileText.name,
            language: "AssemblyScript",
            manifestPath: path,
        };
        return contract;
    }
}
async function getCompiledContracts() {
    const projects = await getContractsDirectories();
    const binariesFound = await vscode.workspace.findFiles("**/*.wasm", "**/node_modules/**");
    // console.log("binaries found", binariesFound);
    let allCompiledContracts = [];
    try {
        binariesFound.map((binaryFound) => {
            let splitPath = binaryFound.fsPath.split("/");
            let binaryName = splitPath[splitPath.length - 1];
            for (let i = 0; i < projects.length; i++) {
                let contractsSaved = [];
                let manifestPath = projects[i].manifestPath;
                let projectPath = manifestPath.replace("package.json", "");
                if (binaryFound.fsPath.includes(projectPath)) {
                    if (!binaryFound.fsPath.includes("release/deps") &&
                        !contractsSaved.includes(binaryFound.fsPath)) {
                        let compiledContract = {
                            projectName: projects[i].name,
                            language: projects[i].language,
                            binaryName: binaryName,
                            binaryPath: binaryFound.fsPath,
                            manifestPath: manifestPath,
                        };
                        allCompiledContracts.push(compiledContract);
                        contractsSaved.push(binaryFound.fsPath);
                        break;
                    }
                }
            }
        });
        // console.log("compiled contracts", allCompiledContracts);
        return allCompiledContracts;
    }
    catch (error) {
        // console.log("error", error);
        return allCompiledContracts;
    }
}
exports.getCompiledContracts = getCompiledContracts;
//# sourceMappingURL=contractIdentifier.js.map