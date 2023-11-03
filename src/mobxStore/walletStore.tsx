// WalletStore.js

import { observable, action, makeObservable } from 'mobx';
import { ethers } from 'ethers';
import { provider } from '../screens/components/provider';
import { keys } from './keys';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import the async-storage module



class WalletStore { 
  wallet:any = null;
  balance = 0;
  walletAddress = '';
  updatebalance = 0;
  transactionHistory:any = [];

  constructor() {
    makeObservable(this, {
      wallet: observable,
      balance: observable,
      transactionHistory: observable,
      connectWallet: action,
    });
  }



    updateWallet(address:any, balance:any) {
    this.walletAddress = address;
    this.balance = balance;
  }

    async addTransaction(transaction:any) {

    this.transactionHistory.push(transaction);
    try {
        // Store the updated transaction history in AsyncStorage
        await AsyncStorage.setItem('transactionHistory', JSON.stringify(this.transactionHistory));
      } catch (error) {
        console.error('Error storing transaction history:', error);
      }
  }



  async connectWallet(address:any) {
    try {
  
      const wallet = new ethers.Wallet(keys.PRIVATE_KEY, provider);
      this.wallet = wallet;

    //   const address = wallet.address;
      const balance = await provider.getBalance(address);

      this.balance = Number(ethers.formatEther(balance));

      console.log("BBBBBBB", balance)
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  }
}

const walletStore = new WalletStore();
export default walletStore;
