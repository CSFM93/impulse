import * as vscode from "vscode";
import { getText } from "../helpers/fileManager";
import { showQuickPick } from "../helpers/quickPick";
import { setNearEnv, runCommand } from "../helpers/utils";

type Contract = {
  name: string;
  language: string;
  manifestPath: string;
};

export async function testOrCompile(
  context: vscode.ExtensionContext,
  contract: Contract,
  keyword: string
) {
  let command: string = "";
  let packageFileText = getText(contract.manifestPath);
  let scriptKeys = Object.keys(packageFileText.scripts);
  let options: {
    label: string;
    detail: string;
    description: string;
    value: any;
  }[] = [];
  let icon = keyword === "test" ? "$(test-view-icon)" : "$(package)";
  scriptKeys.map((key) => {
    if (key.includes(keyword)) {
      let option = {
        label: `${icon}    ${key}`,
        detail: `${packageFileText.scripts[key]}`,
        description: ``,
        value: packageFileText.scripts[key],
      };
      options.push(option);
    }
  });

  if (options.length > 0) {
    let placeHolder = "Choose a script to run";
    let result = await showQuickPick(options, placeHolder);
    if (result !== undefined) {
      let workDir = contract.manifestPath
        .replace("/package.json", "")
        .replace("\\package.json", "");
      command = `cd ${workDir} && ${result.value}`;
      let terminalName = `Impulse ${contract.name}`;
      runCommand(terminalName, command);
    }
  }
}

type CompiledContract = {
  projectName: string;
  language: string;
  binaryName: string;
  binaryPath: string;
};

export async function deploy(
  contract: CompiledContract,
  network: any,
  account: any
) {
  let terminalName = `Impulse ${contract.projectName}`;
  let command: string = setNearEnv(network);

  command +=
    account !== "Dev-account"
      ? `near deploy --accountId ${account} --wasmFile ${contract.binaryPath}`
      : `near dev-deploy --wasmFile ${contract.binaryPath}`;
  runCommand(terminalName, command);
}

type CommandSpec = {
  projectName: string;
  contractName: string;
  network: string;
  account: string;
  methodType: string;
  methodName: string;
  command: string;
  commandArgs: string;
  gas: number;
  token: string;
};
export async function call(commandSpec: CommandSpec) {
  let network = commandSpec.network;
  let account = commandSpec.account;
  let terminalName = `Impulse ${commandSpec.projectName}`;
  let command: string = setNearEnv(network);
  command += `near ${commandSpec.methodType} ${commandSpec.contractName} `;
  command += `${commandSpec.methodName} ${commandSpec.commandArgs} `;
  command += `--accountId ${account}`;

  if (commandSpec.methodType === "call" && commandSpec.gas > 0) {
    if (commandSpec.token === "Near") {
      command += ` --deposit ${commandSpec.gas}`;
    } else {
      command += ` --depositYocto ${commandSpec.gas}`;
    }
  }

  runCommand(terminalName, command);
}
