const codeElt = document.querySelector("#code");
const urlElt = document.querySelector("#url");
const submit = document.querySelector("#submit");
const result = document.querySelector("#result");
const use_custom = document.querySelector("#use_custom");

use_custom.addEventListener("click", () => (codeElt.disabled = !use_custom.checked));
submit.addEventListener("click", async (event) => {
    event.preventDefault();
    const code = codeElt.value;
    const original_url = urlElt.value;

    const data = {};
    if (use_custom.checked) data["code"] = code;
    data["original_url"] = original_url;

    const res = await fetch("/api/create", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (res.ok) {
        const URL = (await res.json()).short_url;
        result.innerHTML = `You can view it at <a href="${URL}" target="_blank">${URL}</a>.`;
    } else {
        const { errors } = await res.json();
        let msg;
        switch (errors.type) {
            case "message":
                msg = errors.message;
                break;
            case "invalid-format":
                msg = "Errors in the following fields:\n";
                for (let key in errors) {
                    if (key !== "type") {
                        msg += `${key}:\n    ${errors[key].join(",\n    ")},\n`;
                    }
                }
                msg = msg.slice(0, -2); // removes last ",\n"
                console.log(errors);
                console.log({ msg });
                break;
            default:
                msg = "Something went wrong";
                break;
        }
        result.innerHTML = msg;
    }
});
