var bootstrapTheme = localStorage.getItem("theme")

function getPreferredTheme() {
    if (bootstrapTheme) {
        return bootstrapTheme
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function setTheme(theme) {
    if (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-bs-theme", "dark")
    }
    else {
        document.documentElement.setAttribute("data-bs-theme", ((theme == "auto") ? "light" : theme))
    }
}

function showActiveTheme(theme) {
    $("[data-bs-theme-value]").removeClass("bg-primary text-white active")
    $(`[data-bs-theme-value="${theme}"]`).addClass("bg-primary text-white active")
}

$(document).on("click", '[data-bs-theme-value]', function (event) {
    const theme = this.getAttribute("data-bs-theme-value")
    localStorage.setItem("theme", theme)
    setTheme(theme)
    showActiveTheme(theme)
})

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
    if (bootstrapTheme !== "light"
     || bootstrapTheme !== "dark") {
        setTheme(getPreferredTheme())
    }
})

document.addEventListener("DOMContentLoaded", function (event) {
    setTheme(bootstrapTheme)
    showActiveTheme(getPreferredTheme())
})
