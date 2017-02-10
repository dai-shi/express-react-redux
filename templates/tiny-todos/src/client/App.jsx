import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

const Home = ({ todos, addTodo }) => {
  const onSubmit = (event) => {
    event.preventDefault();
    const ele = event.target.getElementsByTagName('input')[0];
    addTodo({ text: ele.value });
    ele.value = '';
  };
  return (
    <div>
      <h1>TODOs</h1>
      <ul>
        {todos.map(({ text }) => <li>{text}</li>)}
        <li>
          <form onSubmit={onSubmit}>
            <input type="text" />
          </form>
        </li>
      </ul>
    </div>
  );
};

Home.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
  })).isRequired,
  addTodo: PropTypes.func.isRequired,
};

const mapStateToProps = ({ todos }) => ({ todos });
const mapDispatchToProps = dispatch => ({
  addTodo: todo => dispatch({ type: 'ADD_TODO', todo }),
});

const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);

const About = () => (
  <div>
    <h1>About</h1>
    <p>This is a tiny TODO app example</p>
  </div>
);

const App = () => (
  <Router history={browserHistory}>
    <Route path="/" component={ConnectedHome} />
    <Route path="/about" component={About} />
  </Router>
);

export default App;
