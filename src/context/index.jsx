import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import CrowdFunding from '../../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json'
import Web3 from "web3";


const StateContext = createContext();

export const StateContextProvider =  ({ children }) => {
    let web3;
    
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
    } else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rpc.ankr.com/eth_sepolia'
    );
    web3 = new Web3(provider);    
    }

    const instance = new web3.eth.Contract(CrowdFunding.abi, "0x64Cf5CD87f51f69F54F8D8A33ADb9789d178F504")

    return(
        <StateContext.Provider value={{ instance, web3 }}>
            {children}
        </StateContext.Provider>
    )
    
}

export const useStateContext = ()  => useContext(StateContext);
  