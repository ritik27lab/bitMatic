import {useNavigation, useRoute} from '@react-navigation/native';
import {ethers} from 'ethers';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import '../../shim';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import walletStore from '../mobxStore/walletStore';


export const TransactionScreen = observer(() => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const privateKeyRoute: any = route.params?.privateKey;
  const bitcoin = require('bitcoinjs-lib');
  const [amount, setAmount] = useState('');

  const [transactionStatus, setTransactionStatus] = useState('');
  const [privateKey, setPrivateKey] = useState(privateKeyRoute);
  const [transactionLink, setTransactionLink] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');

  const BackButton = () => {
    return (
      <TouchableOpacity
        style={{padding: 10, marginTop: 25}}
        onPress={() => navigation.goBack()}>
        <Text style={{color: '#0060B1', fontSize: 16, fontWeight: '600'}}>
          Back
        </Text>
      </TouchableOpacity>
    );
  };

  const sendBitcoinTransaction = (privateKey: string,recipientAddress: string,amountBTC: any,) => {
    try {
      const network = bitcoin.networks.testnet; //'bitcoin.networks.bitcoin'
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
      const tx = new bitcoin.TransactionBuilder(network);

      const amountSatoshis = Math.floor(amountBTC * 1e8);
      tx.addOutput(recipientAddress, amountSatoshis);
      tx.sign(0, keyPair); 
      const rawTransaction = tx.build().toHex();
      console.log('Raw Transaction:', rawTransaction);
      console.log('Broadcast this transaction on a Bitcoin explorer.');
      runInAction(()=> {
        walletStore.addTransaction(rawTransaction)
      })
      return rawTransaction;


    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error; // Rethrow the error to handle it elsewhere, if needed
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
      <BackButton />

      <Text style={styles.headerText}>Send Bitcoin Transaction</Text>
      <View style={styles.formContainer}>
        <Text style={styles.text}>Private Key:</Text>
        <TextInput
          placeholder="Enter private key"
          value={privateKey}
          onChangeText={text => setPrivateKey(text)}
          style={styles.input}
        />
        <Text style={styles.text}>Receiver Address:</Text>
        <TextInput
          placeholder="Enter receiver address"
          value={receiverAddress}
          onChangeText={text => setReceiverAddress(text)}
          style={styles.input}
        />
        <Text style={styles.text}>Amount BTC:</Text>
        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={text => setAmount(text)}
          style={styles.input}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          sendBitcoinTransaction(privateKeyRoute, receiverAddress, amount)
        }>
        <Text style={styles.buttonText}>Send Transaction</Text>
      </TouchableOpacity>
      {transactionLink && (
        <View style={styles.transactionLink}>
          <Text style={styles.text}>Transaction Link:</Text>
          <Text style={styles.transactionLinkText}>{transactionLink}</Text>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    marginVertical: 20,
    padding: 10,
    borderColor: '#fff',
    color: 'white',
  },
  text: {
    color: '#fff',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  formContainer: {
    padding: 10,
    marginTop: '10%',
  },

  button: {
    height: 40,
    width: '95%',
    backgroundColor: '#0060B1',
    marginTop: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
  },
  transactionLink: {
    marginTop: 20,
  },
  transactionLinkText: {
    color: 'white',
    fontSize: 18,
  },
});
