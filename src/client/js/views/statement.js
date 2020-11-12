import { html } from '../../third_party/lit-html/lit-html.js'
import { ontology, modVar } from '../constants.js'
import { state } from '../state.js'
import { actions } from '../actions.js'
import { TypeIcon } from './global.js'

const ActionButton = ({action, text, type, disabled}) => html`
  <div class="control">
    <button
      class=${'button ' + (type || '')}
      @click=${action}
      ?disabled=${disabled}
    >
      ${text}
    </button>
  </div>
`

const Actions = () => {
  const actionButtons = []
  if (state.activeId !== null) {
    actionButtons.push({
      action: actions.statement.save,
      text: 'Сохранить',
      type: 'is-success',
      disabled: !state.editor.changed
    })
    if (ontology[state.statement.type].canBeMain) {
      actionButtons.push({
        action: actions.list.setMainId,
        text: 'Сделать главным',
        type: 'is-warning',
        disabled: state.activeId === state.list.mainId
      })
    }
    if (state.statement.relations) {
      actionButtons.push({
        action: () => actions.filter.showRelations(state.activeId),
        text: 'Показать прямые связи',
        type: '',
        disabled: state.filter.key === 'relations' && state.filter.sourceId === state.activeId,
      })
    }
    actionButtons.push({
      action: actions.statement.delete,
      text: 'Удалить',
      type: 'is-danger',
    })
  } else {
    actionButtons.push({
      action: actions.statement.add,
      text: 'Добавить',
      type: 'is-success',
    })
  }
  return html`
    <div class="field is-grouped">
      ${actionButtons.map(ActionButton)}
    </div>
  `
}

const Header = () => html`
  <header class="card-header">
    <p class="card-header-title">
      ${(state.activeId === null) ? 'Новое утверждение' : state.statements[state.activeId].modifiedText}
    </p>
    <a class="card-header-icon" @click=${actions.statement.close}>
      <span class="icon">
        <i class="fas fa-times"></i>
      </span>
    </a>
  </header>
`

const TypeOptions = (type) => Object.entries(ontology)
  .map(([value, {label}]) => html`
    <option value=${value} ?selected=${value === type}>
      ${label}
    </option>
  `)

const TypeInput = (type) => html`
  <div class="field">
    <label class="label">Тип</label>
    <div class="control has-icons-left">
      ${ TypeIcon(type) }
      <span class="select">
        <select .value=${type}
          @change=${(e) => actions.statement.updateType(e.target.value)}>
          ${TypeOptions(type)}
        </select>
      </span>
    </div>
  </div>
`

const TextInput = (type) => html`
  <div class="field">
    <label class="label">
      ${ontology[type].textInputLabel || 'Текст'}
    </label>
    <div class="control">
      <input
        @input=${(e) => actions.statement.updateText(e.target.value)}
        @keydown=${actions.statement.onInputKey}
        class="input"
        type="text"
        .value=${state.statement.text}
      >
    </div>
  </div>
`

const Citation = () => html`
  <div class="field">
    <label class="label">
      Дословный текст цитаты
    </label>
    <div class="control">
      <textarea
        @input=${(e) => actions.statement.updateText(e.target.value, 'fullText')}
        class="textarea"
        .value=${state.statement.fullText}
      ></textarea>
    </div>
  </div>
`

const UrlInput = () => html`
  <div class="field">
    <label class="label">
      URL материала
    </label>
  </div>
    <div class="control">

    </div>
  <div class="field has-addons">
    <div class="control is-expanded">
      <input
        @paste=${actions.statement.pasteUrl}
        @input=${(e) => actions.statement.updateText(e.target.value, 'input')}
        class="input"
        type="text"
        .value=${state.statement.url}
      >
    </div>
    <div class="control">
      <a class="button is-info" href=${state.statement.url} target="_blank">
        Открыть
      </a>
    </div>
  </div>
`
const Confidence = (name, i) => html`
  <div class="field has-addons">
    <p class="control">
      <a class="button is-static">
        <span class="icon">
          <i class="fas fa-user"></i>
        </span>
        <span>
          ${name}
        </span>
      </a>
    </p>
    <p class="control">
      <input
        .value=${state.statement.confidences[i]}
        @input=${(e) => actions.statement.setConfidence(i, e.target.value)}
        class="input"
        type="number"
        min="0"
        max="100"
      >
    </p>
    <p class="control">
      <a class="button is-static">
        %
      </a>
    </p>
    <p class="control">
      <a
        class="button is-danger"
        @click=${() => actions.statement.setConfidence(i, null)}
      >
        <span class="icon">
          <i class="fas fa-trash-alt"></i>
        </span>
      </a>
    </p>
  </div>
`

const Confidences = () => html`
  <div class="field">
    <label class="label">Уверенность</label>
  </div>
  ${state.users.map((name, i) => Confidence(name, i))}
`

const Modifier = (name, i) => html`
  <div class="field has-addons">
    <p class="control">
      <a class="button is-static">
        <span class="icon">
          <i class="fas fa-user"></i>
        </span>
        <span>
          ${name}
        </span>
      </a>
    </p>
    <p class="control">
      <a class="button is-static">
        ${modVar} =
      </a>
    </p>
    <p class="control">
      <input
        .value=${state.statement.modifiers[i]}
        @input=${(e) => actions.statement.setModifier(i, e.target.value)}
        class="input"
        type="text"
      >
    </p>
    <p class="control">
      <a
        class="button is-danger"
        @click=${() => actions.statement.setModifier(i, null)}
      >
        <span class="icon">
          <i class="fas fa-trash-alt"></i>
        </span>
      </a>
    </p>
  </div>
`

const Modifiers = () => html`
  <div class="field">
    <label class="label">Модификатор</label>
  </div>
  ${state.users.map((name, i) => Modifier(name, i))}
`

const RelationStatement = (relId) => {
  const { type, modifiedText } = state.statements[relId]
  return html`
    <div class="list-item">
      ${TypeIcon(type)}
      ${modifiedText}
    </div>
  `
}

const StartPicking = (role) => html`
  <button class="button" @click=${() => actions.list.startPicking(role)}>
    Выбрать из списка
  </button>
`

const EndPicking = () => html`
  <button class="button" @click=${actions.list.endPicking}>
    Закончить выбор
  </button>
`

const Relation = ([role, { listLabel }]) => html`
  <div class="field">
    <label class="label">
      ${listLabel}
    </label>
    <div class="list rel-list field">
      ${state.statement.relations[role].map(RelationStatement)}
    </div>
    ${(state.list.picking && state.list.pickingRole === role) ? EndPicking() : StartPicking(role)}
  </div>
`

const Relations = (type) => {
  const { relations } = ontology[type]
  if (!relations) {
    return ''
  } else {
    return Object.entries(relations).map(Relation)
  }
}

const eventFilterOn = () => state.filter.key === 'byType'
  && Object.entries(state.filter.types)
    .every(([type, on]) => ontology[type].ordered === on)

const OrderButton = (d) => {
  const onClick = () => actions.list.moveEvent(d)
  const label = (d === -1) ? 'Раньше' : 'Позже'
  const order = state.eventOrder
  const edge = (d === -1) ? 0 : order.length - 1
  const disabled = order[edge] === state.activeId || !eventFilterOn()
  return html`
    <button class="button" @click=${onClick} ?disabled=${disabled} >
      ${label}
    </button>
  `
}

const EventOrder = (type) => {
  if (state.activeId === null) return ''
  if (!ontology[type].ordered) return ''
  return html`
    <div class="field">
      <label class="label">Очерёдность событий</label>
      <div class="control is-grouped">
        <button
          class="button"
          @click=${actions.filter.showOrdered}
          ?disabled=${eventFilterOn()}
        >
          Редактировать очередность
        </button>
        ${[-1, 1].map(OrderButton)}
      </div>
    </div>
  `
}

const Explanation = (type) => {
  if (state.activeId === null) return ''
  if (!ontology[type].canExplain) return ''
  return html`
    <div class="field">
      <label class="label">Объяснение</label>
      <div class="list rel-list field">
        ${state.statement.relations[role].map(RelationStatement)}
      </div>
      ${(state.list.picking && state.list.pickingRole === 'explanation') ? EndPicking() : StartPicking(role)}
    </div>
  `
}

export const Statement = () => {
  const { type } = state.statement
  const { hasConfidences } = ontology[type]
  return html`
    <div class="card fh-scroll">
      ${Header()}
      <div class="card-content">
        ${TypeInput(type)}
        ${TextInput(type)}
        ${(type === 'citation') ? Citation() : ''}
        ${(type === 'citation') ? UrlInput() : ''}
        ${(hasConfidences) ? Modifiers() : ''}
        ${Relations(type)}
        ${EventOrder(type)}
        ${Actions()}
      </div>
    </div>
  `
}
