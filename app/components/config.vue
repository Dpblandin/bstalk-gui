<template>
    <form class="ui form">
        <div class="field">
            <label>Account</label>
            <input v-model="newAccount" type="text" name="newAccount" placeholder="Beanstalk account">
        </div>
        <div class="field">
            <label>Username</label>
            <input v-model="newUsername" type="text" name="newUsername" placeholder="Beanstalk username">
        </div>
        <div class="field">
            <label>Token</label>
            <input v-model="newToken" type="text" name="newToken" placeholder="Beanstalk token">
        </div>
        <button @click="saveConfig" class="ui primary button" type="submit">Save and close</button>
        <button @click="clearReposCache" class="ui grey button" type="submit">Clear repositories cache</button>
    </form>
</template>

<script>
    import {ipcRenderer} from 'electron'

    export default {
        props: ['account', 'username', 'token'],
        data() {
            return {
                newAccount: this.account,
                newUsername: this.username,
                newToken: this.token
            }
        },
        computed: {
            hasNewConfigItem() {
               return this.account !== this.newAccount
                || this.username !== this.newUsername
                || this.token !== this.newToken
            }
        },

        methods: {
            saveConfig() {
                if(this.hasNewConfigItem) {
                    const config = {
                        account: this.newAccount,
                        username: this.newUsername,
                        token: this.newToken
                    }
                    ipcRenderer.send('config-file-changed', config)
                    this.$dispatch('config-file-changed', config)
                }
            },

            clearReposCache() {
                ipcRenderer.send('remove-repos-cache')
            }
        }
    }
</script>