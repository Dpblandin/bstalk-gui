import Vuex from 'vuex'

const state = {
  deployments: []
}

const getters = {
  deployments: state => state.deployments
}

const internal = {
  setDeploymentMessage: (deployment) => {
    let message = deployment.message || {}
    if(deployment.release.state === 'skipped') {
      message.html =
        `<a class="ui label">Bypassed</a>
         <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        <strong>${deployment.release.environment_revision.substring(0, 8)}</strong>: ${deployment.release.comment}
        `
    }
    if(deployment.release.state === 'failed') {
      message.html =
        `<a class="ui red label">Failed deployment</a>
         <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        <strong>${deployment.release.environment_revision.substring(0, 8)}</strong>: ${deployment.release.comment}
        `
    }
    if(deployment.release.state === 'success') {
      message.html =
        `<a class="ui green label">Successfully deployed</a>
         <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        <strong>${deployment.release.environment_revision.substring(0, 8)}</strong>: ${deployment.release.comment}
        `
    }
    if(deployment.release.state !== 'skipped' && deployment.release.state !== 'failed' && deployment.release.state !== 'success') {
      message.state = 'loading'
      message.html =
        `<div class="ui active inline small loader"></div>
         Deploying <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        `
    }

    deployment.message = message
  }
}

const mutations = {
  ADD_DEPLOYMENT: (state, deployment) => {
    internal.setDeploymentMessage(deployment);
    state.deployments.push(deployment)
  },

  SET_DEPLOYMENT_RELEASE: (state, {release, repository, environment}) => {
    for(let deployment of state.deployments) {
      if(deployment.release.id && deployment.release.id === release.id) {
        deployment.release = release
        internal.setDeploymentMessage(deployment)
      }
      if(!deployment.release.id && deployment.repository.id === repository.id && deployment.environment.id === environment.id) {
        deployment.release = release
        internal.setDeploymentMessage(deployment)
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