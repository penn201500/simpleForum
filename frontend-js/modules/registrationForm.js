import axios from "axios"

export default class RegistrationForm {
  constructor() {
    this._csrf = document.querySelector('[name="_csrf"]').value // store csrf token in property: _csrf
    this.form = document.querySelector("#registration-form")
    this.allInputs = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.username.previousValue = ""
    this.email = document.querySelector("#email-register")
    this.email.previousValue = ""
    this.password = document.querySelector("#password-register")
    this.password.previousValue = ""
    this.username.isUnique = false
    this.email.isUnique = false
    this.events()
  }

  // Events
  events() {
    this.form.addEventListener("submit", e => {
      e.preventDefault()
      this.formSubmitHandler()
    })
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler)
    })
    this.password.addEventListener("keyup", () => {
      this.isDifferent(this.password, this.passwordHandler)
    })
    this.username.addEventListener("blur", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
    this.email.addEventListener("blur", () => {
      this.isDifferent(this.email, this.emailHandler)
    })
    this.password.addEventListener("blur", () => {
      this.isDifferent(this.password, this.passwordHandler)
    })
  }

  // Methods
  insertValidationElements() {
    this.allInputs.forEach(element => {
      element.insertAdjacentHTML("afterend", "<div class='alert alert-danger small liveValidateMessage'></div>")
    })
  }

  formSubmitHandler() {
    this.usernameImmediately()
    this.usernameAfterDelay()
    this.emailAfterDelay()
    this.passwordImmediately()
    this.passwordAfterDelay()

    if (this.username.isUnique && !this.email.errors && !this.password.errors) {
      this.form.submit()
    }
  }

  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this)
    }
    el.previousValue = el.value
  }

  usernameHandler() {
    this.username.errors = false
    this.usernameImmediately()
    clearTimeout(this.username.timer)
    this.username.timer = setTimeout(() => {
      this.usernameAfterDelay()
    }, 3000)
  }

  emailHandler() {
    this.email.errors = false
    clearTimeout(this.email.timer)
    this.email.timer = setTimeout(() => {
      this.emailAfterDelay()
    }, 3000)
  }

  passwordHandler() {
    this.password.errors = false
    this.passwordImmediately()
    clearTimeout(this.password.timer)
    this.password.timer = setTimeout(() => {
      this.passwordAfterDelay()
    }, 3000)
  }

  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "You must provide a valid email address.")
      this.email.errors = true
    }
    if (!this.email.errors) {
      axios
        .post("/doesEmailExist", { _csrf: this._csrf, email: this.email.value })
        .then(response => {
          if (response.data) {
            this.email.isUnique = false
            this.showValidationError(this.email, "That email is already being used.")
          } else {
            this.email.isUnique = true
            this.hideValidationError(this.email)
          }
        })
        .catch(() => {
          console.log(`Please try again later.`)
        })
    }
  }

  usernameImmediately() {
    if (this.username.value != "" && !/^([a-z0-9]+)$/i.test(this.username.value)) {
      this.showValidationError(this.username, "Username can only contain letters and numbers.")
    }
    if (this.username.value.length > 30) {
      this.showValidationError(this.username, "Username can not exceed 30 characters.")
    }
    if (!this.username.errors) {
      this.hideValidationError(this.username)
    }
  }

  passwordImmediately() {
    if (this.password.value.length > 50) {
      this.showValidationError(this.password, "Password can not exceed 50 characters.")
    }
    if (!this.password.errors) {
      this.hideValidationError(this.password)
    }
  }
  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidateMessage--visible")
  }

  usernameAfterDelay() {
    if (this.username.value.length < 3) {
      this.showValidationError(this.username, "Username must be at least 3 characters.")
    }

    if (!this.username.errors) {
      axios
        .post("/doesUsernameExist", { _csrf: this._csrf, username: this.username.value })
        .then(response => {
          if (response.data) {
            this.showValidationError(this.username, "Username is taken.")
            this.username.isUnique = false
          } else {
            this.username.isUnique = true
          }
        })
        .catch(() => {
          console.log("Please try again later.")
        })
    }
  }

  passwordAfterDelay() {
    if (this.password.value.length < 12) {
      this.showValidationError(this.password, "Password must be at least 12 characters.")
    }
  }

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message
    el.nextElementSibling.classList.add("liveValidateMessage--visible")
    el.errors = true
  }
}
