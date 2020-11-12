import { state, stateChange } from './state.js'
import { actions } from './actions.js'
import { ontology } from './constants.js'

export const loadStore = () => {
  if (localStorage.getItem('statements')) {
    state.statements = JSON.parse(localStorage.getItem('statements'))
    state.editor.prevId = Math.max(...Object.keys(state.statements))

    //Type name update
    for (const statement of Object.values(state.statements)) {
      if (statement.type === 'definition') {
        statement.type = 'def'
      }
      if (statement.type === 'value') {
        statement.type = 'satisfaction'
      }
      if (statement.type === 'informal') {
        statement.type = 'note'
      }
      statement.text = statement.text.replace('$1', '\\1')
    }
    //Order refactoring
    if (localStorage.getItem('eventOrder')) {
      state.eventOrder = JSON.parse(localStorage.getItem('eventOrder'))
    }
  }
  if (localStorage.getItem('mainId')+'' !== 'null') {
    state.list.mainId = parseInt(localStorage.getItem('mainId'))
  }
  if (localStorage.getItem('version')) {
    state.store.version = parseInt(localStorage.getItem('version'))
  }
  state.users = JSON.parse(localStorage.getItem('users')) || []
}

export const persist = () => {
  localStorage.setItem('statements', JSON.stringify(state.statements))
  localStorage.setItem('order', JSON.stringify(state.order))
  localStorage.setItem('eventOrder', JSON.stringify(state.eventOrder))
  localStorage.setItem('mainId', state.list.mainId)
  let version
  if (localStorage.getItem('version')) {
    version = parseInt(localStorage.getItem('version')) + 1
  } else {
    version = 1
  }
  localStorage.setItem('version', version)
  state.store.version = version
}

document.onvisibilitychange = () => {
  if (!document.hidden && localStorage.getItem('version') &&
  parseInt(localStorage.getItem('version')) !== state.store.version) {
    loadStore()
    if (state.activeId && !state.statements[state.activeId]) {
      actions.statement.close()
    }
    stateChange()
  }
}
