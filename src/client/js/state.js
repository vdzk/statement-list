import { ontology, getDefaultFields } from './constants.js'

export const state = {
  filter: {
    key: 'all',
    types: {},
    chrono: true,
  },
  list: {
    mainId: null,
    picking: false,
    statements: [],
    userMod: 0,
  },
  editor: {
    show: false,
    prevId: 0,
    changed: false,
  },
  statement: getDefaultFields(),
  statements: {},
  order: [],
  eventOrder: [],
  store: {
    version: 0
  }
}

for (const type in ontology) {
  const { separate } = ontology[type]
  if (!separate) {
    state.filter.types[type] = false
  }
}

//Notify only about the last state change in the call stack
let notify = null
let numChanges = 0
export const stateChange = () => {
  if (notify !== null) {
    numChanges++
    setTimeout(() => {
      numChanges--
      if (numChanges === 0) {
        notify()
      }
    })
  }
}
export const onStateChange = (fn) => notify = fn
