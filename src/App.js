import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
  },
  {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
  },
  ];

  //for column layout
const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};

//higher order function
//outer function takes the searchTerm (will be from text box) and binds it
//inner function is returned which takes an item and filters it
const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list,
      searchTerm: ''
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    
  }

  onSearchChange(event) {
    //update state when text box value changes
    this.setState({ searchTerm: event.target.value });
    }

  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  render() {
    let helloWord = 'Welcome to the Road2 to Learn React';
    let user = {firstname : "Ruby", lastname : "Hirsch"}
    const {searchTerm, list} = this.state;
    return (
      <div className="page">
        <h2>{helloWord}</h2>
        <p> Hi {user.firstname} ghostly {user.lastname}</p>
        <div classname="interactions">
        <Search
            value={searchTerm}
            onChange={this.onSearchChange}>
          Search222      
        </Search>
        </div>
          
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
          />
      </div>
    );
  }
}

//switch to a functional stateless component
//deconstruct props in the args
const Search = ({ value, onChange, children }) =>
  <form>
    {children} <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>&nbsp;{item.author}</span>
        <span style={smallColumn}>&nbsp;{item.num_comments}</span>
        <span style={smallColumn}>&nbsp;{item.points}</span>
        <span style={smallColumn}>&nbsp;
            <Button onClick={() => onDismiss(item.objectID)}
            className="button-inline">
            Dismiss
            </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className = '', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button">
    {children}
  </button>


export default App;
