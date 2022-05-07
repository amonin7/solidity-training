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