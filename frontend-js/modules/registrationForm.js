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
      element.insertAdjacentHTML("afterend", "<div class='alert alert-danger small liveValidateMessage></div>")
    })
  }

  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this)
    }
    el.previousValue = el.value
  }

  usernameHandler() {
    alert("username handler")
  }
}
