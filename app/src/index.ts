import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import OpenAI from "openai";

const app = new Hono();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (c) => c.text("Hello Kawauso Mando!"));
app.get("/chat", async (c) => {
  const message = "クリスマスのおすすめの予定を教えてください！";
  const completion = await openai.chat.completions.create({
    messages: [{
      role: "system",
      content: message,
    }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
  return c.text(completion.choices[0].message.content ?? '');
});

export default app;
