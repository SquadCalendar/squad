import { expect } from 'chai'
import moment from 'moment-timezone'
import { createStore } from 'redux'
import reducer from '../client/reducers/form'
import { voteSort } from '../client/reducers/form'

moment.tz.setDefault("America/Chicago");

describe('Form Reducer', () => {
  it('should sort votes by vote count and then start date', () => {
    const time1 = moment().format()
    const time2 = moment().format()
    let a = {
      [time1]: 0
    }
    let b = {
      [time2]: 1
    }
    expect(voteSort(a,b)).to.be.above(0)
    b = {
      [time2]: 0
    }
    expect(voteSort(a,b)).to.equal(0)
    b = {
      [moment().add(1, 'd').format()]: 0
    }
    expect(voteSort(a,b)).to.be.below(0)
  })

  it('should change time by dispatching CHANGE_TIME', () => {
    const store = createStore(reducer)
    store.dispatch({
      type: 'CHANGE_TIME',
      time: moment().format()
    })
    expect(moment(store.getState().time).format('LT')).to.equal(moment().format('LT'))
    store.dispatch({
      type: 'CHANGE_TIME',
      time: null
    })
    expect(store.getState().time).to.be.null
  })
  it('should change date by dispatching CHANGE_DATE', () => {
    const store = createStore(reducer)
    store.dispatch({
      type: 'CHANGE_DATE',
      date: moment('2020-10-10').format()
    })
    expect(moment(store.getState().date).format('LL')).to.equal(moment('2020-10-10').format('LL'))
    store.dispatch({
      type: 'CHANGE_DATE',
      date: null
    })
    expect(store.getState().date).to.be.null
  })
  it('should add a vote with ADD_OPTION and clear the form', () => {
    const newTime = moment()
    const newDate = moment()
    const store = createStore(reducer, {
      time: newTime.format(),
      date: newDate.format(),
      options: []
    })
    store.dispatch({ type: 'ADD_OPTION' })
    expect(store.getState().options).to.have.lengthOf(1)
    const newVote = store.getState().options[0]
    const form = store.getState()

    expect(Object.keys(newVote)[0]).to.equal(moment({
      year: newDate.year(),
      month: newDate.month(),
      day: newDate.date(),
      hour: newTime.hour(),
      minute: newTime.minute()
    }).format())

    expect(form.time).to.be.null
  })
  it('should remove a vote with DELETE_OPTION', () => {
    const store = createStore(reducer, {
      time: moment().format(),
      options: [
        {
          1: 0,
        },
        {
          2: 2,
        }
      ]
    })
    store.dispatch({ type: 'DELETE_OPTION', time: '1' })
    expect(store.getState().options).to.have.lengthOf(1)
    expect(store.getState().options[0]).to.have.keys('2')
  })

  it('simulates receiving options from the server', () => {
    const options = {
      180000: 4,
      90000: 1,
      270000: 0
    }
    const store = createStore(reducer)
    store.dispatch({
      type: 'RECEIVE_EVENT',
      options
    })

    expect(store.getState().options).to.deep.equal([
      { '1970-01-02T20:00:00-06:00': 4 },
      { '1970-01-01T19:00:00-06:00': 1 },
      { '1970-01-03T21:00:00-06:00': 0 }
    ])

    const prevState = store.getState().options
    store.dispatch({
      type: 'RECEIVE_EVENT',
      options: null
    })
    expect(store.getState().options).to.deep.equal([])
  })
})
