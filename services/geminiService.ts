import { ChatMessage } from "../types";

export const sendMessageToTherapist = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: history.map(h => ({
          role: h.role,
          text: h.text,
        })),
        message: newMessage,
      }),
    });

    const data = await response.json();
    return data.text || "Sinto muito, houve um silêncio na nossa conexão. Pode repetir o que disse?";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Sinto que há muita energia no momento. Respire fundo. Vamos continuar nossa conversa sobre o que você acredita e sente.";
  }
};
