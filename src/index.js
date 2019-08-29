import 'lazysizes'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { JssProvider } from 'react-jss'
import createStore from './createStore'
import { FETCH_FAVOURITES_TYPE, REHYDRATED } from './actions'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

function getPreloadedState () {
  const preloadedStateEl = document.getElementById('redux-preinit')
  if (preloadedStateEl) {
    const preloadedState = JSON.parse(preloadedStateEl.innerText)
    preloadedStateEl.parentNode.removeChild(preloadedStateEl)
    return preloadedState
  }
}

const store = createStore(getPreloadedState())
const rootEl = document.getElementById('root')
const render = App => (
  <ReduxProvider store={store}>
    <JssProvider>
      <App />
    </JssProvider>
  </ReduxProvider>
)

ReactDOM.hydrate(render(App), rootEl, () => {
  // We don't need the static css any more once we have launched our application
  const style = document.getElementById('jss-preinit')
  if (style) {
    style.parentNode.removeChild(style)
  }
  store.dispatch({ type: REHYDRATED })
  store.dispatch({ type: FETCH_FAVOURITES_TYPE })
})

if (module.hot) {
  module.hot.accept('./components/App', function () {
    const App = require('./components/App').default
    ReactDOM.render(render(App), rootEl)
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
