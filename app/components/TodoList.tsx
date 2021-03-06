import * as React from 'react';
import { ITask } from '../models/ITask';
import TodoRepo from '../util/TodoRepo';
import Spinner from './Spinner';
import TodoForm from './TodoForm';
import TodoItems from './TodoItems';

import log from 'loglevel';
import shortid from 'shortid';

interface ITodoListState {
    todoItems: ITask[];
    isLoading: boolean;
}

const initialState: ITodoListState = {
    isLoading: true,
    todoItems: [],
};

export default class TodoList extends React.Component<object, ITodoListState> {

    public state: Readonly<ITodoListState> = initialState;

    public componentDidMount() {
        log.debug('TodoList Mounted');
        TodoRepo.loadTasks().then(tasks => {
            log.debug('Setting todolist state');

            this.setState(() => ({
                isLoading: false,
                todoItems: tasks,
            }));
        });
    }

    public componentDidUpdate() {
        log.debug('TodoList - component did update');
        localStorage.setItem('todoitems', JSON.stringify(this.state.todoItems));
    }

    public handleSubmit = (newtaskdescription: string) => {
        log.debug(`task is ${newtaskdescription}`);
        const newtask: ITask = {
            completed: false,
            description: newtaskdescription,
            id: shortid.generate(),
        };

        this.setState(prevState => ({
            todoItems: [...prevState.todoItems, newtask]
        }));
    }

    public handleClearCompleted = () => {
        const nonCompletedItems = this.state.todoItems.filter(i => !i.completed);
        this.setState(() => ({
            todoItems: nonCompletedItems
        }));
    }

    public handleClearItem = (item: ITask) => {
        log.debug(`task cleared is ${item.description}`);
        const newitems = this.state.todoItems.map(i =>
            (i.id === item.id
                ? { ...i, completed: !i.completed }
                : i
            ));
        this.setState(() => ({
            todoItems: newitems
        }));
    }

    public render() {

      const {todoItems, isLoading} = this.state;

      return (
          <div className="container todolist">
            <TodoForm onSubmit={this.handleSubmit} onClear={this.handleClearCompleted} />
            { isLoading
            ? <Spinner/>
            : <TodoItems items={todoItems} onClearItem={this.handleClearItem}/>
            }
          </div>
        );
    }
  }
