<template>
    <div>
        <base-deployment :state="'Successfully deployed'"
                         :label-color="'green'"
                         :deployment="deployment">

        </base-deployment>
        <div v-accordion="hasChangedFiles" v-if="hasChangedFiles" class="change-set ui styled accordion">
            <div class="title">
                <i class="dropdown icon"></i>
                Changed files: {{ filesCount }}
            </div>
            <div class="content">
                <change-set :files="changedFiles" :files-count="filesCount"></change-set>
            </div>
        </div>
    </div>
</template>
<style>
    .change-set {
        margin-top: 30px;
    }
</style>
<script type="text/ecmascript-6">
    import baseDeployment from './base.vue'
    import beanstalk from '../../services/api'
    import changeSet from './changes/changeSet.vue'
    import errorReporter from '../../mixins/errorReporter.vue'

    export default {
        props: ['deployment'],
        components: { baseDeployment, changeSet },
        mixins: [errorReporter],
        data(){
            return {
                changedFiles: []
            }
        },
        computed: {
            hasChangedFiles() {
                return this.changedFiles.length > 0
            },
            filesCount() {
                return this.changedFiles.length
            }
        },
        created() {
            beanstalk.changeSetDiffs(this.deployment.release.revision, this.deployment.repository.id, (err, res) => {
                if (err) {
                    this.reportError(err)
                    return false
                }
                console.log(res)
                this.changedFiles = res.files
            })
        },

        directives: {
            accordion: {
                bind(el) {
                    $(el).accordion()
                }
            }
        }
    }
</script>