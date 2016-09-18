<template>
    <div class="search flex-container">
        <input v-el:search-input
               @keyup="sendSearchEvent"
               v-model="search"
               class="shortcut-command"
               type="text"
        >
        <div v-show="hasResults" class="ui divided items search-results">
            <div v-for="repo in foundRepos" class="result item">
                <div class="middle aligned content">
                    {{ repo.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script type="es6">
    export default {
        props: ['repositories'],

        data() {
            return {
                search: ''
            }
        },

        computed: {
            foundRepos() {
                if(this.search.length > 0) {
                    const regex = new RegExp(`${this.search}+`, 'i')
                    return this.repositories.filter((repo) => {
                        return regex.exec(repo.name)
                    })
                }

                return []
            },

            hasResults() {
                return this.foundRepos.length > 0
            }
        },

        methods: {
            sendSearchEvent() {
                this.$dispatch('repos-search', this.search)
            }
        },

        events: {
            'focus-command'() {
               this.$els.searchInput.focus();
            }
        }
    }
</script>