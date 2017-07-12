class Note extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        let style = {backgroundColor: this.props.color};
        return(
            <div className="note text-left" style={style}>
                <span className="fa fa-times delete-note" onClick={this.props.onDelete}></span>
                {this.props.children}
            </div>
        );
    };
};

class NoteEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: '',
            pickedColor: ''
        };
    };

    handleTextChange = (event) => {
        this.setState({ text: event.target.value });
    };

    handleNoteAdd = (event) => {
        if(this.state.text !== ''){
            let newNote = {
                text: this.state.text,
                color: this.state.pickedColor,
                id: Date.now()
            };

            this.props.onNoteAdd(newNote);
            this.setState({ text: '' });
        }
        
    };

    onColorPick = (color) => {
        this.setState({
            pickedColor: color
        });
    };     

    render(){
        return(
            <div className="note-editor col-12 col-sm-10 col-md-8 col-lg-6 mx-auto">
                <textarea
                    placeholder="Enter your note here..."
                    rows={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <div className="d-flex justify-content-between">
                    <ColorPicker onColorPick={this.onColorPick} pickedColor={this.state.pickedColor}/>
                    <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
                </div>
            </div>
        );
    };
};

class ColorPicker extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            colors: ['#ff5f5f','#ffb65f','#feff5f','#a6ff5f','#5ffff6','#5f92ff','#ce5fff']
        }
    };

    componentDidMount = () => {
        !(this.props.pickedColor) && this.handlePick(this.state.colors[0]);
    }

    handlePick = (color) => {
        this.props.onColorPick(color);
    };

    render(){
        return(
            <div className="d-flex">
                {
                    this.state.colors.map((color) => {
                        return(
                            <span key={color} className={"color-cell rounded-circle d-inline-block my-auto " + (color === this.props.pickedColor && "fa fa-check")} onClick={this.handlePick.bind(null, color)} style={{backgroundColor: color}}></span>
                        );
                    })
                }
            </div>
        );
    };
};

class NotesGrid extends React.Component{
    constructor(props){
        super(props);
    };

    componentDidMount = () => {
        let grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        };
    };

    render() {
        let onNoteDelete = this.props.onNoteDelete;

        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function(note){
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        );
    };
};

class NotesApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            notes: []
        }
    };

    componentDidMount = () => {
        let localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes });
        }
    };

    componentDidUpdate = () => {
        this._updateLocalStorage();
    };

    handleNoteAdd = (newNote) => {
        let newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes });
    };

    handleNoteDelete = (note) => {
        let noteId = note.id;
        let newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });
        this.setState({ notes: newNotes });
    };
    
    render(){
        return (
            <div className="container text-center">
                <h2 className="display-4">NotesApp</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    };
    
    _updateLocalStorage = () => {
        let notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    };
};

ReactDOM.render(
    <NotesApp />,
    document.getElementById('app')
);