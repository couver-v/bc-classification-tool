import React, { Component } from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import Subtyping from './pages/Subtyping';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Malignancy from './pages/Malignancy';
import Footer from './components/Footer';

class App extends Component {
    
    render() {
        return (
            <HashRouter
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/upload" component={Upload} />
                        <Route path="/malignancy" component={Malignancy} />
                        <Route path="/subtyping" component={Subtyping} />
                    </Switch>
                </div>
                <Footer />
            </HashRouter>
        );
    }
}

// ReactDOM.render(<App />, document.getElementById('app'));

export default App;
