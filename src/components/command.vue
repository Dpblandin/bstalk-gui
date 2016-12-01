<template>
    <div class="search flex-container">
        <input ref="searchInput"
               v-model="search"
               class="shortcut-command"
               type="text"
               @keydown.down="selectItemDown"
               @keydown.up.prevent="selectItemUp"
               @keydown.delete="resetSelected"
               @keydown.enter="sendDeployEvent(selectedRepo, selectedItem)"
        >
        <div v-show="search.length" class="ui divided items search-results">
            <div v-for="repo in searchableRepos" v-bind:key="repo.id">
                <div v-for="nameAndEnv in repo.nameAndEnvs"
                     v-bind:key="nameAndEnv.id"
                     class="result item"
                     :class="{ 'is-selected' : isSelected(nameAndEnv.id) }"
                     @click="sendDeployEvent(repo, nameAndEnv.id)"
                     :ref="nameAndEnv.id"
                >
                    <div class="middle aligned content">
                        <span> {{ nameAndEnv.repoName }}</span>
                        <a v-bind:class="'ui small ' + nameAndEnv.colorLabel + ' label'">{{ nameAndEnv.envName }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .result.item.is-selected {
        background-color: #c1c1c1
    }
</style>

<script type="text/ecmascript-6">
    import eventHub from '../events/hub'

    export default {
        props: ['repositories', 'ready'],

        data() {
            return {
                search: '',
                selectRepo: -1,
                selectEnv: -1,
                selectedItem: null,
                selectedRepo: null
            }
        },

        computed: {
            searchableRepos() {
                if(this.ready) {
                    const repositories = this.repositories.map((repo) => {
                        repo.nameAndEnvs = []
                        for (let env of repo.environments) {
                            repo.nameAndEnvs.push(
                                    {
                                        name: repo.name + ' ' + env.name,
                                        repoName: repo.name,
                                        envName: env.name,
                                        colorLabel: env.color_label,
                                        id: env.id
                                    }
                            )
                        }
                        return repo

                    })
                    const searchRegex = new RegExp(this.search, 'i')
                    return repositories.filter((repo) => {
                        for(let nameAndEnv of repo.nameAndEnvs) {
                            return searchRegex.test(nameAndEnv.name)
                        }
                    })
                }
            }
        },

        created() {
            eventHub.$on('command.focus', this.focusCommand)
        },
        beforeDestroy: function () {
            eventHub.$off('command-focus', this.focusCommand)
        },

        methods: {
            sendDeployEvent(repo, envId) {
                eventHub.$emit('environment.deploy-repo', { repoId: repo.id, envId })
            },

            focusCommand() {
                this.search = ''
                this.resetSelected()
                this.$refs.searchInput.focus()
            },

            selectItemDown() {
                if(this.searchableRepos.length) {
                    if(this.selectEnv === -1 && this.selectRepo === -1) {
                        this.selectEnv++
                        this.selectRepo++
                        this.selectedItem = this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv].id
                        this.selectedRepo = this.searchableRepos[this.selectRepo]
                        this.$refs[this.selectedItem][0].scrollIntoView(false)
                        return
                    }
                    if(this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv + 1]) {
                        this.selectEnv++
                        this.selectedItem = this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv].id
                        this.selectedRepo = this.searchableRepos[this.selectRepo]
                        this.$refs[this.selectedItem][0].scrollIntoView(false)
                        return
                    }
                    if(this.searchableRepos[this.selectRepo + 1]) {
                        this.selectEnv = 0
                        this.selectRepo++
                        this.selectedItem = this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv].id
                        this.selectedRepo = this.searchableRepos[this.selectRepo]
                        this.$refs[this.selectedItem][0].scrollIntoView(false)
                        return
                    }
                }
            },

            selectItemUp() {
                if(this.searchableRepos.length) {
                    if(this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv - 1]) {
                        this.selectEnv--
                        this.selectedItem = this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv].id
                        this.selectedRepo = this.searchableRepos[this.selectRepo]
                        this.$refs[this.selectedItem][0].scrollIntoView(false)
                        return

                    }
                    if(this.searchableRepos[this.selectRepo - 1]) {
                        this.selectEnv = this.searchableRepos[this.selectRepo - 1].nameAndEnvs.length -1
                        this.selectRepo--
                        this.selectedItem = this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv].id
                        this.selectedRepo = this.searchableRepos[this.selectRepo]
                        this.$refs[this.selectedItem][0].scrollIntoView(false)
                        return
                    }
                }
            },

            isSelected(nameAndEnvId) {
                if(this.selectedItem) {
                    return this.selectedItem === nameAndEnvId
                }

            },

            resetSelected() {
                this.selectedItem = null
                this.selectEnv = -1
                this.selectRepo = -1
            }
        }
    }
</script>