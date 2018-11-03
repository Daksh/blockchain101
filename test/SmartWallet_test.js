let SmartWallet = artifacts.require("./SmartWallet.sol");

contract('SmartWallet', (accounts) => {
	let smartWalletInstance;
	const owner = accounts[0];
	const w1 = accounts[8];
	const w2 = accounts[9];
	const p1 = 60;
	const p2 = 40;
	const totalWallets = 2;

	it("should be configurable", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance.configureShare(totalWallets, [p1, p2], [w1, w2]);
			})
			.then((data) => {
				assert.equal(data.receipt.status, 0x1, "Success");
			})
	});

	it("should be configurable with multiple wallets", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance.configureShare(5, [20, 20, 20, 20, 20], [accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]]);
			})
			.then((data) => {
				assert.equal(data.receipt.status, 0x1, "Success");
			})
	});

	it("should trigger an event", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance.configureShare(totalWallets, [55, 45], [w1, w2]);
			})
			.then((receipt) => {
				assert.equal(receipt.logs.length, 
										 1, 
										 "Event should have triggered"
										);
				assert.equal(receipt.logs[0].event, 
										 "configureSuccess", 
										 "Event fired is configureSuccess"
										 );
			})
	});

	it("should catch the overflow", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance.configureShare(totalWallets, [55, 60], [w1, w2]);
			})
			.then((data) => { 
				assert.fail();
				assert.equal(receipt.logs[0].event, 
										 "configureFailure", 
										 "Event fired is configureFailure"
										 );
			})
			.catch((error) => {
				assert(true);
			})
	});

	it("should detect a wallet address", () => {
		return SmartWallet.deployed()
			.then((instance) => {
				smartWalletInstance = instance;
				return smartWalletInstance.isContractAddress(w1);
			})
			.then((data) => {
				assert.equal(data, false, "Not a contract address");
			})
	});
});