class TaskInput extends React.Component{
    constructor(props){
        super(props);
        this.state={text:''}
    };

    handleTaskAdd = () => {
        if(this.state.text){
            let newTask = {};
            newTask.id = Date.now();
            newTask.isComplete = false;
            newTask.text = this.state.text;
            this.props.onTaskAdd(newTask);
            this.setState({text:''});
        }
    };

    handleTextChange = (event) => {
        this.setState({text: event.target.value});
    };

    handleKeyPress = (event) => {
        if(event.key == 'Enter' && this.state.text !== ''){
            this.handleTaskAdd();
        };
    };

    render(){
        return(
            <div className="row input-group m-0">
                <input type="text" ref="input" className="form-control" onChange={this.handleTextChange} onKeyPress={this.handleKeyPress} value={this.state.text} placeholder="What you need to do?"></input>
                <span className="input-group-btn"><button className="btn btn-secondary" onClick={this.handleTaskAdd}>Add</button></span>
            </div>
        );
    };
};

class TaskList extends React.Component{
    constructor(props){
        super(props);
    };

    toggleTask = (task) => {
        this.props.onToggleTask(task);
    };

    handleTaskDelete = (task) => {
        this.props.onTaskDelete(task);
    };

    render(){
        return(
            <div className="row list">
            {
                this.props.tasks.map((task) => {
                    return(

                        <label key={task.id} className="row col-12 custom-control custom-checkbox task">
                            <input type="checkbox" onChange={this.toggleTask.bind(null, task)} checked={task.isComplete} className="custom-control-input"/>
                            <span className="custom-control-indicator"></span>
                            <span className={"custom-control-description" + (task.isComplete && ' completed')}>{task.text}</span>
                            <button aria-label="Close" className="close delete-task" onClick={this.handleTaskDelete.bind(null, task)}><span aria-hidden="true">&times;</span></button>
                        </label>
                    );
                })
            }
            </div>
        );
    };
};

class Filter extends React.Component{
    constructor(props){
        super(props);
        this.state = {filters : ['all','new', 'completed']}
    };

    handleFilterChange = (filter) => {
        this.props.onFilterChange(filter);
    };

    render(){
        return(
            <div className="d-inline">
                {
                    this.state.filters.map((el) => {
                        return(
                            <label key={el} onClick={this.handleFilterChange.bind(null, el)} className="custom-control custom-radio">
                                <input id="radioStacked2" name="filter" type="radio" readOnly className="custom-control-input" value={el} checked={el === this.props.filter}/>
                                <span className="custom-control-indicator"></span>
                                <span className="custom-control-description text-capitalize">{el}</span>
                            </label>
                        );
                    })
                }
            </div>
        );
    };
};

class TodoListApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tasks: [],
            filter: 'all'
        };
    };

    componentDidMount = () => {
        let localTasks = JSON.parse(localStorage.getItem('tasks'));
        if (localTasks) {
            this.setState({ tasks: localTasks });
        }
    };

    componentDidUpdate = () => {
        this._updateLocalStorage();
    };

    handleTaskAdd = (newTask) => {
        let newTasks = this.state.tasks.slice();
        newTasks.unshift(newTask);
        this.setState({tasks:newTasks});
    };

    toggleTask = (task) => {
        let newTasks = this.state.tasks.map((el) => {
            if(el.id === task.id){
                el.isComplete = !el.isComplete;
            }
            return el;
        });
        this.setState({tasks: newTasks});
    };

    handleTaskDelete = (task) => {
        let newTasks = this.state.tasks.filter(function(el) {
            return el.id !== task.id;
        });
        this.setState({ tasks: newTasks });
    };

    handleFilterChange = (filter) => {
        this.setState({filter: filter});
    };

    render(){
        let displayedTasks = [];
        if(this.state.filter === 'new'){
            displayedTasks = this.state.tasks.filter((el) => {
                return !el.isComplete && el
            });
        }else if(this.state.filter === 'completed'){
            displayedTasks = this.state.tasks.filter((el) => {
                return el.isComplete && el
            });
        }else {
            displayedTasks = this.state.tasks;
        }

        return (
            <div className="container-fluid text-center app">
                <TaskInput onTaskAdd={this.handleTaskAdd} />
                <TaskList tasks={displayedTasks} onToggleTask={this.toggleTask} onTaskDelete={this.handleTaskDelete}/>
                {
                    this.state.tasks.length != 0 && <Filter filter={this.state.filter} onFilterChange={this.handleFilterChange}/>
                }
            </div>
        );
    };

    _updateLocalStorage = () => {
        let tasks = JSON.stringify(this.state.tasks);
        localStorage.setItem('tasks', tasks);
    };
};

ReactDOM.render(
    <TodoListApp />,
    document.getElementById('app')
);