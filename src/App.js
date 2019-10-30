import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//values needed to do searches at hackernews
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = "hitsPerPage="

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
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const oldHits = page !== 0
    ? this.state.result.hits
    : [];

    const updatedHits = [...oldHits, ...hits];
    
    this.setState({
      result: {hits: updatedHits, page}
    });
  }

  onSearchChange(event) {
    //update state when text box value changes
    this.setState({ searchTerm: event.target.value });
    }

  onDismiss(id) {
    //id param is captured in a closure
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      //result: Object.assign({}, this.state.result, { hits: updatedHits})
      result: { ...this.state.result, hits: updatedHits }
     });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    console.log("trying to fetch ", `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    //to stop page reloads
    event.preventDefault();
  }

  render() {
    let helloWord = 'Welcome to the Road2 to Learn React';
    let user = {firstname : "Bubby", lastname : "Page"}
    const {searchTerm, result} = this.state;
    const page = (result && result.page) || 0;


    return (
      <div className="App">
        <h2>{helloWord}</h2>
        <p> Hi {user.firstname} {user.lastname}</p>
        <div className="interactions">
        <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
          Search      
        </Search>
        </div>

        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
          
        { result &&
        <Table
          list={result.hits}
          onDismiss={this.onDismiss}
          />
        }
        
      </div>
    );
  }
}

//switch to a functional stateless component
//deconstruct props in the args
const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children} 
    </button>
  </form>

const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
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
