<template>
    <div class="file-diff">
        <p v-for="line in lines" v-bind:class="parseLine(line)">
            {{ line }}
        </p>
    </div>
</template>
<style scoped>
    p.positive {
        background: #52c164;
    }

    p.negative {
        background: #e89797;
    }
</style>
<script type="text/ecmascript-6">
    export default{
        props: ['file'],
        computed: {
            parsedDiff() {
                return this.file.diff.replace(/([\s\S]*?)(?=@)/, "").replace(/@@+.*/g, "")
            },
            lines() {
                return this.parsedDiff.split('\n')
            }
        },

        methods: {
            parseLine(line) {
                if(line[0] === '+') {
                    return 'positive';
                }
                if(line[0] === '-') {
                    return 'negative'
                }

                return ''
            }
        }
    }
</script>