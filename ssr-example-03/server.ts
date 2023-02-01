import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { render } from "./client.js";

const html = await Deno.readTextFile("./client.html");
const dinos = ["Allosaur", "T-Rex", "Deno"];
const router = new Router();

router.get("/client.js", async (context) => {
  await context.send({
    root: Deno.cwd(),
    index: "client.js",
  });
});

router.get("/", (context) => {
  const document = new DOMParser().parseFromString(
    "<!DOCTYPE html>",
    "text/html",
  );
  render(document, { dinos });
  context.response.type = "text/html";
  context.response.body = `${document.body.innerHTML}${html}`;
});

router.get("/data", (context) => {
  context.response.body = dinos;
});

router.post("/add", async (context) => {
  const { value } = await context.request.body({ type: "json" });
  const { item } = await value;
  dinos.push(item);
  context.response.status = 200;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });