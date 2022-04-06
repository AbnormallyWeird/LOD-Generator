var todoItems = [];
var teams = [];

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleString()
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.setState({
      time: new Date().toLocaleString()
    });
  }
  render() {
    return (
      <p className="App-clock">
        The time is {this.state.time}.
      </p>
    );
  }
}

class TodoList extends React.Component {
  render() {
    var items = this.props.items.map((item, index) => {
      return (
        <LODSignups
          key={index}
          item={item}
          index={index}
          removeItem={this.props.removeItem}
          markTodoDone={this.props.markTodoDone}
        />
      );
    });
    return <ul className="list-group"> {items} </ul>;
  }
}

class LODSignups extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
  }
  onClickClose() {
    var index = parseInt(this.props.index);
    this.props.removeItem(index);
  }
  onClickDone() {
    var index = parseInt(this.props.index);
    this.props.markTodoDone(index);
  }
  render() {
    var todoClass = this.props.item.done ? "done" : "undone";
    return (
      <li className="list-group-item ">
        <div className={todoClass}>
          <span
            className="glyphicon glyphicon-ok icon"
            aria-hidden="true"
            onClick={this.onClickDone}
          ></span>
          {this.props.item.value}
          <button type="button" className="close" onClick={this.onClickClose}>
            &times;
          </button>
        </div>
      </li>
    );
  }
}

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.refs.itemName.focus();
  }
  onSubmit(event) {
    event.preventDefault();
    var newItemValue = this.refs.itemName.value;

    if (newItemValue) {
      this.props.addItem({ newItemValue });
      this.refs.form.reset();
    }
  }
  render() {
    return (
      <form ref="form" onSubmit={this.onSubmit} className="form-inline">
        <input
          type="text"
          ref="itemName"
          className="form-control"
          placeholder="Enter your name"
        />
        <button type="submit" className="btn btn-default">
          Add
        </button>
      </form>
    );
  }
}

class TodoHeader extends React.Component {
  render() {
    return <h1>LOD Signups {todoItems.length}</h1>;
  }
}

class GenerateTeams extends React.Component {
  constructor(props) {
    super(props);
  }

  randomizeEm(){
    if (todoItems.length % 2 != 0) {
      teams = ["You're odd foo that won't work"];
    } else {
      teams = [];
      let shuffled = todoItems
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

      while(shuffled.length != 0){
        teams.push(shuffled[0].value + " and " + shuffled[1].value);
        shuffled.shift();
        shuffled.shift();
      }
      console.log(teams);
      setState({value: (props.value + 1)});
    }
  }

  render() {
    const list = teams.map((team,index) =>
      <p key={index}>{ team }</p>
    );
    return (
      <div className="text-center">
        <button className="btn btn-default" onClick={this.randomizeEm}>Randomize teams</button>
        <br />
        <br />
        { list }
      </div>
    )
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markTodoDone = this.markTodoDone.bind(this);
    this.markPaid = this.markPaid.bind(this);
    this.state = { todoItems: todoItems };
  }
  addItem(todoItem) {
    todoItems.unshift({
      index: todoItems.length + 1,
      value: todoItem.newItemValue,
      done: false,
    });
    this.setState({ todoItems: todoItems });
  }
  removeItem(itemIndex) {
    todoItems.splice(itemIndex, 1);
    this.setState({ todoItems: todoItems });
  }
  markPaid(itemIndex) {
    //TODO build out a paid button
  }
  markTodoDone(itemIndex) {
    var todo = todoItems[itemIndex];
    todoItems.splice(itemIndex, 1);
    todo.done = !todo.done;
    todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
    this.setState({ todoItems: todoItems });
  }
  render() {
    return (
      <div id="main">
        <Clock />
        <TodoHeader />
        <TodoList
          items={this.props.initItems}
          removeItem={this.removeItem}
          markTodoDone={this.markTodoDone}
        />
        <TodoForm addItem={this.addItem} />
        <br />
        <GenerateTeams />
      </div>
    );
  }
}

ReactDOM.render(
  <TodoApp initItems={todoItems} />,
  document.getElementById("app")
);
