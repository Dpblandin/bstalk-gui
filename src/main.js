import Vue from 'vue';
import RepoCard from './components/repoCard.vue'
import Loader from './components/loader.vue'
import Toaster from './components/toaster.vue'
import Command from './components/command.vue'
import Config from './components/config.vue'
import ErrorReporter from'./mixins/errorReporter.vue'
import beanstalk from './services/api'
import {ipcRenderer} from 'electron'
import deployments from './states/deployments'


new Vue({
    components: {RepoCard, Loader, Command, Config, Toaster},
    mixins: [ErrorReporter],
    el: '#app',
    data() {
        return {
            ready: false,
            repositories: [],
            allLoaded: false,
            isLoading: false,
            commandOpened: false,
            searchTerm: null,
            toggledView: 'repos',
            config:  {
                account: '',
                username: '',
                token: ''
            },
            deployments: deployments.deployments
        }
    },

    computed: {
      incompleteConfigFile() {
          return this.config.account === '' || this.config.username === '' || this.config.token === ''
      }
    },
    created() {
        ipcRenderer.send('vue-ready')
    },

    mounted() {
        ipcRenderer.on('config-file-ready', (event, arg) => {
            const conf = JSON.parse(arg)
            this.config = conf
            this.init()
        })

        ipcRenderer.on('toggle-view', (event, arg) => {
            this.toggledView = arg
        })
    },

    methods: {
        init() {
            this.isLoading = true
            this.ready = true
            if(this.incompleteConfigFile) {
                this.isLoading = false
                return ipcRenderer.send('remove-repos-cache')
            }
            beanstalk.setConfig(this.config)
            ipcRenderer.send('load-repos-cache');
            ipcRenderer.on('repos-cache-loaded', (event, err, repos) => {
                const repositories = JSON.parse(repos)
                if (!repositories) {
                    this.loadRepos()
                } else {
                    this.repositories = repositories
                    this.allLoaded = true
                    this.isLoading = false
                }

                this.initCommandListeners()
            })

        },

        loadRepos() {
            beanstalk.getRepositories((err, repos) => {
                if(err) {
                    this.reportError(err, 'error', true)
                    this.isLoading = false
                 
                    return false
                }
                this.repositories = repos.map((repo) => {
                    return repo.repository
                })
                let promises = [];
                for(let repo of this.repositories) {
                    promises.push(new Promise((resolve, reject) => {
                        beanstalk.getEnvironments(repo.name, (err, envs) => {
                            if(err) {
                                this.reportError(err)
                                this.isLoading = false

                                return false
                            }
                            repo.environments = []
                            for(let item in envs) {
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
                if(this.commandOpened) {
                    this.$nextTick(() => {
                        this.$broadcast('focus-command');
                    })
                }
            })

            ipcRenderer.on('exit-command', (event, arg) => {
                this.toggleCommand(true)
            })
        },
        toggleCommand(force = false) {
            if(force) {
                return this.commandOpened = false
            }
            return this.commandOpened = !this.commandOpened
        }
    },

    events: {
        'config-file-changed'(config) {
            this.config = config
            this.init()
        },
        'repo-deployed'() {
            this.sendReposLoadedEvent()
        },

        'deploy-repo'(repo) {
            this.$broadcast('deploy-repo', repo)
        }
    }
})




