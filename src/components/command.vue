<template>
    <div class="search flex-container">
        <input ref="searchInput"
               v-model="search"
               class="shortcut-command"
               type="text"
               @keydown.down="selectItem"
        >
        <div v-show="search.length" class="ui divided items search-results">
            <div v-for="repo in searchableRepos" v-bind:key="repo.id">
                <div v-for="nameAndEnv in repo.nameAndEnvs"
                     v-bind:key="nameAndEnv.id"
                     :class="'result item'"
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

<script type="text/ecmascript-6">
    import eventHub from '../events/hub'

    export default {
        props: ['repositories', 'ready'],

        data() {
            return {
                search: '',
                selectRepo: 0,
                selectEnv: 0,
                selectedItem: null
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
                this.$refs.searchInput.focus()
            },

            selectItem() {
                if(this.searchableRepos.length) {
                    this.selectedItem = this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv].id
                    if(this.searchableRepos[this.selectRepo].nameAndEnvs[this.selectEnv + 1]) {
                        return this.selectEnv++;
                    }
                    if(this.searchableRepos[this.selectRepo + 1]) {
                        this.selectEnv = 0;
                        return this.selectRepo++;
                    }
                }
            }
        }
    }
</script>