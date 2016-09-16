import Vue from 'vue';
import RepoCard from './components/repoCard.vue'
import Loader from './components/loader.vue'
import Command from './components/command.vue'
import Config from './components/config.vue'
import beanstalk from './lib/api'
import {ipcRenderer} from 'electron'

new Vue({
    components: {RepoCard, Loader, Command, Config},
    el: '#app',
    data() {
        return {
            repositories: [],
            isLoading: false,
            commandOpened: false,
            searchTerm: null,
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
    },

    methods: {
        init() {
            if(!this.incompleteConfigFile) {
                this.isLoading = true
                beanstalk.setConfig(this.config)
                ipcRenderer.send('load-repos-cache');
                ipcRenderer.on('repos-cache-loaded', (event, err, repos) => {
                    const repositories = JSON.parse(repos)
                    if(!repositories) {
                        this.loadRepos()
                    } else {
                        this.repositories = repositories
                        this.isLoading = false
                    }

                    this.initCommandListeners()
                })
            }
        },

        loadRepos() {
            beanstalk.getRepositories((repos) => {
                this.repositories = repos.map((repo) => {
                    return repo.repository
                })
                let promises = [];
                for(let repo of this.repositories) {
                    promises.push(new Promise((resolve, reject) => {
                        beanstalk.getEnvironments(repo.name, (envs) => {
                            repo.environments = envs
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
            ipcRenderer.send('repos-loaded', this.repositories)
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
                this.toggleCommand()
            })
        },
        toggleCommand() {
            this.commandOpened = !this.commandOpened
        }
    },

    events: {
        'repos-search'(search) {
            this.searchTerm = search
        },
        'config-file-changed'() {
            this.init();
        }
    }
})




