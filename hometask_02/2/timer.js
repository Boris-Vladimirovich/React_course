class Timer extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			seconds: 0,
			isPaused: true
		};
	};

	handlePause = () => {
		this.setState({
			isPaused: true
		});
		clearInterval(this.timer);
	}

	handlePlay = () => {
		this.setState({
			isPaused: false
		});
		this.timer = setInterval(this.tick, 1000);
	}

	handleRestart = () => {
		this.setState({
			seconds: 0
		});
	}

	tick = () => {
		this.setState({
			seconds: this.state.seconds + 1 
		});
	}

	render(){
		let button = null;

		let hours   = Math.floor(this.state.seconds / 3600);
    	let minutes = Math.floor((this.state.seconds - (hours * 3600)) / 60);
    	let seconds = this.state.seconds - (hours * 3600) - (minutes * 60);

    	if (hours   < 10) {hours   = "0"+hours;}
    	if (minutes < 10) {minutes = "0"+minutes;}
    	if (seconds < 10) {seconds = "0"+seconds;}
    	let displayedValue = hours+':'+minutes+':'+seconds;

		if(this.state.isPaused){
			button = <button className="btn btn-lg btn-success" onClick={this.handlePlay}><i className="fa fa-play" aria-hidden="true"></i></button>
		}else{
			button = <button className="btn btn-lg btn-warning" onClick={this.handlePause}><i className="fa fa-pause" aria-hidden="true"></i></button> 
		}
		return(
			<div className="btn-group btn-group-lg">
				{button}
				<span className="input-group-addon time">{displayedValue}</span>
				<button className="btn btn-lg btn-info" onClick={this.handleRestart}><i className="fa fa-undo" aria-hidden="true"></i></button>
			</div>
		);
	};
};

ReactDOM.render(
    <Timer />,
    document.getElementById('app')
);