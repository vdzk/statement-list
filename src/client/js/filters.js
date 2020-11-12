import { state } from './state.js'
import { ontology } from './constants.js'

export const filters = {
  all: {
    label: 'все утверждения',
    match: ({type}) => !ontology[type].separate
  },
  byType: {
    label: 'по типу',
    match: ({type, id}) => state.filter.types[type]
      || state.statement.id === id,
  },
  relations: {
    label: 'прямые связи',
    //TODO: make visibility of events a toggle?
    match: ({id, type}) => !['event', 'satisfaction'].includes(type) && (state.filter.sourceId === id || Object.values(state.statements[state.filter.sourceId].relations).some(relIds => relIds.includes(id)))
  },
  notes: {
    label: 'заметки',
    match: ({type}) => type === 'note'
  },
  defs: {
    label: 'определения',
    match: ({type}) => type === 'def'
  },
}
