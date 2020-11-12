import { state } from './state.js'
import { filters } from './filters.js'
import { ontology, modVar } from './constants.js'

const prepareList = () => {
  Object.assign(state.filter, filters[state.filter.key])

  const order = Object.values(state.statements)
    .filter(({type}) => ontology[type].ordered)
    .map(({id}) => id)
    .sort((a, b) => state.eventOrder.indexOf(a) - state.eventOrder.indexOf(b))
  for (const t of ['satisfaction', 'citation', 'def', 'note']) {
    Object.values(state.statements)
      .filter(({type}) => type === t)
      .forEach(({id}) => order.push(id))
  }
  const insert = (id, target, d) => {
    let i
    if (!target || target.length === 0) {
      i = order.length
    } else {
      const tis = target.map((tid) => order.indexOf(tid))
      if (d < 0) {
        i = Math.min(...tis)
      } else {
        i = Math.max(...tis) + 1
      }
    }
    order.splice(i, 0, id)
  }
  Object.values(state.statements)
    .filter(({type}) => type === 'causation' || type === 'chain')
    .forEach(({id, relations}) => insert(id, relations && relations.effect, -1))
  Object.values(state.statements)
    .filter(({type}) => type === 'evaluation')
    .forEach(({id, relations}) => insert(id, relations && relations.satisfaction, 1))


  const list = order
    .map((id) => state.statements[id])
    .filter(state.filter.match)

  return list
}

const getConnected = () => {
  //TODO: don't connect type "chain" if links are missing
  let edges = {}
  for (const id in state.statements) {
    if (!edges[id]) edges[id] = []
    const { relations } = state.statements[id]
    if (relations) {
      for (const role in relations) {
        for (const relId of relations[role]) {
          if (!edges[relId]) edges[relId] = []
          edges[id].push(parseInt(relId))
          edges[relId].push(parseInt(id))
        }
      }
    }
  }

  const connected = []
  let boundary = []
  if (state.list.mainId !== null) {
    boundary.push(state.list.mainId)
  }
  let i = 0
  while (boundary.length > 0) {
    const id = boundary.pop()
    boundary = boundary.concat(edges[id].filter(eid =>
      !connected.includes(eid) &&
      !boundary.includes(eid)
    ))
    connected.push(id)
  }
  return connected
}

const getChains = () => {
  const causes = {}
  const effects = {}
  for (const id in state.statements) {
    const { type, relations } = state.statements[id]
    if (type === 'causation' && relations) {
      const { cause, effect } = relations
      for (const cid of cause) {
        if (!effects[cid]) effects[cid] = []
        for (const eid of effect) {
          if (!causes[eid]) causes[eid] = []
          effects[cid].push(eid)
          causes[eid].push(cid)
        }
      }
    }
  }

  const chains = {}
  for (const id in state.statements) {
    const statement = state.statements[id]
    const { type } = statement
    if (type === 'chain') {
      const { relations } = statement
      if (relations) {
        const { cause, effect } = relations
        if (cause.length > 0 && effect.length > 0) {
          const allEffects = []
          let boundary = cause.slice()
          while (boundary.length > 0) {
            const cid = boundary.pop()
            if (effects[cid]) {

              boundary = boundary.append()
            }
          }
        }
      }
    }
  }
}

const modifyText = () => {
  Object.values(state.statements).forEach((statement) => {
    if (statement.modifiers && statement.text.includes(modVar)) {
      let modifier = statement.modifiers[state.list.userMod]
      if (modifier === null) modifier = '(?)'
      statement.modifiedText = statement.text.replace(modVar, modifier)
    } else {
      statement.modifiedText = statement.text
    }
  })
}

export const compute = () => {
  state.activeId = (state.editor.show) ? state.statement.id : null
  state.list.statements = prepareList()
  state.list.connected = getConnected()
  modifyText()
}
