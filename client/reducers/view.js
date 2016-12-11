import moment from 'moment'

import {
  VIEW_TODAY,
  VIEW_PREV,
  VIEW_NEXT,
  CHANGE_WINDOW,
  GLOBAL_KEY_PRESS,
} from '../actions'

const getNextViewDelta = (state) => {
  switch (state.window) {
    case '4_DAY':
      return moment(state.date).add(4, 'd').format()
    case 'WEEK':
      return moment(state.date).add(1, 'w').format()
    case '2_WEEK':
      return moment(state.date).add(2, 'w').format()
    case 'MONTH':
      return moment(state.date).add(1, 'M').format()
    default:
      return state.date
  }
}

const getPrevViewDelta = (state) => {
  switch (state.window) {
    case '4_DAY':
      return moment(state.date).subtract(4, 'd').format()
    case 'WEEK':
      return moment(state.date).subtract(1, 'w').format()
    case '2_WEEK':
      return moment(state.date).subtract(2, 'w').format()
    case 'MONTH':
      return moment(state.date).subtract(1, 'M').format()
    default:
      return state.date
  }
}

const getViewFromKey = (key) => {
  switch (key) {
    case 'w':
      return 'WEEK'
    case 'm':
      return 'MONTH'
    case 'd':
      return '4_DAY'
    default:
      return null
  }
}

const date = (state, action) => {
  if (!state) {
    return {
      date: moment().format(),
      window: '4_DAY'
    }
  }
  switch (action.type) {
    case VIEW_TODAY :
      return Object.assign({}, state, {
        date: moment().format(),
      })
    case VIEW_NEXT:
      return Object.assign({}, state, {
        date: getNextViewDelta(state),
      })
    case VIEW_PREV:
      return Object.assign({}, state, {
        date: getPrevViewDelta(state),
      })
    case CHANGE_WINDOW:
      return Object.assign({}, state, {
        window: action.window,
      })
    case GLOBAL_KEY_PRESS:
      return Object.assign({}, state, {
        window: getViewFromKey(action.key) || state.window,
      })
    default:
      return state
  }
}

export default date
