import React from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';
import shortid from 'shortid'
import TodoForm from './TodoForm';
import TodoItems from './TodoItems';
import cryptoutils from '../util/crypto';



export default class TodoList extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
          todoItems: [],
          isLoading: true
      }
      
    }
  
    componentDidMount() {
        log.debug("TodoList Mounted");
        let itemsFromStorage = localStorage.getItem('todoitems');
        this.setState( prevState => ({
            todoItems: itemsFromStorage ? JSON.parse(itemsFromStorage) : [],
            isLoading: false
        }))

    }

    componentDidUpdate(prevProps, prevState) {
        localStorage.setItem('todoitems', JSON.stringify(this.state.todoItems));
    }


    loadMembers() {
        //   MemberApi.getAllMembers()
        //            .then( (members) => this.setState( () => ({ members: members }) ))
        //            .catch( error => { throw(error); })
    }

    handleSubmit = (newtaskdescription) => {
        log.debug(`task is ${newtaskdescription}`);
        const newtask = {
            id: shortid.generate(), 
            description: newtaskdescription,
            completed: false
        }; 
        
        this.setState( prevState => ({
            todoItems: [...prevState.todoItems, newtask]
        }));
    } 


    handleClearItem = (item, e) => {
        log.debug(`task cleared is ${item.description}`);
        const newitems = this.state.todoItems.map( i => 
            ( i.id === item.id 
                ? { ...i, completed: !i.completed } 
                : i ));
        this.setState( () => ({
            todoItems: newitems
        }));
    } 

    render() {

      const {todoItems} = this.state;

      return (
          <div className="container todolist"> 
            <TodoForm onSubmit={this.handleSubmit} />
            <TodoItems items={todoItems} onClearItem={this.handleClearItem}/>         
          </div>
        );
    }
  }
  
