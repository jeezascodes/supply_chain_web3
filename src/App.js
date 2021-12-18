import React, { useState, useEffect } from 'react';
import ItemManager from './contracts/ItemManager.json';
import Item from './contracts/Item.json';
import getWeb3 from './getWeb3';

import './App.css';

export default function App() {
  const [sstorageValue, setsstorageValue] = useState(0);
  const [sweb3, setsweb3] = useState(null);
  const [contract, setcontract] = useState(null);
  const [itemContract, setitemContract] = useState(null);
  const [saccounts, setsaccounts] = useState(null);
  const [costInWei, setcostInWei] = useState(0);
  const [itemIdentifier, setitemIdentifier] = useState(null);

  async function initialize() {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      console.log(`networkId`, networkId);

      const deployedNetwork = ItemManager.networks[networkId];

      const instance = new web3.eth.Contract(
        ItemManager.abi,
        deployedNetwork && deployedNetwork.address
      );
      const instanceItem = new web3.eth.Contract(
        Item.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setsweb3(web3);
      setsaccounts(accounts);
      setcontract(instance);
      setitemContract(instanceItem);

      // this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  const handleOnChange = (e, id) => {
    switch (id) {
      case 'cost':
        setcostInWei(e.target.value);
        break;
      case 'identifier':
        setitemIdentifier(e.target.value);
        break;
      default:
        break;
    }
  };
  const handleSubmit = async () => {
    contract.methods
      .createItem(itemIdentifier, costInWei)
      .send({ from: saccounts[0] });
  };

  return (
    <div>
      {!sweb3 ? (
        <div>Loading Web3, accounts, and contract...</div>
      ) : (
        <div className='App'>
          <h1>Event trigger!</h1>
          <h2>Items</h2>
          <h2>Add item</h2>
          <label>cost in wei</label>
          <input
            type='text'
            value={costInWei}
            onChange={(value) => handleOnChange(value, 'cost')}
          />
          <label>item identifier</label>
          <input
            type='text'
            value={itemIdentifier}
            onChange={(value) => handleOnChange(value, 'identifier')}
          />
          <button onClick={() => handleSubmit()}>Create item</button>
        </div>
      )}
    </div>
  );
}
