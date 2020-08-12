import React, {useEffect, useState} from 'react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const handleWindowSizeChange = () => {

    if (window.innerWidth <= 600) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }

  };

	useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange);

		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);

		}
	}, [isMobile])
	
  return (
    <React.Fragment>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router>
            <Navigation isMobile={isMobile}/>
            <MainRouter isMobile={isMobile} />
          </Router>
        </PersistGate>
      </Provider>
    </React.Fragment>
  );
}

export default App;
