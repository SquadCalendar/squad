import React from 'react'
import moment from 'moment'
import Event from './Event'


const DateColumn = ({day, events, width}) => {
  const weekView = false;
  return (
    <div
      className='dateColumn'
      style={{
        width: width,
      }}
    >
      <div>
        <p className="header">{moment(day).format((weekView) ? 'dddd M/D' : 'M/D')}</p>
      </div>
      {
        events.filter((e) => {
          return moment(e.time).isSame(day, 'day');
        }).map((calEvent) => {
          return (
            <Event
              key={calEvent.id}
              details={calEvent}
            />
          )
        })
      }
    </div>
  )
}

export default DateColumn