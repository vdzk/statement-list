import { compute } from './compute.js'
import { updateRoute, applyRoute } from './router.js'
import { onStateChange } from './state.js'
import { App } from './views/app.js'
import { render } from '../third_party/lit-html/lit-html.js'
import { loadStore } from './store.js'

const update = () => {
  compute()
  updateRoute()
  render(App(), document.getElementById('App'))
  console.log('rendered')
}
loadStore()
applyRoute()
update()
onStateChange(update)
