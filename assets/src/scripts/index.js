import React from 'react';
import ReactDOM from 'react-dom';
import utils from './modules/utils.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.utils = new utils();

        this.state = {};
    }

    componentDidMount() {

    }

    componentWillMount() {
        // Lifecycle function that is triggered just before a component mounts
    }

    componentWillUnmount() {
        // Lifecycle function that is triggered just before a component unmounts
    }

    render() {

    }
}

ReactDOM.render(<App />, document.getElementById('app'));
