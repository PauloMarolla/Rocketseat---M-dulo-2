import { app } from "./app.js";
import { env } from "./env/index.js";

app.listen({ port: Number(env.PORT) }).then(() => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
