import Vue from 'vue';
import RepoCard from './components/repoCard.vue'
import Loader from './components/loader.vue'
import Command from './components/command.vue'
import Config from './components/config.vue'
import StickyRefresh from './components/stickyRefresh.vue'
import ErrorReporter from'./mixins/errorReporter.vue'
import beanstalk from './lib/api'
import {ipcRenderer} from 'electron'

new Vue({
    components: {RepoCard, Loader, Command, StickyRefresh, Config},
    mixins: [ErrorReporter],
    el: '#app',
    data() {
        return {
            ready: false,
            repositories: [],
            isLoading: false,
            commandOpened: false,
            searchTerm: null,
            toggledView: 'repos',
            config:  {
                account: '',
                username: '',
                token: ''
            }
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

    ready() {
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
                    this.isLoading = false
                }

                this.initCommandListeners()
            })

        },

        loadRepos() {
            beanstalk.getRepositories((err, repos) => {
                if(err) {
                    this.reportError(err)
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
        'repos-search'(search) {
            this.searchTerm = search
        },
        'config-file-changed'(config) {
            console.log(config)
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




