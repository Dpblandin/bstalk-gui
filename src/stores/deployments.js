import Vuex from 'vuex'
import beanstalk from '../services/api'

const state = {
  deployments: []
}

const getters = {
  deployments: state => state.deployments
}

const mutations = {
  ADD_DEPLOYMENT: (state, deployment) => {
    state.deployments.push(deployment)
  },

  SET_DEPLOYMENT_RELEASE: (state, {release, repository, environment}) => {
    for(let deployment of state.deployments) {
      if(deployment.release.id && deployment.release.id === release.id) {
        deployment.release = release
      }
      if(!deployment.release.id && deployment.repository.id === repository.id && deployment.environment.id === environment.id) {
        deployment.release = release
      }
    }
  }
}

const actions = {
  addDeployment(store, deployment) {
    store.commit('ADD_DEPLOYMENT', deployment)
  },

  setDeploymentRelease(store, {release, repository, environment}) {
    store.commit('SET_DEPLOYMENT_RELEASE', {release, repository, environment})
  }
}

export default new Vuex.Store({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
})