import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const urlLogin = "https://apisbk.sbk.com.br/gtw/lumia/api/auth/sign-in/email";
const urlProcessos = "https://apisbk.sbk.com.br/gtw/lumia/api/processos";

app.get("/api/token", async (req, res) => {
  try {
    const response = await fetch(urlLogin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "gacademyoficial@gmail.com",
        password: "G@briel200807313"
      })
    });

    const dados = await response.json();
    const token = dados.token;
    return res.json({ token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao gerar token" });
  }
});

app.post("/api/processos", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const response = await fetch(urlProcessos, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar processos" });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { mensagem } = req.body;
    if (!mensagem) return res.status(400).json({ erro: "Mensagem é obrigatória" });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um assistente útil e objetivo." },
        { role: "user", content: mensagem }
      ]
    });

    res.json({ resposta: response.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao chamar a API do ChatGPT" });
  }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
