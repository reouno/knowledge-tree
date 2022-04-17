import { VuexPersistence } from 'vuex-persist'
import Cookies from 'js-cookie'

const defaultState = {
  user: null,
  loggedIn: false,
  strategy: 'cookie',
}

export default ({ store }: any) => {
  new VuexPersistence({
    restoreState: (key, _storage) => {
      const restored = Cookies.get(key)
      return restored ? JSON.parse(restored) : defaultState
    },
    saveState: (key, state, _storage) => {
      Cookies.set(key, JSON.stringify(state), {
        expires: 3,
      })
    },
    // modules: ['user'], // only save user module
    // filter: (mutation) => mutation.type == 'logIn' || mutation.type == 'logOut',
  }).plugin(store)
}
