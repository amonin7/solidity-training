import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
    /*
  * Just a state variable we use to store our user's public wallet.
  */
    const [currentAccount, setCurrentAccount] = useState('');
    const [allWaves, setAllWaves] = useState([]);
    const [message, setMessage] = useState("");
    const contractAddress = '0x3041c6fcA11496a551857a2Ce2D2145AcB5B746B';
    const contractABI = abi.abi;

    /*
     * Create a method that gets all waves from your contract
     */
    const getAllWaves = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
                /*
                 * Call the getAllWaves method from your Smart Contract
                 */
                const waves = await wavePortalContract.getAllWaves();
                /*
                 * We only need address, timestamp, and message in our UI so let's pick those out
                 */
                const wavesCleaned = waves.map(wave => {
                    return {
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    };
                });
                /*
                 * Store our data in React State
                 */
                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have metamask!');
                return;
            } else {
                console.log('We have the ethereum object', ethereum);
            }

            /*
             * Check if we're authorized to access the user's wallet
             */
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account:', account);
                setCurrentAccount(account);
                await getAllWaves()
            } else {
                console.log('No authorized account found');
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Implement your connectWallet method here
     */
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });

            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const changeMessage = async event => {
        setMessage(event.target.value);
    }

    const wave = async event => {
        event.preventDefault();
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let count = await wavePortalContract.getTotalWaves();
                console.log('Retrieved total wave count...', count.toNumber());

                /*
                * Execute the actual wave from your smart contract
                */
                const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 })
                console.log("Mining...", waveTxn.hash);

                await waveTxn.wait();
                console.log("Mined -- ", waveTxn.hash);

                count = await wavePortalContract.getTotalWaves();
                console.log("Retrieved total wave count...", count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Listen in for emitter events!
     */
    useEffect(() => {
        checkIfWalletIsConnected();
        let wavePortalContract;

        const onNewWave = (from, timestamp, message) => {
            console.log("NewWave", from, timestamp, message);
            setAllWaves(prevState => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                },
            ]);
        };

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
            wavePortalContract.on("NewWave", onNewWave);
        }

        return () => {
            if (wavePortalContract) {
                wavePortalContract.off("NewWave", onNewWave);
            }
        };
    }, []);

    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    👋 Hey, I am Andrey Minin!
                </div>

                <div className="bio">
                    I developed this smart-contract as a pet-project to understand,
                    how the smart contracts actually work. I'm ready to present this to you.
                    You can write some connect your wallet, write some message and post it into Ethereum Network.
                    This message will appear below.
                </div>

                <form onSubmit={wave}>
                    <input
                        type="text"
                        name="msg"
                        placeholder="Enter your message here"
                        onChange={changeMessage}
                    />
                    <input type="submit" value="Wave at Me" className="waveButton" />
                </form>

                {/*
                * If there is no currentAccount render this button
                */}
                {!currentAccount && (
                    <button className="waveButton" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                <div className="messagesHeader">Messages</div>
                {allWaves.map((wave, index) => {
                    return (
                        <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                            <div>Address: {wave.address}</div>
                            <div>Time: {wave.timestamp.toString()}</div>
                            <div>Message: {wave.message}</div>
                        </div>)
                })}
            </div>
        </div>
    );
};

export default App;