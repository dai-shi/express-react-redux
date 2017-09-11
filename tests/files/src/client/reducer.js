export default (state = { todos: [] }, action) => {
  if (action.type === 'ADD_TODO') {
    return {
      ...state,
      todos: [...state.todos, action.todo],
    };
  }
  return state;
};
