export default class RegistrationForm {
  constructor() {
    this.allInputs = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.events()
  }

  // Events
  events() {
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler)
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
    this.usernameImmediately()
    clearTimeout(this.username.timer)
    this.username.timer = setTimeout(() => {
      this.usernameAfterDelay()
    }, 3000)
  }

  usernameImmediately() {
    if (this.username.value != "" && !/^([a-z0-9]+)$/i.test(this.username.value)) {
      this.showValidationError(this.username, "Username can only contain letters and numbers.")
    }
  }

  usernameAfterDelay() {}

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message
    el.nextElementSibling.classList.add("liveValidateMessage--visible")
  }
}
