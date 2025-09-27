import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, MessageCircle } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export const AIAgent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Olá! Sou seu assistente de IA especializado em legislação trabalhista. Como posso ajudar você hoje?",
      sender: "ai", 
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simular resposta da IA com conhecimento trabalhista
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar resposta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (question: string): Promise<string> => {
    // Simulação de resposta baseada em palavras-chave
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("férias")) {
      return "🏖️ **Sobre Férias (CLT Art. 129-153):**\n\n• **Período**: 30 dias corridos após 12 meses de trabalho\n• **Abono**: Pode converter 1/3 em dinheiro\n• **Pagamento**: Até 2 dias antes do início\n• **Aviso**: Empregador deve comunicar com 30 dias de antecedência\n\nPrecisa de mais detalhes sobre algum aspecto específico?";
    }
    
    if (lowerQuestion.includes("rescisão") || lowerQuestion.includes("demissão")) {
      return "📋 **Sobre Rescisão de Contrato:**\n\n• **Aviso Prévio**: 30 dias + 3 dias por ano trabalhado\n• **13º Salário**: Proporcional aos meses trabalhados\n• **Férias**: Vencidas + proporcionais + 1/3\n• **FGTS**: Saque conforme tipo de rescisão\n• **Seguro Desemprego**: Para demissão sem justa causa\n\nQual tipo de rescisão você gostaria de saber mais?";
    }
    
    if (lowerQuestion.includes("13") || lowerQuestion.includes("décimo")) {
      return "💰 **13º Salário (Lei 4.090/62):**\n\n• **1ª Parcela**: Até 30 de novembro (50% do salário)\n• **2ª Parcela**: Até 20 de dezembro (saldo restante)\n• **Base de Cálculo**: Maior salário do ano\n• **Proporcional**: Para quem não trabalhou o ano todo\n\nNeed mais informações sobre o cálculo?";
    }
    
    if (lowerQuestion.includes("fgts")) {
      return "🏦 **FGTS - Fundo de Garantia:**\n\n• **Depósito**: 8% do salário mensalmente\n• **Saque sem justa causa**: 40% de multa\n• **Saque com justa causa**: Sem direito\n• **Outras hipóteses**: Aposentadoria, compra da casa própria, doenças graves\n\nPrecisa saber sobre alguma situação específica de saque?";
    }
    
    if (lowerQuestion.includes("jornada") || lowerQuestion.includes("hora")) {
      return "⏰ **Jornada de Trabalho (CLT Art. 58-75):**\n\n• **Limite**: 8h diárias, 44h semanais\n• **Hora Extra**: Mínimo 50% de adicional\n• **Intervalo**: 1h a 2h para jornada > 6h\n• **Banco de Horas**: Compensação em até 6 meses\n\nQuer saber sobre algum tipo específico de jornada?";
    }
    
    // Resposta genérica para outras perguntas
    return `📚 **Consulta sobre Legislação Trabalhista:**\n\nSua pergunta: "${question}"\n\nPara uma resposta mais precisa, você pode:\n\n• Consultar a CLT (Consolidação das Leis do Trabalho)\n• Verificar jurisprudências do TST\n• Buscar orientação de um advogado trabalhista\n\n💡 **Dica**: Tente perguntas sobre temas como férias, rescisão, 13º salário, FGTS, jornada de trabalho, etc.`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-elevated">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <Bot className="w-6 h-6" />
            Agente IA Trabalhista
          </h1>
          <p className="text-primary-foreground/80">
            Tire suas dúvidas sobre legislação trabalhista
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Card className="h-[calc(100vh-280px)] shadow-card bg-gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" />
              Chat com IA Especializada
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    {message.sender === "user" && (
                      <div className="w-8 h-8 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border/50 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua pergunta sobre legislação trabalhista..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};