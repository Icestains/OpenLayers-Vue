
export default {
    doneTodos: state => {
        return state.todos.filter(todo => todo.done)
    },

}