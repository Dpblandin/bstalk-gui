
<script type="text/ecmascript-6">
    export default{
        methods : {
            reportError(res, type = 'error', advanced = false) {
                let swalOpts = {
                    title: 'Oops!',
                    type: type,
                    text: 'Something went wrong with beanstalk, here is what we know: ',
                    showCloseButton: advanced || false,
                    showCancelButton: advanced || false,
                    confirmButtonClass: 'ui primary button',
                    cancelButtonClass: 'ui teal button',
                    cancelButtonColor: '#00B5AD',

                    confirmButtonText:
                            'Go to settings',
                    cancelButtonText:
                            'Try again'
                }
                swalOpts.text += [...res.errors] || res

                if(advanced) {
                    return swal(swalOpts).then(() => {
                        this.toggledView='settings'
                    }, (dismiss) => {
                        this.isLoading = true
                        this.loadRepos()
                    })
                }

                return swal(swalOpts)
            }
        }
    }
</script>