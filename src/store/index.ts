import { useStoreon } from 'storeon/react' 
import dayjs, { Dayjs } from 'dayjs';
import { createStoreon, StoreonModule } from 'storeon'

export interface State {
  time: Dayjs
  on: boolean
}

export interface Events {
  'set': Dayjs,
  'on': undefined,
  'off': undefined,
}

const timer: StoreonModule<State, Events> = store => {
  store.on('@init', () => ({ time: dayjs(), on: true}))
  store.on('set', (state, event) => ({ ...state, time: event, }))
  store.on('on', (state) => ({ ...state, on: true }))
  store.on('off', (state) => ({ ...state, on: false }))
}

const store = createStoreon<State, Events>([timer])

export default store;