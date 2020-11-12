import { html } from '../../third_party/lit-html/lit-html.js'
import { state } from '../state.js'
import { actions } from '../actions.js'
import { TypeIcon } from './global.js'
import { ontology } from '../constants.js'

const CheckBox = (id) => {
  const role = state.list.pickingRole
  const checked = state.statement.relations[role].includes(id)
  return html`
    <span class="icon is-pulled-right">
      <i class=${'far fa-' + ((checked) ? 'check-' : '') + 'square'}></i>
    </span>
  `
}


const Eye = () => html`
  <span class="icon has-text-info" title="открытое">
    <i class="far fa-eye"></i>
  </span>
`

const Role = (id) => {
  const { relations, type } = state.statement
  if (relations) {
    for (const role in relations) {
      if (relations[role].includes(id)) {
        const { label, icon } = ontology[type].relations[role]
        if (label && icon) {
          return html`
            <span class="icon" title=${label}>
              <i class=${icon}></i>
            </span>
          `
        }
      }
    }
  }
  return ''
}

const Star = () => html`
  <span class="icon has-text-warning" title="главное">
    <i class='fas fa-star'></i>
  </span>
`

const Disconnected = (id, type) => {
  if (state.list.connected.includes(id)) return ''
  if (ontology[type].separate) return ''
  return html`
    <span class="icon has-text-danger" title="не связано">
      <i class="fas fa-unlink"></i>
    </span>
  `
}

const Disagreement = (id) => {
  const { type, confidences } = state.statements[id]
  if (!ontology[type].hasConfidences) {
    return ''
  }
  if (!confidences || confidences.some(c => c === null)) {
    return html`
      <span class="icon" title="уверенность не оглашена">
        <i class="fas fa-question"></i>
      </span>
    `
  } else {
    const diff = Math.max(...confidences) - Math.min(...confidences)
    return html`
      <span
        class="has-text-grey-dark has-text-weight-bold"
        title="разница в уверенности"
      >
        ${diff}
      </span>
    `
  }
}

const TailIcons = (id, type) => html`
  <span class="tail-icons">
    <span class="icon-col-1">
      ${(state.activeId === id) ? Eye() : Role(id)}
    </span>
    <span class="icon-col-2">
      ${(state.list.mainId === id) ? Star() : ''}
      ${Disconnected(id, type)}
    </span>
  </span>
  <div style="clear: both;"></div>
`

const Statement = ({id, type, modifiedText}) => html`
  <div class="list-item" @click=${() => actions.list.statementClick(id)} >
    ${TypeIcon(type)}
    ${modifiedText}
    ${(state.list.picking) ? CheckBox(id) : TailIcons(id, type) }
  </div>
`

export const List = () => {
  let { statements } = state.list
  if (!state.filter.chrono) {
    statements = statements.slice().reverse()
  }
  return html`
    <div class="list main-list fh-scroll">
      ${statements.map(Statement)}
    </div>
  `
}
