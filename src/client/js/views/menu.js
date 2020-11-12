import { html } from '../../third_party/lit-html/lit-html.js'
import { state } from '../state.js'
import { actions } from '../actions.js'

export const AddBtn = () => html`
  <button
    class="button is-primary"
    @click=${actions.statement.openNew}
    ?disabled=${state.editor.show && state.activeId === null}
  >
    Новое утверждение
  </button>
`

export const Menu = () => html`
  <div class="field">
    ${ AddBtn() }
  </div>
`
