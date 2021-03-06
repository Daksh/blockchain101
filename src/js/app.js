App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: () => {
    return App.initWeb3();
  },

  initWeb3: () => {
    
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }

    web3 = new Web3(App.web3Provider);
    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: () => {
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, (err, balance) => {
          if (err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + "ETH");
          }
        })
      }
    })
  },

  initContract: () => {
    $.getJSON('SmartWallet.json', (SmartWalletArtifact) => {
      App.contracts.SmartWallet = TruffleContract(SmartWalletArtifact);
      App.contracts.SmartWallet.setProvider(App.web3Provider);
      App.eventListener();
      return App.getConfiguration();
    })
  },

  addWallet: () => {
    var num = $("#wallets > div").length/2;
    $('#wallets').append('<div class="form-group"><label for="w'+num+'">Wallet Address</label> <input type="text" class="form-control" id="w'+num+'" name="walletAddress[]" placeholder="Enter the wallet address"></div> <div class="form-group"><label for="p'+num+'">Percentage for Wallet</label> <input type="number" class="form-control" id="p'+num+'" placeholder="Enter the percentage" max="100" pattern="[0-9]+([\.,][0-9]+)?" step="5"></div> <hr>');
  },

  removeWallet: () => {
    var num = $("#wallets > div").length;
    if (num > 3) {
      $('#wallets > div').slice(-2).remove();
    } else {
      return false;
    }
  },

  getConfiguration: async () => {
    App.contracts.SmartWallet.deployed()
      .then((instance) => {
        return instance.getConfiguration({from : App.account, gas: 500000});
      })
      .then((data) => {
        let wallets = data[2].toNumber();
        if (wallets !== 0) {
          console.log(data);
          let percent = data[0];
          console.log(percent);
          let address = data[1];
          console.log(address);

          for (let i = 0; i < wallets; i++) {
            $("#configTable > tbody")
              .append("<tr><td>"+data[1][i]+"</td><td>"+data[0][i]+"%</td></tr>");
          }

          $("#config").show();
        } else {
          $("#config").hide();
        }
        
      });
  },

  checkTotal: (walletArray) => {
    var sum = 0;

    for(var i = 0; i < walletArray.length; i++) {
      sum += walletArray[i];
    }

    if (sum == 100) {
      return true;
    } else {
      return false;
    }
  },

  isNotContractAddress: async (address) => {
    let check = await App.contracts.SmartWallet.deployed()
      .then((instance) => {
        return instance.isContractAddress(address, {from : App.account, gas: 500000});
      })
      .then((data) => {
        if (data === false) {
          console.log("Valid Wallet Address");
          return true;
        } else {
          console.log("Invalid/Unknown Address");
          return false;
        }
      });
      return check;
  },

  validateAddress: async (address) => {
    if (web3.isAddress(address)) {
      let check = await App.isNotContractAddress(address);

      if (check === true) {
        return true;
      } else {
        return false;
      }
    } else {
      console.log("Invalid Wallet Address");
      return false;
    }
  },

  validatePercent: (percent) => {
    if (isNaN(parseInt(percent))) {
      console.log("Invalid Percent Value");
      return false;
    } else {
      return true;
    }
  },

  configure: async () => {
    var num = $("#wallets > div").length/2;
    var walletAddress = [];
    var walletPercent = [];

    for(var i=0; i < num; i++) {
      // console.log("Line 127", await App.validateAddress($('#w'+i).val()));
      if (await App.validateAddress($('#w'+i).val()) === true) {
       walletAddress[i] = web3.toChecksumAddress($('#w'+i).val());
      } else {
        return false;
      }

      if (App.validatePercent($('#p'+i).val())) {
        walletPercent[i] = parseInt($('#p'+i).val());
      } else {
        return false;
      }
      
    }

    if (!App.checkTotal(walletPercent)) {
      $('#percentError').show()
      console.log("Total Percentage Isn't 100");
      return false;
    }

    console.log(walletPercent);
    console.log(walletAddress);
    App.contracts.SmartWallet.deployed()
      .then((instance) => {
        return instance.configureShare(num, walletPercent, walletAddress, {from : App.account, gas: 500000});
      });
    $('#successMsg').show();
  },

  eventListener: () => {
    App.contracts.SmartWallet.deployed()
      .then((instance) => {
        instance.Deposit({}, {}).watch((err, events) => {
          if (!err) {
            $('#events').append('<li class="list-group-item">Sent '+
              web3.fromWei(events.args._amount, "ether") + 'ETH to '+
              events.args._to + ' which is ' +
              events.args._percent + '% of ' +
              web3.fromWei(events.args._total, "ether")
              +'ETH</li>'
            );
          } else {
            console.log(err);
          }
        });

        instance.configureFail({}, {}).watch((err, events) => {
          if (!err) {
            $('#events').append('<li class="list-group-item">Error: '+
              events.args.msg
              +'</li>'
            );
          } else {
            console.log(err);
          }
        });

        instance.configurePass({}, {}).watch((err, events) => {
          if (!err) {
            $('#events').append('<li class="list-group-item">Success: '+
              events.args.msg
              +'</li>'
            );
          } else {
            console.log(err);
          }
        });
      });
  },
};

$(() => {
  $(window).load(() => {
    App.init();
  });
});
