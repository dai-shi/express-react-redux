import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const App = ({ todos, addTodo }) => {
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

App.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
  })),
  addTodo: PropTypes.func,
};

const mapStateToProps = ({ todos }) => ({ todos });
const mapDispatchToProps = dispatch => ({
  addTodo: todo => dispatch({ type: 'ADD_TODO', todo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

