<template>
    <span>
        <confirm-modal :is-visible="showModal"
                       v-on:toggle-modal="toggleModal"
                       :environment="environment"
                       :repository="repository"
                       :on-confirm="pushToEnv"
                       :release-state="releaseState"
                       :release-done="releaseDone"
        >

        </confirm-modal>
        <button @click="displayModal"
                :disabled="release.state !== '' && !releaseDone"
                :class="'ui labeled icon ' + environment.color_label + ' button'">
            <i class="upload icon"></i>
            {{ environment.name }}
        </button>
    </span>
</template>

<script type="text/ecmascript-6">
    import beanstalk from '../services/api'
    import ConfirmModal from './confirmModal.vue'
    import ErrorReporter from '../mixins/errorReporter.vue'
    import deployments from '../stores/deployments'
    import * as deploymentTypes from '../constants/deploymentTypes'
    import {mapActions, mapGetters} from 'vuex'
    import eventHub from '../events/hub'

    export default {
        store: deployments,
        components: { ConfirmModal },
        mixins: [ErrorReporter],
        props: ['repository', 'environment'],

        data() {
            return {
                showModal: false,
                release: {
                    state: ''
                }
            }
        },

        computed: {
            ...mapGetters(['deployments']),
            releaseState() {
                switch (this.release.state) {
                    case deploymentTypes.PENDING:
                        beanstalk.release(this.repository.id, this.release.id, (err, release) => {
                            if(err) {
                                this.reportError(err)
                            }
                            this.release = release
                            this.setDeploymentRelease({release: this.release, repository: this.repository, environment: this.environment})
                        })
                        return deploymentTypes.PENDING
                        break
                    case deploymentTypes.WAITING:
                        beanstalk.release(this.repository.id, this.release.id, (err, release) => {
                            if(err) {
                                this.reportError(err)
                            }
                            this.release = release
                            this.setDeploymentRelease({release: this.release, repository: this.repository, environment: this.environment})
                        })
                        return deploymentTypes.WAITING
                        break
                    case deploymentTypes.SUCCESS:
                        this.resetRelease()
                        return deploymentTypes.SUCCESS
                        break
                    case deploymentTypes.SKIPPED:
                        this.resetRelease()
                        return deploymentTypes.SKIPPED
                        break
                    case deploymentTypes.FAILED:
                        this.resetRelease()
                        return deploymentTypes.FAILED
                        break
                    default:
                        return ''
                        break
                }
            },

            releaseDone() {
                return this.releaseState === deploymentTypes.SUCCESS || this.releaseState === deploymentTypes.SKIPPED || this.releaseState === deploymentTypes.FAILED
            }
        },

        created() {
            eventHub.$on('environment.deploy-repo', this.deployFromCommand)
        },

        beforeDestroy: function () {
            eventHub.$off('environment.deploy-repo', this.deployFromCommand)
        },
        
        methods: {
            ...mapActions(['addDeployment', 'setDeploymentRelease']),
            deployFromCommand(repoEnv) {
                if(repoEnv.repoId === this.repository.id && repoEnv.envId === this.environment.id) {
                    this.displayModal()
                }
            },

            resetRelease() {
                this.release = { state: '' }
            },

            displayModal() {
                this.showModal = true
            },
            toggleModal() {
                this.showModal = !this.showModal
            },
            pushToEnv() {
                this.addDeployment({
                    repository: this.repository,
                    environment: this.environment,
                    release: this.release
                })
                beanstalk.deploy(this.repository.id, this.environment.id, null, false, (err, release) => {
                    if(err) {
                        this.reportError(err)
                        return false;
                    }
                    this.release = release
                    this.setDeploymentRelease({release: this.release, repository: this.repository, environment: this.environment})
                    eventHub.$emit('main.repo-deployed')
                })
            }
        }
    }
</script>