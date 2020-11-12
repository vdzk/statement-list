import { html } from '../../third_party/lit-html/lit-html.js'
import { ontology } from '../constants.js'

export const TypeIcon = (type) => html`
  <span class="icon" title=${ontology[type].label} >
    <i class=${ontology[type].icon}></i>
  </span>
`
