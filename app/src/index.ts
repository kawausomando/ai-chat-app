import { Hono } from "hono";
import OpenAI from "openai";
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod';

const ChatRequest = z.object({
  message: z.string(),
});

const app = new Hono();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

app.post("/chat", async (c) => {
  // check content-type
  const contentType = c.req.header('content-type');
  if (contentType !== 'application/json') {
    throw new HTTPException(400, { message: 'Content-Type must be application/json'});
  }

  // check body
  const body = await c.req.json();
  const validationResult = ChatRequest.safeParse(body);
  if (!validationResult.success) {
    throw new HTTPException(400, { message: validationResult.error.message });
  }

  // chat
  console.log(`質問: ${validationResult.data.message}`);
  const completion = await openai.chat.completions.create({
    messages: [{
      role: "system",
      content: validationResult.data.message,
    }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0].message.content);
  return c.text(completion.choices[0].message.content ?? '');
});


export default app;
