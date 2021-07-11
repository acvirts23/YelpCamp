// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    //Make an array from this thing of forms, in this case 'forms'
    Array.from(forms)
        .forEach(function (form) {
            //Add event listener to each form
            form.addEventListener('submit', function (event) {
                //Check the validity when the form is submitted
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()