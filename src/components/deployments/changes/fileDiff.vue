<template>
    <div class="file-diff">
        <p v-for="line in lines" :class="parseLine(line)">
            {{ line }}
        </p>
    </div>
</template>
<style lang="scss">
    .file-diff {
        background: #393e3f;
        color: #FFF;
        margin-top: 5px;
        padding: 2px 10px;

        p.positive {
            background: #48643c;
            margin: 0;
            padding: 3px 0;
        }

        p.negative {
            background: #663637;
            margin: 0;
            padding: 3px 0;
        }
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