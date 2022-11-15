//@ts-check

(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();
  let accounts = [];
  let selectedNetwork = "Testnet";

  function getAccounts() {
    let message = { command: "getAccounts", selectedNetwork: selectedNetwork };
    sendMessage(message);
  }
  getAccounts();

  function populateAccountsOptions() {
    let selectElements = document.getElementsByClassName(
      "selectAccountElement"
    );
    for (let i = 0; i < selectElements.length; i++) {
      selectElements[i].innerHTML = "";
      for (let j = 0; j < accounts.length; j++) {
        const newOption = document.createElement("option");
        newOption.value = accounts[j];
        const newContent = document.createTextNode(accounts[j]);
        newOption.appendChild(newContent);
        selectElements[i].appendChild(newOption);
      }
    }
  }

  document.getElementById("selectNetwork")?.addEventListener("change", (ev) => {
    // @ts-ignore
    let val = ev.target.value;
    selectedNetwork = val;
    getAccounts();
  });

  // @ts-ignore
  document
    .getElementById("form-create-account")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      // @ts-ignore
      let parentAccount = document.getElementById("selectAccount-tab1").value;
      // @ts-ignore
      let newAccount = document.getElementById("inputNewAccountName").value;
      // @ts-ignore
      let initialBalance = document.getElementById("inputInitialBalance").value;

      let message = {
        command: "createAccount",
        network: selectedNetwork,
        parentAccount: parentAccount,
        newAccount: newAccount,
        initialBalance: initialBalance,
      };
      // console.log("create account", message);
      sendMessage(message);
    });

  // @ts-ignore
  document
    .getElementById("form-account-state")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      // @ts-ignore
      let accountId = document.getElementById("selectAccount-tab2").value;

      let message = {
        command: "getState",
        network: selectedNetwork,
        accountId: accountId,
      };
      // console.log("get state", message);

      sendMessage(message);
    });

  // @ts-ignore
  document
    .getElementById("form-send-tokens")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      // @ts-ignore
      let sender = document.getElementById("selectAccount-tab3").value;
      // @ts-ignore
      let receiver = document.getElementById("inputReceiverAccount").value;
      // @ts-ignore
      let amount = document.getElementById("inputAmount").value;

      let message = {
        command: "sendTokens",
        network: selectedNetwork,
        sender: sender,
        receiver: receiver,
        amount: amount,
      };
      // console.log("send tokens", message);

      sendMessage(message);
    });

  // @ts-ignore
  document
    .getElementById("form-delete-account")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      // @ts-ignore
      let account = document.getElementById("selectAccount-tab4").value;
      // @ts-ignore
      let beneficiaryAccount = document.getElementById(
        "inputBeneficiaryAccount"
        // @ts-ignore
      ).value;

      let message = {
        command: "deleteAccount",
        network: selectedNetwork,
        account: account,
        beneficiaryAccount: beneficiaryAccount,
      };
      // console.log("delete account", message);

      sendMessage(message);
    });

  let navLinks = document.getElementsByClassName("nav-link");
  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", (event) => {
      getAccounts();
    });
  }

  document
    .getElementById("btnRefreshAccounts")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      getAccounts();
    });

  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.type) {
      case "accounts":
        // console.log("received accounts", message.accounts);
        if (accounts.length !== message.accounts.length) {
          accounts = message.accounts;
          populateAccountsOptions();
        }
        break;
    }
  });

  /**
   * @param {Object} message
   */

  function sendMessage(message) {
    vscode.postMessage({ type: "msg", value: JSON.stringify(message) });
  }
})();
