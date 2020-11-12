import { state } from './state.js'
import { actions } from './actions.js'
import { filters } from './filters.js'
import createMatcher from '../third_party/feather-route-matcher.js'

const setActiveId = (activeId) => {
  //NOTE: make sure that statemets were already loaded by this point
  if (activeId !== '-' && state.statements.hasOwnProperty(activeId)) {
    actions.statement.open(activeId)
  } else {
    actions.statement.close()
  }
}

const matcher = createMatcher({
  '/': () => {
    actions.filter.update('all')
    actions.statement.close()
  },
  '/byType/:activeTypes/:activeId': ({activeTypes, activeId}) => {
    actions.filter.setActiveTypes(activeTypes.split('+'))
    setActiveId(activeId)
  },
  '/relations/:sourceId/:activeId': ({sourceId, activeId}) => {
    actions.filter.showRelations(parseInt(sourceId))
    setActiveId(activeId)
  },
  '/:filterKey/:activeId': ({filterKey, activeId}) => {
    if (filters.hasOwnProperty(filterKey)) {
      actions.filter.update(filterKey)
    } else {
      actions.filter.update('all')
    }
    setActiveId(activeId)
  },
  '/*': () => {
    //Route not matched
  },
})

export const applyRoute = () => {
  const { page, params } = matcher(document.location.pathname)
  page(params)
}
window.onpopstate = applyRoute

export const updateRoute = () => {
  let segments
  if (state.filter.key === 'all' && state.activeId === null) {
    segments = []
  } else if (state.filter.key === 'byType') {
    const activeTypes = Object.entries(state.filter.types)
      .filter(([_, active]) => active)
      .map(([type]) => type)
    if (activeTypes.length === 0) {
      return false
    } else {
      segments = [state.filter.key, activeTypes.join('+'), state.activeId || '-']
    }
  } else if (state.filter.key === 'relations') {
    segments = [state.filter.key, state.filter.sourceId, state.activeId || '-']
  } else {
    segments = [state.filter.key, state.activeId || '-']
  }
  const route = '/' + segments.join('/')
  if (document.location.pathname !== route) {
    window.history.pushState({}, '', route)
  }
}

// applyRoute()
