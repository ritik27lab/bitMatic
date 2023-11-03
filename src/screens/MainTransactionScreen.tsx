import { useNavigation, useRoute } from "@react-navigation/native";
import { ethers } from "ethers";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  FlatList,
  Alert,
} from "react-native";
import { provider } from "./components/provider";
import { observer } from "mobx-react";
import walletStore from "../mobxStore/walletStore";
import { runInAction } from "mobx";

export const MainTransactionScreen = observer(() => {
  const navigation:any = useNavigation();
  const route: any = useRoute();
  const network: any = route.params?.network;
  const address: any = route.params?.wallet;
  const privateKey: any = route.params?.privateKey;

  const [amount, setAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");

  const [transactionLink, setTransactionLink] = useState("");
  const [receiverAddress, setReceiverAddress] = useState(""); 
  const [senderAddress, setSenderAddress] = useState(""); 


  const BackButton = () => {
    return (
      <TouchableOpacity
        style={{ padding: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#0060B1", fontSize: 16, fontWeight: "600" }}>
          Back
        </Text>
      </TouchableOpacity>
    );
  };

  const sendTransaction = async () => {
    try {
      
      // const wallet = new ethers.Wallet(address.address, provider); // Replace with your private key

      const wallet: any = new ethers.Wallet(
        privateKey, //wallet private key
        provider
      );

      (receiverAddress == '') &&
        Alert.alert('Enter receiver address')
      

      const transaction = {
        to: receiverAddress,
        value: ethers.parseEther(amount),
      };

      
      const tx = await wallet.sendTransaction(transaction);
      const transactionHash = tx.hash;

      const transactionToStore = {
        receiverAddress: receiverAddress,
        amount: amount,
        transactionHash: transactionHash,
      };

      runInAction(()=> {
        walletStore.addTransaction(transactionToStore)
      })


      // Generate the transaction link using a Polygon block explorer (Polygonscan)
      const explorerLink = `https://polygonscan.com/tx/${transactionHash}`;
      setTransactionLink(explorerLink);

      console.log("Transaction sent:", transactionHash);
    } catch (error:any) {
      Alert.alert(error)
    }
  };

  const openTransactionLink = () => {
    if (transactionLink) {
      Linking.openURL(transactionLink);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <BackButton />

      <View style={{padding: 10, marginTop: '10%'}}>
        <Text style={styles.text}>Senders Address:</Text>
        <TextInput
          placeholder="Enter sender address"
          value={walletStore.wallet.address || senderAddress}
          onChangeText={(text) => setSenderAddress(text)}
          style={styles.input}
        />
        <Text style={styles.text}>Receiver Address:</Text>
        <TextInput
          placeholder="Enter receiver address"
          value={receiverAddress}
          onChangeText={(text) => setReceiverAddress(text)}
          style={styles.input}
        />

        <Text style={styles.text}>Amount:</Text>
        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={{
          height: 40,
          width: "95%",
          backgroundColor: "#0060B1",
          marginTop: 50,
          justifyContent: "center",
          alignSelf: 'center'
        }}
        onPress={sendTransaction}
      >
        <Text style={{ alignSelf: "center", color: "white", fontSize: 18 }}>
          Send Transaction
        </Text>
      </TouchableOpacity>

      <FlatList
        data={walletStore.transactionHistory}
        keyExtractor={(item) => item.transactionHash}
        renderItem={({ item }) => (
          <View style={{padding: 10, marginVertical: 10}}>
            <Text style={styles.text}>Receiver: {item.receiverAddress}</Text>
            <Text>Amount: {item.amount} ETH</Text>
            <Text>Transaction Hash: {item.transactionHash}</Text>
          </View>
        )}/>

      {transactionLink && (
        <View>
          <Text>Transaction Link:</Text>
          <Text>{transactionLink}</Text>
          <TouchableOpacity onPress={openTransactionLink}>
            <Text style={{ alignSelf: "center", color: "white", fontSize: 18 }}>
         
              Transaction Link
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    borderWidth: 1,
    marginVertical: 20,
    padding: 10,
    borderColor: '#fff',
    color: '#fff'
  },
  text:{
    color: 'white'
  }
});


