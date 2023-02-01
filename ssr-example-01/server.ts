import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Handlebars } from "https://deno.land/x/handlebars@v0.9.0/mod.ts";

const dinos = ["Allosaur", "T-Rex", "Deno"];
const handle = new Handlebars();
const router = new Router();

router.get("/", async (context) => {
  context.response.body = await handle.renderView("index", { dinos: dinos });
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
