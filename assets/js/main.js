document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.querySelector(".overlay")

    /* Hamburger component */
    const hamburger = {
        init: function () {
            const hamburgerMenu = document.querySelector("#hamburgerMenu")
            hamburgerMenu.addEventListener("click", this.handler)
        },
        handler: function (e) {
            const headerMenu = document.querySelector("#headerMenu")
            const overlay = document.querySelector(".overlay")

            e.preventDefault()
            headerMenu.classList.toggle("header__menu-show")
            overlay.classList.toggle("overlay-show")
        }
    }
    hamburger.init()

    /* Modal component */
    const modal = {
        init: function () {
            const modalBtn = document.querySelector("#modalBtn")
            const modalClose = document.querySelector(".modal__close")

            modalBtn.addEventListener("click", this.open)
            modalClose.addEventListener("click", this.close)
        },
        open: function (e) {
            const modalWindow = document.querySelector("#modal")

            e.preventDefault()
            modalWindow.classList.add("modal-show")
            overlay.classList.add("overlay-show")
        },
        close: function () {
            const modalWindow = document.querySelector("#modal")

            modalWindow.classList.remove("modal-show")
            overlay.classList.remove("overlay-show")
        }
    }
    modal.init()

    /* Phone mask from library IMask */
    const phoneMask = {
        init: function () {
            const formFieldPhone = document.querySelector('[name="phone"]')
            formFieldPhone.addEventListener('input', function () {
                let str = this.value

                if (str.indexOf('8') === 0) {
                    str = str.replace('8', '+7')
                    this.value = str
                }
            })

            const maskOptions = { mask: '+{7}(000)000-00-00' }
            IMask(formFieldPhone, maskOptions)
        }
    }
    phoneMask.init()

    /* Form handler */
    const form = {
        init: function () {
            const formBlock = document.getElementById("form")
            const fieldName = document.getElementById("name")
            const fieldCompanySite = document.getElementById("company_site")
            const fieldPhone = document.getElementById("phone")

            formBlock.addEventListener("submit", async function (e) {
                e.preventDefault()

                if (form.checkRequired([fieldName, fieldCompanySite, fieldPhone])) return false
                if (!form.validateURL(fieldCompanySite.value)) return false

                const formData = new FormData(formBlock)

                form.sendData(formData)
                    .then((response) => {
                        console.log(response);

                        alert('Ваша заявка отправлена!')
                        formBlock.reset(); // очищаем поля формы
                    })
                    .catch((err) => console.error(err))
            })
        },

        sendData: async function (data) {
            const response = await fetch("/handler/form.php", {
                method: "POST",
                body: data
            });
            if (!response.ok) {
                throw new Error(`Произошла ошибка ${response.status} при отправке формы`);
            }
            return await response.text();
        },

        showError: function (message) {
            const formBlock = document.getElementById("form")

            const errorBlock = formBlock.querySelector(".form__error")
            errorBlock.classList.add("form__error-show")
            errorBlock.innerText = message
        },

        validateURL: function (val) {
            const pattern = new RegExp(
                '^([a-zA-Z]+:\\/\\/)?' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$',
                'i'
            )
            if (!pattern.test(val)) {
                this.showError("Введен неправильный URL адрес")
                return false
            }

            return pattern.test(val)
        },

        checkRequired: function (inputElements) {
            let isRequired = false
            inputElements.forEach((input) => {
                if (input.value.trim() === "") {
                    this.showError(`Требуется задать значение для поля "${this.getFieldName(input)}"`)
                    isRequired = true
                }
            })

            return isRequired
        },

        getFieldName: function (input) {
            return input.getAttribute('placeholder')
        }
    }
    form.init()
})