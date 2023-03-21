import { User } from '@prisma/client';
import { createStoreon, StoreonModule } from 'storeon'

export interface State {
  user: User | null
}

export interface Events {
  'set': User,
  'delete': undefined,
}

const timer: StoreonModule<State, Events> = store => {
  store.on('@init', () => ({ user: null }))
  store.on('set', (state, event) => ({ ...state, user: event, }))
  store.on('delete', (state) => ({ ...state, user: null, }))
}

const store = createStoreon<State, Events>([timer])

export default store;