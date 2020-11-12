import { html } from '../../third_party/lit-html/lit-html.js'
import { Filter } from './filter.js'
import { List } from './list.js'
import { Statement } from './statement.js'
import { Menu } from './menu.js'
import { state } from '../state.js'

export const App = () => html`
  <div class="fh-cols">
    <div class="fh-col">
      ${Filter()}
      ${List()}
    </div>
    <div class="fh-col">
      ${ Menu() }
      ${(state.editor.show) ? Statement() : ''}
    </div>
  </div>
`
