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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    
  }

  needsToSearchTopStories(searchTerm) {
    //check if there is a cache entry for searchTerm
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const {searchKey, results} = this.state;
    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

    const updatedHits = [...oldHits, ...hits];
    
    this.setState({
      results: {
        ...results, 
        [searchKey] : {hits: updatedHits, page}
      }
    });
  }

  onSearchChange(event) {
    //update state when text box value changes
    this.setState({ searchTerm: event.target.value });
    }

  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    //id param is captured in a closure
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({ 
      //result: Object.assign({}, this.state.result, { hits: updatedHits})
      //need to eval searchKey, which is wny we use [searchKey] instead of searchKey
      results: { ...results, 
        [searchKey] : {hits: updatedHits, page }
      }
     });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    console.log("trying to fetch ", `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => this.setState({error}));
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    //to stop page reloads
    event.preventDefault();
  }

  render() {
    let helloWord = 'Welcome to the Road2 to Learn React';
    let user = {firstname : "Bubby", lastname : "Page"}
    const {searchTerm, results, searchKey, error} = this.state;
    const page = (results && 
                  results[searchKey] &&
                  results[searchKey].page
    ) || 0;

    const list = (
                  results &&
                  results[searchKey] &&
                  results[searchKey].hits
    ) || [];

    if (error) {
      return <p>Something went wrong!</p>;
    }


    return (
      <div className="page">
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
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
          
        <Table
          list={list}
          onDismiss={this.onDismiss}
          />
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
