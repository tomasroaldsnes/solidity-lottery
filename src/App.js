import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''

  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }
  
  onPick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Picking winner...'})

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message: 'Winner has been picked!'})
  }

  onEnter = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting for transaction to finish sending...'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'Transaction finished! You are now entered in lottery.'})
    
  }

  render() {  
    return (
     <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {this.state.manager} </p>
      <p>There are currently {this.state.players.length} playing, competing for {web3.utils.fromWei(this.state.balance, 'ether')} ether.
      </p>

      <hr/>
      <form onSubmit={this.onEnter}>
      <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ehter to enter</label>
          <input 
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}/>

        </div>
        <button>Enter</button>
        </form>
        <hr/>
        <h4>Pick a Winner</h4>
        <button onClick={this.onPick}>Pick</button>
        <hr/>
        <h1>{this.state.message}</h1>
     </div>
    );
  }
}

export default App;


