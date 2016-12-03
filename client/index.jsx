import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'

import App from './components/App'
import configureStore from './helpers/configureStore'
// import { fetchEvents } from './api'
import { color } from './vars'

injectTapEventPlugin()

const store = configureStore({
  // users: ['EjYKKzE1ZDYzbnRhdjNxMDAzdWd0Nzd1NGNyaGQ4XzIwMTcwMTAyVDAyMDAwMFoYgOCdit6h0QI=']
})
// store.dispatch(fetchEvents)

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: color.green,
    accent1Color: color.green,
  }
})

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
