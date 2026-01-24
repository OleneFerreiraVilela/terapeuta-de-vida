import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client following strictly the named parameter requirement and direct environment variable usage.
// Always use { apiKey: process.env.API_KEY } for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const sendMessageToTherapist = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    // Select gemini-3-pro-preview for complex reasoning and psychological counseling tasks.
    const modelName = 'gemini-3-pro-preview';
    
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    // sendMessage returns GenerateContentResponse; the text output is accessed via the .text property.
    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "Sinto muito, houve um silêncio na nossa conexão. Pode repetir o que disse?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sinto que há muita energia no momento. Respire fundo. Vamos continuar nossa conversa sobre o que você acredita e sente.";
  }
};
