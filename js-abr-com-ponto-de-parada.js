
// 👇 Adição ao final do script js.abr (modificações customizadas)
const palavrasChaveParada = ["atendente", "humano", "pessoa", "quero falar com alguém", "ajuda", "não entendi", "explica"];
const chatsBotDesativado = {};
const tempoInatividadeMin = 3;
const ultimasInteracoes = {};

// Monitora novas mensagens e aplica lógica de parada
window.WAPI.waitNewMessages(false, function (mensagens) {
    mensagens.forEach(mensagem => {
        const chatId = mensagem.chatId;
        const texto = mensagem.content?.toLowerCase() || "";

        // Atualiza o tempo da última interação
        ultimasInteracoes[chatId] = Date.now();

        // Se o bot estiver desativado, ignora
        if (chatsBotDesativado[chatId]) return;

        // Verifica se há palavra de parada
        if (palavrasChaveParada.some(p => texto.includes(p))) {
            WAPI.sendMessage2(chatId, "📩 Encaminhando você para um atendente humano...");
            chatsBotDesativado[chatId] = true;
            return;
        }
    });
});

// Verifica inatividade a cada minuto
setInterval(() => {
    const agora = Date.now();
    Object.entries(ultimasInteracoes).forEach(([chatId, timestamp]) => {
        const minutos = (agora - timestamp) / 60000;
        if (minutos >= tempoInatividadeMin && !chatsBotDesativado[chatId]) {
            WAPI.sendMessage2(chatId, "⏳ Você está inativo. Um atendente será acionado para continuar o atendimento.");
            chatsBotDesativado[chatId] = true;
        }
    });
}, 60000);
