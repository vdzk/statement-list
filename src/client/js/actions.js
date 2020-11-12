import { state, stateChange } from './state.js'
import { persist } from './store.js'
import { ontology, getDefaultFields } from './constants.js'
import { clone } from './util.js'

export const actions = {
  filter: {
    update: (key) => {
      state.filter.key = key
      state.list.picking = false
      if (key !== 'byType') {
        for (const type in state.filter.types) {
          state.filter.types[type] = false
        }
      }
    },
    toggleNotes: () => {
      const key = (state.filter.key === 'notes') ? 'all' : 'notes'
      actions.filter.update(key)
    },
    toggleDefs: () => {
      const key = (state.filter.key === 'defs') ? 'all' : 'defs'
      actions.filter.update(key)
    },
    toggleType: (type) => {
      state.filter.types[type] = !state.filter.types[type]
      if (Object.values(state.filter.types).includes(false)) {
        actions.filter.update('byType')
      } else {
        actions.filter.update('all')
      }
    },
    setActiveTypes: (activeTypes) => {
      for (const type in state.filter.types) {
        state.filter.types[type] = activeTypes.includes(type)
      }
      actions.filter.update('byType')
    },
    showOrdered: () => {
      for (const type in state.filter.types) {
        state.filter.types[type] = ontology[type].ordered
      }
      actions.filter.update('byType')
    },
    showRelations: (sourceId) => {
      state.filter.sourceId = sourceId
      actions.filter.update('relations')
    },
    toggleChrono: () => {
      state.filter.chrono = !state.filter.chrono
    },
  },
  list: {
    statementClick: (id) => {
      if (state.list.picking) {
        actions.statement.toggleRelation(id)
      } else {
        if (state.activeId === id) {
          actions.statement.close()
        } else {
          actions.statement.open(id)
        }
      }
    },
    startPicking: (role) => {
      const { types } = ontology[state.statement.type].relations[role]
      actions.filter.setActiveTypes(types)
      state.list.pickingRole = role
      state.list.picking = true
    },
    endPicking: () => {
      actions.filter.update('all')
      state.list.pickingRole = null
      state.list.picking = false
    },
    moveEvent: (d) => {
      const i = state.eventOrder.indexOf(state.activeId)
      const j = i + d
      const targetId = state.eventOrder[j]
      state.eventOrder[i] = targetId
      state.eventOrder[j] = state.activeId
      persist()
    },
    setMainId: () => {
      state.list.mainId = state.activeId
      persist()
    },
    circleUserMod: () => {
      state.list.userMod = (state.list.userMod + 1) % state.users.length
    },
  },
  statement: {
    openNew: () => {
      state.editor.show = true
      Object.assign(state.statement, getDefaultFields())
    },
    open: (id) => {
      state.editor.show = true
      Object.assign(state.statement, state.statements[id])
      actions.statement.updateRelations()
      actions.statement.updateConfidences()
      actions.statement.updateModifiers()
      actions.statement.updateExplanation()
      state.editor.changed = false
    },
    delete: () => {
      delete state.statements[state.statement.id]
      const i = state.eventOrder.indexOf(state.statement.id)
      if (i !== -1) {
        state.eventOrder.splice(i, 1)
      }
      actions.statement.close()
      persist()
      state.editor.changed = false
    },
    add: () => {
      state.statement.id = ++state.editor.prevId
      const { type, id } = state.statement
      if (ontology[type].ordered) {
        state.eventOrder.push(id)
      }
      actions.statement.save()
    },
    close: () => {
      state.list.picking = false
      state.editor.show = false
      Object.assign(state.statement, getDefaultFields())
      state.editor.changed = false
    },
    updateExplanation: () => {
      const { id } = state.statement
      const { canExplain } = ontology[state.statement.type]
      if (canExplain) {
        const { explanation } = state.statements[id]
        if (id === null || !explanation) {
          state.statement.explanation = []
        } else {
          state.statement.explanation = explanation.slice()
        }
      } else {
        state.statement.explanation = null
      }
    },
    updateRelations: () => {
      const { id } = state.statement
      const { relations } = ontology[state.statement.type]
      if (relations) {
        if (id === null || !state.statements[id].relations) {
          state.statement.relations = {}
          for (const role in relations) {
            state.statement.relations[role] = []
          }
        } else {
          state.statement.relations = clone(state.statements[id].relations)
          for (const role in relations) {
            state.statement.relations[role] = state.statement.relations[role] || []
          }
        }
      } else {
        state.statement.relations = null
      }
    },
    updateConfidences: () => {
      const id = state.statement.id
      if (ontology[state.statement.type].hasConfidences) {
        if (id === null || !state.statements[id].confidences) {
          state.statement.confidences = state.users.map(() => null)
        } else {
          state.statement.confidences = state.statements[id].confidences.slice()
        }
      } else {
        state.statement.confidences = null
      }
    },
    updateModifiers: () => {
      const id = state.statement.id
      if (ontology[state.statement.type].hasConfidences) {
        if (id === null || !state.statements[id].modifiers) {
          state.statement.modifiers = state.users.map(() => null)
        } else {
          state.statement.modifiers = state.statements[id].modifiers.slice()
        }
      } else {
        state.statement.modifiers = null
      }
    },
    updateType: (type) => {
      state.list.picking = false
      state.statement.type = type
      actions.statement.updateRelations()
      actions.statement.updateConfidences()
      actions.statement.updateModifiers()
      actions.statement.updateExplanation()
      state.editor.changed = true
    },
    updateText: (text, field = 'text') => {
      if (state.statement[field] !== text) {
        state.statement[field] = text
        if (state.statement.id === null) {
          return 'noChange'
        } else {
          if (state.editor.changed) {
            return 'noChange'
          } else {
            state.editor.changed = true
          }
        }
      } else {
        return 'noChange'
      }
    },
    onInputKey: (event) => {
      if (event.key === 'Enter') {
        actions.statement.updateText(event.target.value)
        if (state.statement.id === null) {
          actions.statement.add()
        } else {
          actions.statement.save()
        }
      } else {
        return 'noChange'
      }
    },
    pasteUrl: (event) => {
      let paste = (event.clipboardData || window.clipboardData).getData('text')
      paste = decodeURI(paste)
      actions.statement.updateText(paste, 'url')
      event.preventDefault()
    },
    toggleRelation: (id) => {
      const role = state.list.pickingRole
      const { type, relations } = state.statement
      const i = relations[role].indexOf(id)
      if (i === -1) {
        const { multiple } = ontology[type].relations[role]
        if (multiple) {
          relations[role].push(id)
        } else {
          relations[role] = [id]
        }
      } else {
        relations[role].splice(i,1)
      }
      state.editor.changed = true
    },
    setConfidence: (i, c) => {
      state.statement.confidences[i] = c
      state.editor.changed = true
    },
    setModifier: (i, m) => {
      state.statement.modifiers[i] = m
      state.editor.changed = true
    },
    save: () => {
      state.statements[state.statement.id] = clone(state.statement)
      state.editor.changed = false
      state.list.picking = false
      persist()
    }
  },
}

const stateChangeAfter = (obj) => {
  for (const key in obj) {
    const a = obj[key]
    if (typeof a === 'function') {
      obj[key] = (...args) => {
        const msg = a(...args)
        if (msg !== 'noChange') {
          stateChange()
        }
      }
    } else {
      stateChangeAfter(a)
    }
  }
}
stateChangeAfter(actions)
