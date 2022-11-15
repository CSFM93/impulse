let { createApp } = Vue;
let vscode = acquireVsCodeApi();

createApp({
  template: `  <div
  class="card position-absolute top-50 start-50 translate-middle bg-dark"
  style="width: 90%; height: 95%; overflow-y: auto"
>
  <div class="card-body">
    <div class="container text-center">
      <div class="row align-items-start">
        <div class="col-8">
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                class="nav-link active"
                id="nav-viewMethods-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-view-methods"
                type="button"
                role="tab"
                aria-controls="nav-view-methods"
                aria-selected="true"
              >
                View methods
              </button>
              <button
                class="nav-link"
                id="nav-changeMethods-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-change-methods"
                type="button"
                role="tab"
                aria-controls="nav-change-methods"
                aria-selected="false"
              >
                Change methods
              </button>
            </div>
          </nav>
        </div>
        <div class="col-4 row justify-content-end">
          <div class="col-6 mt-1">
            <select
              class="form-select bg-dark text-primary mt-8"
              id="selectNetwork"
              v-model="selectedNetwork"
              @change="onNetworkChange($event)"
            >
              <option value="Testnet">Testnet</option>
              <option value="Localnet">Localnet</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-content" id="nav-tabContent">
      <div
        class="tab-pane ps-5 show active"
        id="nav-view-methods"
        role="tabpanel"
        aria-labelledby="nav-viewMethods-tab"
        tabindex="0"
      >
        <div class="mt-2">
          <div class="col-12">
            <div class="col-5">
              <label
                for="selectAccount-tab1"
                class="col-form-label text-light"
                >Account</label
              >
              <select
                class="
                  form-select
                  bg-dark
                  text-primary
                  mt-8
                  selectAccountElement
                "
                v-model="selectedAccount"
              ></select>
              <div class="form-text text-light">
                Id of the account that will be used to call the contract
              </div>
            </div>

            <div class="mt-2 col-5">
              <label class="col-form-label text-light">Contract Name</label>
              <input
                type="text"
                class="form-control bg-dark text-light"
                v-model="contractName"
              />
              <div class="form-text text-light">
                Id of the account where the contract was deployed
              </div>
            </div>
          </div>
          <div class="col-12 mt-3">
            <label for="methodsContainer" class="col-form-label text-light"
              >Methods</label
            >
            <div class="row">
              <div
                class="col-3 mt-3"
                v-for="(item, i) in viewMethods"
                :key="'div-' + item.name"
              >
                <input
                  name="options"
                  class="btn-check"
                  type="checkbox"
                  autocomplete="off"
                  data-bs-toggle="collapse"
                  :id="'viewMethodsOption-' + i"
                  :data-bs-target="'#viewMethods-' + i"
                  aria-expanded="false"
                  :aria-controls="'viewMethods-' + i"
                />
                <label
                  class="btn btn-outline-primary"
                  :for="'viewMethodsOption-' + i"
                  >{{ item.name }}</label
                >
              </div>
            </div>

            <div>
              <div
                v-for="(item, i) in viewMethods"
                :key="'collapse-elements-' + item.name"
                class="collapse multi-collapse mt-4"
                :id="'viewMethods-' + i"
              >
                <div class="row">
                  <h4 class="text-light">{{ item.name }}</h4>
                  <div
                    class="col-5 mt-2"
                    v-for="(arg, j) in item.args"
                    :key="arg.name + '-' + j"
                  >
                    <div v-if="arg.type !== 'object'">
                      <label class="col-form-label text-light"
                        >{{ arg.name }}: {{ arg.type }}</label
                      >
                      <input
                        v-if="arg.type === 'string'"
                        type="text"
                        class="form-control bg-dark text-light"
                        v-model="arg.value"
                        :name="arg.name + i + '-' + j"
                      />
                      <input
                        v-else-if="arg.type === 'float' || arg.type === 'int'"
                        type="number"
                        class="form-control bg-dark text-light"
                        v-model="arg.value"
                        :name="arg.name + i + '-' + j"
                      />
                      <select
                        v-else-if="arg.type === 'boolean'"
                        class="
                          form-select
                          bg-dark
                          text-primary
                          selectAccountElement
                        "
                        v-model="arg.value"
                        :name="arg.name + i + '-' + j"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                    <div v-else>
                      <h5 class="text-light">{{ arg.name }}</h5>
                      <div
                        v-for="(objKey, k) in getObjectKeys(arg.value)"
                        :key="objKey + '-' + j + '-' + k"
                      >
                        <label class="col-form-label text-light"
                          >{{ objKey }}: {{ arg.value[objKey].type }}</label
                        >
                        <input
                          v-if="arg.value[objKey].type === 'string'"
                          type="text"
                          class="form-control bg-dark text-light"
                          v-model="arg.value[objKey].value"
                          :name="arg.value[objKey].name + '-' + i + '-' + j"
                        />
                        <input
                          v-else-if="
                            arg.value[objKey].type === 'float' ||
                            arg.value[objKey].type === 'int'
                          "
                          type="number"
                          class="form-control bg-dark text-light"
                          v-model="arg.value[objKey].value"
                          :name="arg.value[objKey].name + '-' + i + '-' + j"
                        />
                        <select
                          v-else-if="arg.value[objKey].type === 'boolean'"
                          class="
                            form-select
                            bg-dark
                            text-primary
                            selectAccountElement
                          "
                          v-model="arg.value[objKey].value"
                          :name="arg.value[objKey].name + '-' + i + '-' + j"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <hr class="bg-light border-2 border-top border-light" />
                    </div>
                  </div>
                </div>
                <div class="col-3 mt-3">
                  <button
                    class="btn btn-primary"
                    @click="callMethod('viewMethods', item.name)"
                  >
                    call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade ps-5"
        id="nav-change-methods"
        role="tabpanel"
        aria-labelledby="nav-changeMethods-tab"
        tabindex="1"
      >
        <div class="mt-2">
          <div class="col-12">
            <div class="col-5">
              <label
                for="selectAccount-tab1"
                class="col-form-label text-light"
                >Account</label
              >
              <select
                class="
                  form-select
                  bg-dark
                  text-primary
                  mt-8
                  selectAccountElement
                "
                v-model="selectedAccount"
              ></select>
              <div class="form-text text-light">
                Id of the account that will be used to call the contract
              </div>
            </div>

            <div class="mt-2 col-5">
              <label class="col-form-label text-light">Contract Name</label>
              <input
                type="text"
                class="form-control bg-dark text-light"
                v-model="contractName"
              />
              <div class="form-text text-light">
                Id of the account where the contract was deployed
              </div>
            </div>
            <div class="mt-2 row col-12">
            <div class="col-3">
              <label class="col-form-label text-light">Gas</label>
              <div class="col-6">
                <input
                  type="number"
                  class="form-control bg-dark text-light"
                  v-model="gas"
                />
                <div class="form-text text-light">
                  Amount of Gas in {{ token }} to attach
                </div>
              </div>
            </div>
            <div class="col-2">
              <label class="col-form-label text-light">Select unit </label>
              <select
                class="form-select bg-dark text-primary mt-8"
                id="selectToken"
                v-model="token"
              >
                <option value="Near">Near</option>
                <option value="YoctoNear">YoctoNear</option>
              </select>
              <div class="form-text text-light">
                Choose between Near and YoctoNear
              </div>
            </div>
          </div>
          </div>
          <div class="col-12 mt-3">
            <label for="methodsContainer" class="col-form-label text-light"
              >Methods</label
            >
            <div class="row">
              <div
                class="col-3 mt-3"
                v-for="(item, i) in changeMethods"
                :key="'div-' + item.name"
              >
                <input
                  name="options"
                  class="btn-check"
                  type="checkbox"
                  autocomplete="off"
                  data-bs-toggle="collapse"
                  :id="'changeMethodOption-' + i"
                  :data-bs-target="'#change-method-' + i"
                  aria-expanded="false"
                  :aria-controls="'change-method-' + i"
                />
                <label
                  class="btn btn-outline-primary"
                  :for="'changeMethodOption-' + i"
                  >{{ item.name }}</label
                >
              </div>
            </div>

            <div>
              <div
                v-for="(item, i) in changeMethods"
                :key="'collapse-elements-' + item.name"
                class="collapse multi-collapse mt-4"
                :id="'change-method-' + i"
              >
                <div class="row">
                  <h4 class="text-light">{{ item.name }}</h4>
                  <div
                    class="col-5 mt-2"
                    v-for="(arg, j) in item.args"
                    :key="arg.name + '-' + j"
                  >
                    <div v-if="arg.type !== 'object'">
                      <label class="col-form-label text-light"
                        >{{ arg.name }}: {{ arg.type }}</label
                      >
                      <input
                        v-if="arg.type === 'string'"
                        type="text"
                        class="form-control bg-dark text-light"
                        v-model="arg.value"
                        :name="arg.name + i + '-' + j"
                      />
                      <input
                        v-else-if="arg.type === 'float' || arg.type === 'int'"
                        type="number"
                        class="form-control bg-dark text-light"
                        v-model="arg.value"
                        :name="arg.name + i + '-' + j"
                      />
                      <select
                        v-else-if="arg.type === 'boolean'"
                        class="
                          form-select
                          bg-dark
                          text-primary
                          selectAccountElement
                        "
                        v-model="arg.value"
                        :name="arg.name + i + '-' + j"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                    <div v-else>
                      <!-- <hr class="bg-light border-2 border-top border-light" /> -->
                      <h5 class="text-light">{{ arg.name }}</h5>
                      <div
                        v-for="(objKey, k) in getObjectKeys(arg.value)"
                        :key="objKey + '-' + j + '-' + k"
                      >
                        <label class="col-form-label text-light"
                          >{{ objKey }}: {{ arg.value[objKey].type }}</label
                        >
                        <input
                          v-if="arg.value[objKey].type === 'string'"
                          type="text"
                          class="form-control bg-dark text-light"
                          v-model="arg.value[objKey].value"
                          :name="arg.value[objKey].name + '-' + i + '-' + j"
                        />
                        <input
                          v-else-if="
                            arg.value[objKey].type === 'float' ||
                            arg.value[objKey].type === 'int'
                          "
                          type="number"
                          class="form-control bg-dark text-light"
                          v-model="arg.value[objKey].value"
                          :name="arg.value[objKey].name + '-' + i + '-' + j"
                        />
                        <select
                          v-else-if="arg.value[objKey].type === 'boolean'"
                          class="
                            form-select
                            bg-dark
                            text-primary
                            selectAccountElement
                          "
                          v-model="arg.value[objKey].value"
                          :name="arg.value[objKey].name + '-' + i + '-' + j"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <hr class="bg-light border-2 border-top border-light" />
                    </div>
                  </div>
                </div>
                <div class="col-3 mt-3">
                  <button
                    class="btn btn-primary"
                    @click="callMethod('changeMethods', item.name)"
                  >
                    call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`,

  data: () => ({
    accounts: [],
    booleans: ["true", "false"],
    viewMethods: [],
    changeMethods: [],
    selectedAccount: "",
    selectedNetwork: "Testnet",
    contractName: "",
    gas: 0,
    token: "Near",
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      window.addEventListener("message", (event) => {
        const message = event.data;
        switch (message.type) {
          case "accounts":
            this.accounts = message.accounts;
            this.populateAccountsOptions();
            break;
          case "manifest":
            if (message.value !== undefined) {
              this.setManifest(message.value);
            } else {
              let text = `Please create a impulse.json file and declare the view and change methods inside it`;
              let message = {
                command: "showNotification",
                text: text,
              };
              this.sendMessage(message);
            }

            break;
        }
      });

      this.getAccounts();
      this.getManifest();
    },
    onNetworkChange(ev) {
      let val = ev.target.value;
      this.selectedNetwork = val;
      this.getAccounts();
    },
    getAccounts() {
      let message = {
        command: "getAccounts",
        selectedNetwork: this.selectedNetwork,
      };
      this.sendMessage(message);
    },
    getManifest() {
      let message = { command: "getManifest" };
      this.sendMessage(message);
    },
    populateAccountsOptions() {
      let selectElements = document.getElementsByClassName(
        "selectAccountElement"
      );
      for (let i = 0; i < selectElements.length; i++) {
        selectElements[i].innerHTML = "";
        for (let j = 0; j < this.accounts.length; j++) {
          const newOption = document.createElement("option");
          newOption.value = this.accounts[j];
          const newContent = document.createTextNode(this.accounts[j]);
          newOption.appendChild(newContent);
          selectElements[i].appendChild(newOption);
        }
      }
    },
    getValueType(value) {
      let type = typeof value;

      switch (type) {
        case "string":
          return type;

        case "boolean":
          return type;

        case "number":
          if (Number.isInteger(value)) {
            return "int";
          } else {
            return "float";
          }

        case "object":
          return type;

        case undefined:
          return undefined;
      }
    },
    getObjectKeys(obj) {
      return Object.keys(obj);
    },
    setManifest(data) {
      for (let i = 0; i < data.changeMethods.length; i++) {
        for (let j = 0; j < data.changeMethods[i].args.length; j++) {
          let itemType = this.getValueType(data.changeMethods[i].args[j].value);
          data.changeMethods[i].args[j].type = itemType;

          if (itemType === "object") {
            let keys = Object.keys(data.changeMethods[i].args[j].value);
            keys.map((key) => {
              let objKeyType = this.getValueType(
                data.changeMethods[i].args[j].value[key]
              );
              let value = data.changeMethods[i].args[j].value[key];
              data.changeMethods[i].args[j].value[key] = {
                name: key,
                value: value,
                type: objKeyType,
              };
            });
          }
        }
      }

      for (let i = 0; i < data.viewMethods.length; i++) {
        for (let j = 0; j < data.viewMethods[i].args.length; j++) {
          let itemType = this.getValueType(data.viewMethods[i].args[j].value);
          // console.log("item type", data.changeMethods[i].args[j], itemType);
          data.viewMethods[i].args[j].type = itemType;
          if (itemType === "object") {
            let keys = Object.keys(data.viewMethods[i].args[j].value);
            keys.map((key) => {
              let objKeyType = this.getValueType(
                data.viewMethods[i].args[j].value[key]
              );
              let value = data.viewMethods[i].args[j].value[key];
              data.viewMethods[i].args[j].value[key] = {
                name: key,
                value: value,
                type: objKeyType,
              };
            });
          }
        }
      }

      this.viewMethods = data.viewMethods;
      this.changeMethods = data.changeMethods;
    },
    parseCommandArgsValue(arg) {
      switch (arg.type) {
        case "string":
          return `"${arg.value}"`;

        case "boolean":
          return arg.value;

        case "int":
          return parseInt(arg.value);

        case "float":
          return parseFloat(arg.value);

        case "object":
          let keys = Object.keys(arg.value);
          let obj = {};
          keys.map((key) => {
            obj[key] = {};
            let value = arg.value[key].value;
            obj[key] = value;
          });
          let stringifiedObj = JSON.stringify(obj);
          return stringifiedObj;

        default:
          return undefined;
      }
    },
    callMethod(methodType, methodName) {
      let args = [];
      let commandArgs = "";
      for (let i = 0; i < this[methodType].length; i++) {
        if (this[methodType][i].name === methodName) {
          args = this[methodType][i].args;
          if (args === undefined) {
            let text = `Make sure you add the args property in the ${methodName} method of 
            your impulse.json file`;
            let message = {
              command: "showNotification",
              text: text,
            };
            this.sendMessage(message);
          }
          if (args.length > 0) {
            for (let j = 0; j < args.length; j++) {
              let value = this.parseCommandArgsValue(args[j]);
              if (j === 0) {
                if (args.length === 1) {
                  commandArgs += `'{"${args[j].name}":${value}}'`;
                } else {
                  commandArgs += `'{"${args[j].name}":${value},`;
                }
              } else if (j === args.length - 1) {
                commandArgs += `"${args[j].name}":${value}}'`;
              } else {
                commandArgs += `"${args[j].name}":${value},`;
              }
            }
          } else {
            commandArgs += `{}`;
          }
          break;
        }
      }
      let message = {
        command: "callMethod",
        methodType: methodType === "viewMethods" ? "view" : "call",
        methodName: methodName,
        contractName: this.contractName,
        commandArgs: commandArgs,
        account: this.selectedAccount,
        network: this.selectedNetwork,
        gas: this.gas,
        token: this.token,
      };
      this.sendMessage(message);
    },
    sendMessage(message) {
      vscode.postMessage({ type: "msg", value: JSON.stringify(message) });
    },
  },
}).mount("#app");
