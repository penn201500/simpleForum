import axios from "axios"

export default class RegistrationForm {
  constructor() {
    this.allInputs = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.username.previousValue = ""
    this.email = document.querySelector("#email-register")
    this.email.previousValue = ""
    this.events()
  }

  // Events
  events() {
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler)
    })
  }

  // Methods
  insertValidationElements() {
    this.allInputs.forEach(element => {
      element.insertAdjacentHTML("afterend", "<div class='alert alert-danger small liveValidateMessage'></div>")
    })
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

  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "You must provide a valid email address.")
      this.email.errors = true
    }
    if (!this.email.errors) {
      axios.post("/doesEmailExist", { email: this.email.value }).then(response => {
        if (response.data) {
          this.email.isUnique = false
          this.showValidationError(this.email, "That email is already being used.")
        } else {
          this.email.isUnique = true
          this.hideValidationError(this.email)
        }
      }).catch(() => {
        console.log(`Please try again later.`);
      })
    }
  }

  usernameImmediately() {
    if (this.username.value != "" && !/^([a-z0-9]+)$/i.test(this.username.value)) {
      this.showValidationError(this.username, "Username can only contain letters and numbers.")
    }
    if (this.username.value.length > 30) {
      this.showValidationError(this.username, "Username must be less than 30 characters.")
    }
    if (!this.username.errors) {
      this.hideValidationError(this.username)
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
        .post("/doesUsernameExist", { username: this.username.value })
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

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message
    el.nextElementSibling.classList.add("liveValidateMessage--visible")
    el.errors = true
  }
}
