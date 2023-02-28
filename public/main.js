const codeElt = document.querySelector("#code");
const urlElt = document.querySelector("#url");
const submit = document.querySelector("#submit");
const result = document.querySelector("#result");

submit.addEventListener("click", async (event) => {
    event.preventDefault();
    const code = codeElt.value;
    const original_url = urlElt.value;
    const body = `{"shortjson": { "code": "${code}", "original_url": "${original_url}" }}`;
    const res = await fetch("/api/create", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json",
        },
    });
    const URL = `${location.href}api/redirect/${code}`;
    if (res.ok) {
        result.innerHTML = `You can view it at <a href="${URL}" target="_blank">${URL}</a>`;
    } else {
        const msg = await res.json();
        result.innerHTML = msg.message;
        if (msg.message.includes("taken")) {
            result.innerHTML += `<br>View it here: <a href="${URL}" target="_blank">${URL}</a>`;
        }
    }
});
