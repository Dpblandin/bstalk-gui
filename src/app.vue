<template>
    <div>
        <command v-show="commandOpened && !isLoading" :repositories="repositories" :ready="allLoaded"></command>
        <loader v-show="isLoading"></loader>
        <config v-if="(incompleteConfigFile && !isLoading && ready) || (toggledView === 'settings')"
                :account="config.account"
                :username="config.username"
                :token="config.token"
                :theme="ui.theme">
        </config>
        <deployments-toaster v-show="deployments.length" :deployments="deployments"></deployments-toaster>
        <div v-if="!isLoading && !incompleteConfigFile && toggledView === 'repos'" class="ui top segment">
            <div id="repositories" class="ui divided items">
                <repo-card v-for="repository in repositories"
                           v-bind:key="repository.id"
                           :repository.sync="repository">

                </repo-card>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {version} from '../app/package.json'
    import RepoCard from './components/repoCard.vue'
    import Loader from './components/loader.vue'
    import DeploymentsToaster from './components/deployments/deployments.vue'
    import Command from './components/command.vue'
    import Config from './components/config.vue'
    import ErrorReporter from'./mixins/errorReporter.vue'
    import beanstalk from './services/api'
    import {ipcRenderer} from 'electron'
    import {mapGetters} from 'vuex'
    import deployments from './stores/deployments'
    import eventHub from './events/hub'

    export default {
        store: deployments,
        components: {RepoCard, Loader, Command, Config, DeploymentsToaster},
        mixins: [ErrorReporter],
        data() {
            return {
                ready: false,
                repositories: [],
                allLoaded: false,
                isLoading: false,
                commandOpened: false,
                searchTerm: null,
                toggledView: 'repos',
                config: {
                    account: '',
                    username: '',
                    token: ''
                },
                ui: {
                    theme: ''
                }
            }
        },

        computed: {
            ...mapGetters(['deployments']),
            incompleteConfigFile() {
                return this.config.account === '' || this.config.username === '' || this.config.token === ''
            }
        },
        created() {
            document.title = `Bstalk Gui ${version}`
            ipcRenderer.send('vue-ready')
            eventHub.$on('main.repo-deployed', this.sendReposLoadedEvent)
            eventHub.$on('main.config-file-changed', this.updateConfigAndInit)
        },

        beforeDestroy: function () {
            eventHub.$off('main.repo-deployed', this.sendReposLoadedEvent)
            eventHub.$off('main.config-file-changed', this.updateConfigAndInit)
        },

        mounted() {
            ipcRenderer.on('config-file-ready', (event, arg) => {
                const conf = JSON.parse(arg)
                this.config = conf
                this.init()
            })

            ipcRenderer.on('ui-file-ready', (event, arg) => {
                const ui = JSON.parse(arg)
                this.ui = ui
            })

            ipcRenderer.on('toggle-view', (event, arg) => {
                this.toggledView = arg
            })
        },

        methods: {
            init() {
                this.isLoading = true
                this.ready = true
                if (this.incompleteConfigFile) {
                    this.isLoading = false
                    return ipcRenderer.send('remove-repos-cache')
                }
                beanstalk.setConfig(this.config)
                ipcRenderer.send('load-repos-cache');
                ipcRenderer.on('repos-cache-loaded', (event, err, repos) => {
                    const repositories = JSON.parse(repos)
                    if (!repositories) {
                        this.loadRepos()
                    }
                    else {
                        this.repositories = repositories
                        this.allLoaded = true
                        this.isLoading = false
                    }

                    this.initCommandListeners()
                })

            },

            updateConfigAndInit(config) {
                this.config = config
                this.init()
            },

            loadRepos() {
                beanstalk.getRepositories((err, res) => {
                    if(err) {
                        this.reportError(res, 'error', true)
                        this.isLoading = false

                        return false
                    }
                    this.repositories = res.map((repo) => {
                            return repo.repository
                        }
                    )
                    let promises = [];
                    for (let repo of this.repositories) {
                        promises.push(new Promise((resolve, reject) => {
                            beanstalk.getEnvironments(repo.name, (err, envs) => {
                                if (err) {
                                    this.reportError(err)
                                    this.isLoading = false

                                    return false
                                }
                                repo.environments = []
                                for (let item in envs) {
                                    repo.environments.push(envs[item])
                                }
                                resolve(repo)
                            })
                        }))
                    }
                    Promise.all(promises).then(() => {
                        this.isLoading = false
                        this.allLoaded = true
                        this.sendReposLoadedEvent()
                    })
                })
            },

            sendReposLoadedEvent() {
                ipcRenderer.send('save-repos-cache', this.repositories)
            },

            initCommandListeners() {
                ipcRenderer.on('shortcut-command', (event, arg) => {
                    this.toggleCommand()
                    if (this.commandOpened) {
                        this.$nextTick(() => {
                            eventHub.$emit('command.focus')
                        })
                    }
                })

                ipcRenderer.on('exit-command', (event, arg) => {
                    this.toggleCommand(true)
                })
            },
            toggleCommand(force = false) {
                if (force) {
                    return this.commandOpened = false
                }
                return this.commandOpened = !this.commandOpened
            }
        }
    }
</script>