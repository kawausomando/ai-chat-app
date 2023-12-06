import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";

const claudeInstantSchema = z.object({
  prompt: z.string(),
  max_tokens_to_sample: z.number().int().positive(),
  temperature: z.number().min(0).max(1),
  top_k: z.number().int().positive(),
  top_p: z.number().min(0).max(1),
  stop_sequences: z.array(z.string()),
});

const app = new Hono();

const betrockClient = new BedrockRuntimeClient({
  region: "ap-northeast-1",
});

app.get("/", (c) => c.text("Hello Kawauso Mando!"));
app.get("/chat", async (c) => {
  const message = "クリスマスのおすすめの予定を教えてください！";
  const params = {
    modelId: "anthropic.claude-instant-v1",
    body: message,
    contentType: "application/json",
  }
  const command = new InvokeModelCommand(params);
  const response = await betrockClient.send(command);
  return c.text(JSON.parse(Buffer.from(response.body).toString("utf-8")).completion);
});

export default app;
