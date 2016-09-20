
<script type="es6">
    export default{
        methods : {
            reportError(err, type = 'error') {
                if (err.response.error.text) {
                    swal('Oops!', `Something went wrong with beanstalk, here is what we know: ${err.response.error.text}`, type)
                }
                swal('Oops!', `Something went wrong with beanstalk, here is what we know: ${err}`, type)
            }
        }
    }
</script>