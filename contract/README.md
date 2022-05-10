# Solidity training

### Deploy notes:
1. to run the smart contract:
```shell
npx hardhat run scripts/run.js
```
2. to deploy the contract on local network (like server)
```shell
npx hardhat run scripts/deploy.js --network localhost
```
3. to deploy the contract on real test Ethereum network
```shell
npx hardhat run scripts/deploy.js --network rinkeby
```
**Note:** in order to do this you need to have a `.env` file in the project root directory.
The file should contain two things:
```properties
STAGING_ALCHEMY_KEY=<the particular link to your alchemy API/network>
PRIVATE_KEY=<your ethereum account 32-byte private key\
  (the account should be also in rinkeby test network)>
```
For example `.env` file:
```properties
STAGING_ALCHEMY_KEY=https://eth-rinkeby.alchemyapi.io/v2/<my alchemy api key>
PRIVATE_KEY=943cc...
```

### Re-deploy notes:
So, now that we've updated our contract we need to do a few things:
1. We need to deploy it again.
2. We need to update the contract address on our frontend.
3. We need to update the abi file on our frontend. 

So what we'll need to do now is:
1. Deploy again using `npx hardhat run scripts/deploy.js --network rinkeby`
2. Change contractAddress in `App.js` to be the new contract address we got from the step above in the terminal just like we did before the first time we deployed.
3. Get the updated abi file from `artifacts/contracts/WavePortal.sol/WavePortal.json` like we did before and copy-paste it into Replit just like we did before.