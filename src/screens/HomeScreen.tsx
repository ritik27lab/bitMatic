import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Switch,
} from 'react-native';
import '@ethersproject/shims';
import CryptoPriceChart from './components/CryptoPriceChart';
import {useNavigation} from '@react-navigation/native';
import {StatusBarComponent} from './components/StatusBarComponent';
import {observer} from 'mobx-react';
import walletStore from '../mobxStore/walletStore';
import {provider} from './components/provider';

export const HomeScreen = observer(() => {
  const navigation: any = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const connectWallet = async () => {
    walletAddress == ''
      ? Alert.alert('Enter Wallet Address')
      : await walletStore.connectWallet(walletAddress);
  };

  const sendTransactionScreen = () => {
    navigation.navigate('MainTransactionScreen',{
      privateKey:privateKey
    });
  };

  const bitCoinScreen = () => {
    navigation.navigate('BitcoinScreen');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBarComponent />

      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: 50,
        }}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          Crypto
          <Text
            style={[
              styles.text,
              isDarkMode && styles.darkText,
              {fontSize: 32, fontWeight: '700', fontStyle: 'italic'},
            ]}>
            X
          </Text>
        </Text>
        <TouchableOpacity onPress={bitCoinScreen} style={{}}>
          <Text
            style={[
              styles.text,
              isDarkMode && styles.darkText,
              {fontSize: 15, marginTop: 15},
            ]}>
            Connect BTC network
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {walletStore.wallet ? (
          <View style={styles.wrapper}>
            <>
              <Text style={styles.walletAddressText}>
                Your wallet address: {walletStore.wallet.address}{' '}
              </Text>
              <Text style={styles.walletAmountText}>
                Wallet amount: {walletStore.balance}
              </Text>
            </>

            <TouchableOpacity
              style={styles.button}
              onPress={sendTransactionScreen}>
              <Text style={styles.connectText}>Send Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.wrapper}>
            <TextInput
              placeholder="Enter private key"
              value={privateKey}
              onChangeText={(text: any) => setPrivateKey(text)}
              style={styles.input}
              placeholderTextColor={'white'}
            />
            <TextInput
              placeholder="Enter wallet address"
              value={walletAddress}
              onChangeText={(text: any) => setWalletAddress(text)}
              style={styles.input}
              placeholderTextColor={'white'}
            />
            <TouchableOpacity
              style={{
                height: 40,
                width: '95%',
                backgroundColor: '#fff',
                alignSelf: 'center',
                marginVertical: 5,
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={connectWallet}>
              <Text style={styles.connectText}>Connect Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.footerWrapper}>
          <Text style={styles.livePrices}>Live Prices </Text>
          <CryptoPriceChart />
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.transactionHistory}>
              View Transaction History
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
           
              <FlatList
                data={walletStore.transactionHistory}
                style={{flex: 1, width: '100%'}}
                keyExtractor={(item: any) => item.transactionHash}
                renderItem={({item}) => (
                  
                  <View style={styles.cardContainer}>
                    <Text style={styles.receiverText}>
                      Receiver: {item.receiverAddress}
                    </Text>
                    <Text style={styles.amountText}>
                      Amount: {item.amount} ETH
                    </Text>
                    <Text style={styles.transactionHashText}>
                      Transaction Hash: {item.transactionHash}
                    </Text>
                  </View>
                )}
              />
            
          </View>
        </Modal>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: 'black',
  },
  text: {
    fontSize: 25,
    color: 'black',

    fontWeight: '700',
  },
  darkText: {
    color: 'white',
    fontWeight: '700',
  },
  connectText: {
    alignSelf: 'center',
    color: '#0060B1',
    fontSize: 18,
    fontWeight: '500',
  },

  wrapper: {
    height: 200,
    width: '95%',
    backgroundColor: '#0060B1',
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 20,
  },
  footerWrapper: {
    height: '60%',
    width: '95%',
    padding: 10,
    backgroundColor: '#0060B1',
    alignSelf: 'center',
    marginTop: 80,
    borderRadius: 20,
  },
  walletAddressText: {
    padding: 15,
    fontWeight: '500',
    color: '#fff',
    width: '95%',
  },
  walletAmountText: {
    padding: 15,
    fontWeight: '800',
    color: '#fff',
    width: '95%',
    fontSize: 15,
  },
  livePrices: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    marginTop: '10%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
  },
  closeButton: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'flex-end',
    padding: 10,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 0.5,
    marginVertical: 10,
    padding: 10,
    color: 'white',
    fontWeight: '600',
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  receiverText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 14,
  },
  transactionHashText: {
    fontSize: 12,
    color: 'gray',
  },
  transactionHistory: {
    color: 'white',
    fontSize: 15,
    padding: 15,
    marginTop: '10%',
    textDecorationLine: 'underline',
  },
  button: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginVertical: 28,
    justifyContent: 'center',
    borderRadius: 10,
  },
});
