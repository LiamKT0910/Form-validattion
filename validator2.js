
function Validator2(formSelector) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    let formRules = {}
    let validatorRules = {
        required: function (value) {
            return value ? undefined : 'Please Enter Your Name'
        },
        email: function (value) {
            let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return regex.test(value) ? undefined : 'Please Enter Your Email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Please Enter Atleast ${min} digits`
            }
            return value ? undefined : 'Please Enter Your Name'
        },
    }

    let formElement = document.querySelector(formSelector)
    if (formElement) {
        let inputs = formElement.querySelectorAll('[name][rules]')
        for (let input of inputs) {
            let rules = input.getAttribute('rules').split('|')
            for (let rule of rules) {
                let ruleInfo
                let isRuleHasValue = rule.includes(':')

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');

                    rule = ruleInfo[0]
                    // console.log(validatorRules[rule](ruleInfo[1]))
                }
                let ruleFunc = validatorRules[rule]

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }

            // validate (onBlur, onChange...)
            input.onblur = handleValidate
            input.oninput = handleClearError
        }
        // Validate Function
        function handleValidate(event) {
            let rules = formRules[event.target.name]
            let errorMessage
            for (let rule of rules) {
                errorMessage = rule(event.target.value)
                if(errorMessage) break
            }
            
            // If Error show on UI
            if (errorMessage) {
                let formGroup = getParent(event.target, '.form-group')
                if (formGroup) {
                    formGroup.classList.add('invalid')
                    let formMessage = formGroup.querySelector('.form-message')
                    if (formMessage) {
                        formMessage.innerText = errorMessage
                    }
                }
            }
            return !errorMessage
        }

        // Clear Error Message
        function handleClearError(event) {
            let formGroup = getParent(event.target, '.form-group')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')
                let formMessage = formGroup.querySelector('.form-message')
                if (formMessage) {
                    formMessage.innerText = ''
                }
            }
        }
    }

    // Submit form
    formElement.onsubmit = function (event) {
        event.preventDefault()
        

    }


}