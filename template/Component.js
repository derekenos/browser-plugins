
class Comments extends HTMLSpanElement {
  connectedCallback () {
    const iconUrl = this.getAttribute("icon-url")
    const commentCount = parseInt(this.getAttribute("comment-count"))

    this.style.display = "inline-block"

    this.shadow = this.attachShadow({ mode: "closed" })

    const style = document.createElement("style")
    style.textContent = `
.outer {
  display: inline-block;
  background-image: url("${iconUrl}");
  background-repeat: no-repeat;
  background-size: cover;
  width: 38px;
  height: 38px;
}

.outer > span {
  display: inline-block;
  margin: 7pt;
  color: #fff;
  font-weight: bold;
  font-size: 8pt;
}
    `

    this.shadow.appendChild(style)

    const outer = document.createElement("span")
    outer.classList.add("outer")

    const inner = document.createElement("span")
    inner.textContent = commentCount

    outer.appendChild(inner)
    this.shadow.appendChild(outer)
  }
}

customElements.define("custom-comments", Comments, { extends: "span" })
