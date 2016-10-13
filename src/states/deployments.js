export default {
  deployments: [],
  
  addDeployment(deployment) {
    deployment.message = this.getDeploymentMessage(deployment);
    this.deployments.push(deployment)
  },

  setDeploymentRelease(release, repository, environment) {
    for(let deployment of this.deployments) {
      if(deployment.repository.id === repository.id && deployment.environment.id === environment.id) {
        deployment.release = release
      }
    }
  },

  getDeploymentMessage(deployment) {
    return `Deploying <strong>${deployment.repository.name}</strong> on: <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>`
  }
}