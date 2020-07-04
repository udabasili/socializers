import React from 'react';
import { Provider } from "react-redux";
import { store, persistor } from './redux/store';
import { BrowserRouter as Router } from "react-router-dom";
import MainRouter from './MainRouter';
import Navigation from './components/navigation.component';
import { PersistGate } from 'redux-persist/integration/react';
import { setAuthorizationToken, verifyUser } from './redux/user/user.actions';

if (localStorage.getItem("validator")) {
  setAuthorizationToken(localStorage.getItem("validator"))
  store.dispatch(verifyUser())
}

  

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <Navigation />
            <MainRouter />
          </Router>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
}

export default App;
