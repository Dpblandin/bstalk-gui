export default {
  deployments: [],
  
  addDeployment(deployment) {
    this.setDeploymentMessage(deployment);
    this.deployments.push(deployment)
  },

  setDeploymentRelease(release, repository, environment) {
    for(let deployment of this.deployments) {
      if(deployment.repository.id === repository.id && deployment.environment.id === environment.id) {
        deployment.release = release
        this.setDeploymentMessage(deployment)
      }
    }
  },

  setDeploymentMessage(deployment) {
    let message = {
      html : '<div class="ui active inline small loader"></div>'
    }
    if(deployment.release.state === 'skipped') {
      message.html =
        `<a class="ui label">Bypassed</a>
         <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        ${deployment.release.environment_revision.substring(0, 8)}: ${deployment.release.comment}
        `
    }
    if(deployment.release.state === 'failed') {
      message.html =
        `<a class="ui red label">Failed deployment</a>
         <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        ${deployment.release.environment_revision.substring(0, 8)}: ${deployment.release.comment}
        `
    }
    if(deployment.release.state === 'success') {
      message.html =
        `<a class="ui green label">Successfully deployed</a>
         <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        ${deployment.release.environment_revision.substring(0, 8)}: ${deployment.release.comment}
        `
    }
    if(deployment.release.state !== 'skipped' && deployment.release.state !== 'failed' && deployment.release.state !== 'success') {
      message.html +=
        `Deploying <strong>${deployment.repository.name}</strong> on: 
         <a class="ui ${deployment.environment.color_label } label">${deployment.environment.name }</a>
        `
    }

    deployment.message = message
  }
}