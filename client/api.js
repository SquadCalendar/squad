import axios from 'axios'
import moment from 'moment'
import { ADD_USER, receiveEvent, receiveGoogleEvents } from './actions'

const client = axios.create({
  baseURL: process.env.SQUAD_HOST || 'http://localhost:4000',
  responseType: 'json',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})
client.defaults.headers.post['Content-Type'] = 'application/json'

const googleCalendarClient = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3/calendars',
  responseType: 'json'
})

const googleAuthClient = axios.create({
  baseURL: 'https://accounts.google.com/o/oauth2/v2',
  responseType: 'json'
})

const authorize = () => {
  return gapi.auth.authorize({
    client_id: '583561432942-5fcf74j7tmfelnqj5jttnubd55dghdff.apps.googleusercontent.com',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    immediate: false
  })
  // return googleAuthClient.get('/auth', {
  //   params: {
  //     response_type: 'token',
  //     client_id: '583561432942-5fcf74j7tmfelnqj5jttnubd55dghdff.apps.googleusercontent.com',
  //     scope: 'https://www.googleapis.com/auth/calendar.readonly',
  //     redirect_uri: 'http://localhost:8080',
  //   }
  // })
}

const getGoogleEvents = (token, id) => {
  return googleCalendarClient.get(`${id || 'primary'}/events`, {
    params: {
      access_token: token,
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 25,
      orderBy: 'startTime'
    }
  }).catch((err) => { throw err })
}

const loadAllGoogleEvents = () => {
  return (dispatch, getState) => {
    const users = getState().users
    return axios.all(users.map(user => getGoogleEvents(user))).then(axios.spread((...eventGroups) => {
      if (eventGroups.length) {
        const allEvents = eventGroups.reduce((events, group) => {
          return events.concat(group.data.items)
        }, [])
        dispatch(receiveGoogleEvents(allEvents))
      }
    })).catch((err) => {
      return dispatch({
        type: 'ERROR',
        err
      })
    })
  }
}

const authorizeThenLoadGoogleEvents = (id) => {
  return (dispatch, getState) => {
    return authorize().then((response) => {
      console.log(response)
      if (!getState().users.includes(response.access_token)) {
        dispatch({
          type: ADD_USER,
          user: response.access_token
        })
      }
      return getGoogleEvents(response.access_token, id)
    }).then((eventResponse) => {
      dispatch(receiveGoogleEvents(eventResponse.data.items))
    })
  }
}


const fetchEvent = (id) => {
  return (dispatch) => {
    return client.get(`/event/${id}`).then((response) => {
      dispatch(receiveEvent(response.data))
      // dispatch(loadAllGoogleEvents())
    }).catch((err) => {
      return dispatch({
        type: 'ERROR',
        err
      })
    })
  }
}

const sendVote = ({ id, option }) => {
  return (dispatch) => {
    return client.post(`/vote/${id}`, {
      time: moment(option).unix()
    }).then((response) => {
      dispatch(receiveEvent(response.data))
    }).catch((err) => {
      dispatch({
        type: 'ERROR',
        err
      })
    })
  }
}

const sendToken = ({ id, token }) => {
  return (dispatch, getState) => {
    if (!getState().users.includes(token)) {
      return client.post(`/authToken/${id}`, { token }).then((response) => {
        dispatch(receiveEvent(response.data))
        dispatch(loadAllGoogleEvents())
      }).catch((err) => {
        dispatch({
          type: 'ERROR',
          err
        })
      })
    }

    return Promise.resolve() // no need to send server
  }
}

// meta is extra data to include outside of state
const sendEvent = router => (meta) => {
  if (!meta.title) throw Error('Events require title')
  return (dispatch, getState) => {
    const state = getState()
    const { options } = state.form
    const { title, location, duration } = meta
    const body = {
      title,
      location,
      duration,
      emails: state.emails,
      tokens: state.users,
      options: options.reduce((accum, option) => {
        return Object.assign(accum, {
          [moment(Object.keys(option)[0]).unix()]: 0
        })
      }, {}),
    }
    return client.post('/event', body).then((response) => {
      const { id } = response.data
      router.push(`/event/${id}`)
    }).catch((err) => {
      return dispatch({
        type: 'ERROR',
        err
      })
    })
  }
}

export { authorize, fetchEvent, sendVote, sendEvent, sendToken, loadAllGoogleEvents, authorizeThenLoadGoogleEvents }
