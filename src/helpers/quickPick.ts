import { ExtensionContext, window } from "vscode";
import { getAccounts } from "../commands/accountCommands";
import {
  getContractsDirectories,
  getCompiledContracts,
} from "./contractIdentifier";
import { moveElementInArray } from "./utils";

export async function createQuickPickOptions(
  command: string,
  context: ExtensionContext
) {
  let network: string | undefined = context.globalState.get("Near.Network");
  let allContracts = await getContractsDirectories();
  let options: {
    label: string;
    detail: string;
    description: string;
    value: any;
  }[] = [];
  switch (command) {
    case "test": {
      options = testOrCompile(context, command, allContracts);
      return options;
    }
    case "compile": {
      options = testOrCompile(context, command, allContracts);
      return options;
    }

    case "deploy": {
      let allCompiledContracts = await getCompiledContracts();
      let account = context.globalState.get("Near.Account");

      if (account === undefined) {
        allCompiledContracts.map((contract) => {
          let devOption = {
            label: `$(cloud-upload)    ${contract.projectName}`,
            detail: `Language: ${contract.language}, Network: ${network}, Path: ${contract.binaryPath}`,
            description: `Dev-Deploy ${contract.binaryName} To Dev Account`,
            value: contract,
          };
          options.push(devOption);
        });
        options = organizeOptions(options, context, command);

        return options;
      }

      allCompiledContracts.map((contract) => {
        let option = {
          label: `$(cloud-upload)    ${contract.projectName}`,
          detail: `Language: ${contract.language}, Network: ${network}, Path: ${contract.binaryPath}`,
          description: `Deploy ${contract.binaryName} To account ${account}`,
          value: contract,
        };
        options.push(option);
        let devOption = {
          label: `$(cloud-upload)    ${contract.projectName}`,
          detail: `Language: ${contract.language}, Network: ${network}, Path: ${contract.binaryPath}`,
          description: `Dev-Deploy ${contract.binaryName} To Dev Account`,
          value: contract,
        };
        options.push(devOption);
      });

      options = organizeOptions(options, context, command);

      return options;
    }

    case "call": {
      let allContracts = await getContractsDirectories();

      allContracts.map((contract) => {
        let option = {
          label: `$(notebook-execute)    ${contract.name}`,
          detail: `Language: ${contract.language}, Path: ${contract.manifestPath}`,
          description: `Call contract ${contract.name}`,
          value: contract,
        };
        options.push(option);
      });
      options = organizeOptions(options, context, command);

      return options;
    }
    case "selectAccount": {
      if (network !== undefined) {
        let accounts = await getAccounts(network);
        accounts?.map((account) => {
          let option = {
            label: `$(account)    ${account}`,
            detail: `Network: ${network}`,
            description: "",
            value: `${account}`,
          };

          options.push(option);
        });
      }
      return options;
    }
    case "selectNetwork": {
      options = [
        {
          label: "$(settings-more-action)    Testnet",
          detail:
            "This network is intended for testing all aspects of the NEAR platform prior to mainnet deployment.",
          description: "",
          value: "Testnet",
        },
        {
          label: "$(settings-more-action)    Localnet",
          detail:
            "This network is intended for developers who want to work with the NEAR platform independent of the public blockchain. Make sure you are running a Kurtosis Localnet before choosing this option",
          description: "Kurtosis",
          value: "Localnet",
        },
      ];

      return options;
    }
  }
}

export async function showQuickPick(options: any, placeHolder: string) {
  interface Option {
    label: string;
    detail: string;
    description: string;
    value: any;
  }
  let result = await window.showQuickPick(options, {
    placeHolder: placeHolder,
  });

  return result as unknown as Option;
}

type AllContracts = { name: string; language: string; manifestPath: string }[];

function testOrCompile(
  context: ExtensionContext,
  command: string,
  allContracts: AllContracts
) {
  let options: {
    label: string;
    detail: string;
    description: string;
    value: any;
  }[] = [];
  let icon = command === "test" ? "$(test-view-icon)" : "$(package)";
  allContracts.map((contract) => {
    let option = {
      label: `${icon}    ${contract.name}`,
      detail: `Language: ${contract.language}, path: ${contract.manifestPath}`,
      description: `${command} ${contract.name} `,
      value: contract,
    };
    options.push(option);
  });

  options = organizeOptions(options, context, command);

  return options;
}

function organizeOptions(
  options: any,
  context: ExtensionContext,
  command: string
) {
  let previousChoice = context.globalState.get(`Choice.${command}`);
  if (previousChoice !== undefined) {
    for (let i = 0; i < options.length; i++) {
      if (previousChoice === options[i].value.manifestPath) {
        options = moveElementInArray(options, i, 0);
        break;
      }
    }
  }

  return options;
}
