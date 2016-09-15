import Vue from 'vue';
import RepoCard from './components/repoCard.vue'
import Loader from './components/loader.vue'
import Command from './components/command.vue'
import beanstalk from './lib/api'
import {ipcRenderer} from 'electron'

new Vue({
    components: {RepoCard, Loader, Command},
    el: '#app',
    data() {
        return {
            repositories: [],
            isLoading: true,
            commandOpened: false,
            searchTerm: null
        }
    },

    created() {
        ipcRenderer.send('vue-ready');
    },

    ready() {
        ipcRenderer.on('config-file-ready', (event, arg) => {
            console.log(arg)
        })
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
            })
        })
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

    methods: {
        toggleCommand() {
            this.commandOpened = !this.commandOpened
        }
    },

    events: {
        'repos-search'(search) {
            this.searchTerm = search
        }
    }
})




