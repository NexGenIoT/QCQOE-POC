/**
* Main App
*/
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// css
import 'Assets/scss/reactifyCss'; 

// app component
import App from 'Container/App';

import store from 'Store';

function MainApp() {
	return (
		<Provider store={store}>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Router>
					<Switch>
						<Route path="/" component={App} />
					</Switch>
				</Router>
			</MuiPickersUtilsProvider>
		</Provider>
	)
};

export default MainApp;
