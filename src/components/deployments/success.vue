<template>
    <div>
        <base-deployment :state="'Successfully deployed'"
                         :label-color="'green'"
                         :deployment="deployment">

        </base-deployment>
        <div v-accordion="hasChangedFiles" v-if="hasChangedFiles" class="file-diff ui styled accordion">
            <div class="title">
                <i class="dropdown icon"></i>
                Changed files: {{ filesCount }}
            </div>
            <div class="content">
                <file-diff :files="changedFiles" :files-count="filesCount"></file-diff>
            </div>
        </div>
    </div>
</template>
<style>
    .file-diff {
        margin-top: 30px;
    }
</style>
<script type="text/ecmascript-6">
    import baseDeployment from './base.vue'
    import beanstalk from '../../services/api'
    import fileDiff from './diff/fileDiff.vue'
    import errorReporter from '../../mixins/errorReporter.vue'

    export default {
        props: ['deployment'],
        components: { baseDeployment, fileDiff },
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
            beanstalk.changeSet(this.deployment.release.revision, this.deployment.repository.id, (err, res) => {
                if (err) {
                    this.reportError(err)
                    return false
                }
                this.changedFiles = res.revision_cache.changed_files
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