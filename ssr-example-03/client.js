let isFirstRender = true;

// Simple HTML sanitization to prevent XSS vulnerabilities.
function sanitizeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function render(document, dinos) {
  if (isFirstRender) {
    const jsonResponse = await fetch("http://localhost:8000/data");
    if (jsonResponse.ok) {
      const jsonData = await jsonResponse.json();
      const dinos = jsonData;
      let html = "<html><ul>";
      for (const item of dinos) {
        html += `<li>${sanitizeHtml(item)}</li>`;
      }
      html += "</ul><input>";
      html += "<button>Add</button></html>";
      document.body.innerHTML = html;
      isFirstRender = false;
    } else {
      document.body.innerHTML = "<html><p>Something went wrong.</p></html>";
    }
  } else {
    let html = "<ul>";
    for (const item of dinos) {
      html += `<li>${sanitizeHtml(item)}</li>`;
    }
    html += "</ul>";
    document.querySelector("ul").outerHTML = html;
  }
}

export function addEventListeners() {
  document.querySelector("button").addEventListener("click", async () => {
    const item = document.querySelector("input").value;
    const dinos = Array.from(document.querySelectorAll("li"), e => e.innerText);
    dinos.push(item);
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item }),
    });
    if (response.ok) {
      render(document, dinos);
    } else {
      // In a real app, you'd want better error handling.
      console.error("Something went wrong.");
    }
  });
}
