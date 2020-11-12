import { html } from '../../third_party/lit-html/lit-html.js'
import { state } from '../state.js'
import { actions } from '../actions.js'
import { ontology } from '../constants.js'
import { TypeIcon } from './global.js'

const TypeControl = (type) => html`
  <p class="control">
    <button
      class=${'button ' + ((state.filter.types[type]) ? '' : 'is-light')}
      @click=${() => actions.filter.toggleType(type)}
    >
      ${TypeIcon(type)}
    </button>
  </p>
`

const NoteControl = () => html`
  <div class="filed">
    <button
      class=${'button ' + ((state.filter.key === 'notes') ? '' : 'is-light')}
      @click=${actions.filter.toggleNotes}
    >
      ${TypeIcon('note')}
    </button>
  </div>
`

const DefControl = () => html`
  <div class="filed">
    <button
      class=${'button ' + ((state.filter.key === 'defs') ? '' : 'is-light')}
      @click=${actions.filter.toggleDefs}
    >
      ${TypeIcon('def')}
    </button>
  </div>
`

const TypeFilter = () => html`
  <div class="field has-addons">
    ${Object.entries(ontology)
        .filter(([type, { separate }]) => !separate)
        .map(([type]) => TypeControl(type))}
  </div>
`

const SortControl = () => html`
  <div class="field">
    <button
      class="button"
      @click=${actions.filter.toggleChrono}
      title='сортировать в прямом/обратном хронологическом порядке'
    >
      <span class="icon" >
        <i class="far fa-clock"></i>
        <i class=${'fas fa-long-arrow-alt-' + ((state.filter.chrono) ? 'down' : 'up')}></i>
      </span>
    </button>
  </div>
`

const UserModControl = () => html`
  <div class="field">
    <button
      class="button"
      @click=${actions.list.circleUserMod}
      title='переключить пользователя модификаторов'
    >
      <span class="icon" >
        <i class="fas fa-user"></i>
      </span>
      <span>
        ${state.users[state.list.userMod]}
      </span>
    </button>
  </div>
`

export const Filter = () => html`
  <div class="box">
    <div class="field is-grouped">
      <button
        class=${'button ' + ((state.filter.key === 'all') ? '' : 'is-light')}
        @click=${() => actions.filter.update('all')}
      >
        Все утверждения
      </button>
      &nbsp;&nbsp;&nbsp;
      ${TypeFilter()}
      &nbsp;&nbsp;&nbsp;
      ${DefControl()}
      &nbsp;&nbsp;&nbsp;
      ${NoteControl()}
      &nbsp;&nbsp;&nbsp;
      ${SortControl()}
      &nbsp;&nbsp;&nbsp;
      ${UserModControl()}
    </div>
    <div class="field">Фильтр: ${state.filter.label}</div>
  </div>
`
