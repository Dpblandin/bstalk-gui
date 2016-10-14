<template>
    <confirm-modal :is-visible.sync="showModal"
                   :environment="environment"
                   :repository="repository"
                   :on-confirm="pushToEnv"
                   :release-state="releaseState"
    >

    </confirm-modal>
    <button @click="displayModal"
            disabled="{{ release.state && !releaseDone }}"
            class="ui labeled icon {{ environment.color_label }} button">
        <i class="upload icon"></i>
        {{ environment.name }}
    </button>
</template>

<script type="text/ecmascript-6">
    import beanstalk from '../services/api'
    import ConfirmModal from './confirmModal.vue'
    import ErrorReporter from '../mixins/errorReporter.vue'
    import deployments from '../states/deployments'
    import moment from 'moment'

    export default {
        components: { ConfirmModal },
        mixins: [ErrorReporter],
        props: ['repository', 'environment'],

        data() {
            return {
                showModal: false,
                release: {}
            }
        },

        computed: {
            releaseState() {
                switch (this.release.state) {
                    case 'waiting':
                        beanstalk.release(this.repository.id, this.release.id, (release) => {
                            this.release = release
                            deployments.setDeploymentRelease(this.release, this.repository, this.environment)
                        })
                        return 'waiting'
                        break
                    case 'pending':
                        beanstalk.release(this.repository.id, this.release.id, (release) => {
                            this.release = release
                            deployments.setDeploymentRelease(this.release, this.repository, this.environment)
                        })
                        return 'pending'
                        break
                    case 'success':
                        return 'success'
                        break
                    case 'skipped':
                        return 'skipped'
                        break
                    case 'failed':
                        return 'failed'
                        break
                }

                return ''
            },

            releaseDone() {
                return this.releaseState === 'success' || this.releaseState === 'skipped' || this.releaseState === 'failed'
            }
        },

        methods: {
            displayModal() {
                this.showModal = true
            },
            pushToEnv() {
                this.release.state = 'pending'
                deployments.addDeployment({
                    repository: this.repository,
                    environment: this.environment,
                    release: {state: this.release.state}
                })
                beanstalk.deploy(this.repository.id, this.environment.id, null, false, (err, release) => {
                    if(err) {
                        this.reportError(err)
                        return false;
                    }
                    this.release = release
                    this.repository.updated_at = moment().format()
                    deployments.setDeploymentRelease(this.release, this.repository, this.environment)
                    this.$dispatch('repo-deployed')
                })
            }
        },
        events: {
            'deploy-repo'(repoEnv) {
                if(repoEnv.repoId === this.repository.id && repoEnv.envId === this.environment.id) {
                    this.displayModal()
                }
            }
        }
    }
</script>