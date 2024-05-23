import axios from "axios";

export default class Search {
  // Properties
  constructor() {
    this.injectHTML();
    this.headerSearchIcon = document.querySelector(".header-search-icon");
    this.overlayToProcess = document.querySelector(".search-overlay");
    this.closeIcon = document.querySelector(".close-live-search");
    this.inputField = document.querySelector("#live-search-field");
    this.resultArea = document.querySelector(".live-search-results");
    this.loaderIcon = document.querySelector(".circle-loader");
    this.typingWaitTimer = 500;
    this.previousValue = "";
    this.eventsListener();
  }

  // Events
  eventsListener() {
    this.closeIcon.addEventListener("click", e => {
      this.closeOverlay();
    });
    this.headerSearchIcon.addEventListener("click", e => {
      e.preventDefault();
      this.openOverlay();
    });
    this.inputField.addEventListener("keyup", () => {
      this.keyPressHandler();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        // Check if the key pressed is 'Escape'
        this.closeOverlay();
      }
    });
  }
  // Methods
  keyPressHandler() {
    let value = this.inputField.value;
    if (value == "") {
      clearTimeout(this.typingWaitTimer);
      this.hideLoaderIcon();
      this.hideResultsArea();
    }
    if (value != "" && value != this.previousValue) {
      clearTimeout(this.typingWaitTimer);
      this.showLoaderIcon();
      this.hideResultsArea();
      this.typingWaitTimer = setTimeout(() => this.sendRequest(), 500);
    }
    this.previousValue = value;
  }

  sendRequest() {
    axios
      .post("/search", { searchTerm: this.inputField.value })
      .then(response => this.renderResultsHTML(response.data))
      .catch(() => {
        alert("error");
      });
  }

  renderResultsHTML(posts) {
    if (posts.length) {
      this.resultArea.innerHTML = `<div class="list-group shadow-sm">
      <div class="list-group-item active"><strong>Search Results</strong> (${posts.length > 1 ? `${posts.length} items found` : `1 item found`})</div>
      ${posts
        .map(post => {
          let postDate = new Date(post.createdDate);
          return `<a href="/post/${post._id}" class="list-group-item list-group-item-action">
        <img class="avatar-tiny" src="${post.author.avatar}"> <strong>${post.title}</strong>
        <span class="text-muted small"> by ${post.author.username} on ${postDate.getMonth() + 1}/${postDate.getDate()}/${postDate.getFullYear()}</span>
      </a>`;
        })
        .join("")}

    </div>`;
    } else {
      this.resultArea.innerHTML = `<p class="alert alert-danger text-center shadow-sm">Sorry, no results were found</p>`;
    }
    this.hideLoaderIcon();
    this.showResultsArea();
  }

  hideLoaderIcon() {
    this.loaderIcon.classList.remove("circle-loader--visible");
  }

  showLoaderIcon() {
    this.loaderIcon.classList.add("circle-loader--visible");
  }

  showResultsArea() {
    this.resultArea.classList.add("live-search-results--visible");
  }

  hideResultsArea() {
    this.resultArea.classList.remove("live-search-results--visible");
  }

  openOverlay() {
    this.overlayToProcess.classList.add("search-overlay--visible");
    setTimeout(() => this.inputField.focus(), 500);
  }

  closeOverlay() {
    this.overlayToProcess.classList.remove("search-overlay--visible");
  }

  injectHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
    <div class="search-overlay">
    <div class="search-overlay-top shadow-sm">
      <div class="container container--narrow">
        <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
        <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
        <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
      </div>
    </div>

    <div class="search-overlay-bottom">
      <div class="container container--narrow py-3">
        <div class="circle-loader"></div>
        <div class="live-search-results"></div>
      </div>
    </div>
  </div>`
    );
  }
}
