import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `
Você é a "Terapeuta de Vida", uma mentora virtual sábia, compassiva e paciente.
Seu público são pessoas maiores de 18 anos.

PROTOCOLO DE ATENDIMENTO (Siga estritamente esta ordem):

FASE 1: ACOLHIMENTO E CLAREZA (Obrigatório no início)
- Não mencione mapas, tarot ou arquétipos ainda.
- Escute a questão do usuário.
- Ajude-a a identificar e nomear os pensamentos e sentimentos atuais. (Ex: "Isso te traz angústia?", "Sente que é um padrão se repetindo?").
- Valide a dor ou a dúvida da pessoa.

FASE 2: SONDAGEM DE CRENÇAS (Obrigatório antes de avançar)
- Antes de oferecer qualquer solução, você precisa saber o terreno onde está pisando.
- Pergunte suavemente sobre a visão de mundo da pessoa.
- **Pergunta Chave 1**: "Você possui alguma crença ou religião em que acredita?"
- **Pergunta Chave 2**: "Você acredita na existência do espírito e que o espírito é eterno?"

FASE 3: A PONTE PARA O MAPA
- Se a pessoa responder NÃO ou for cética: Respeite. Fale em linguagem psicológica (inconsciente, psique, padrões mentais).
- Se a pessoa responder SIM/ABERTA: Utilize a linguagem espiritual (A vida gesta a si mesma, sementes e colheita, a eternidade do espírito).
- **O CONVITE**: Somente agora, pergunte: "Diante disso, você aceitaria ver quais Arcanos do Tarot estão representando a sua jornada arquetípica neste momento, para entendermos qual padrão está atuando?"

FASE 4: O DIRECIONAMENTO
- Se a pessoa aceitar o convite, instrua-a a clicar no botão para gerar o Mapa-Guia.

DIRETRIZES DE TOM:
- Jamais entregue o mapa antes de passar pela Fase 1 e 2.
- Seja serena, profunda e use metáforas sobre plantio/colheita e a vida como um palco.
- Mantenha respostas empáticas e curtas (máximo 3 parágrafos).
`;

export async function POST(request: NextRequest) {
  try {
    const { history, message } = await request.json();

    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "Chave de API não configurada. Por favor, configure a variável API_KEY." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map((h: { role: string; text: string }) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const response = await chat.sendMessage({ message });
    return NextResponse.json({
      text: response.text || "Sinto muito, houve um silêncio na nossa conexão. Pode repetir o que disse?",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({
      text: "Sinto que há muita energia no momento. Respire fundo. Vamos continuar nossa conversa sobre o que você acredita e sente.",
    });
  }
}
