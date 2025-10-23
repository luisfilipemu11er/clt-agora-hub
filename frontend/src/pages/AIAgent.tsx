import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Sparkles, Shield, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      content: "Olá! Sou a **Celeste**, sua assistente especializada em CLT e legislação trabalhista brasileira. 👋\n\nEstou aqui para ajudar com:\n\n- ✅ Dúvidas sobre direitos trabalhistas\n- 📊 Cálculos de férias, rescisão e 13º salário\n- 📖 Explicações sobre a CLT\n- ⚖️ Orientações sobre processos trabalhistas\n\nComo posso te ajudar hoje?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao comunicar com o servidor.');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error fetching AI response:", error);
      toast({
        title: "Erro de Comunicação",
        description: error.message || "Não foi possível obter uma resposta da IA.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      {/* Premium Header */}
      <div className="relative pt-16 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Celeste Avatar with Glow */}
          <div className="inline-block mb-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 gradient-purple-blue rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-28 h-28 gradient-purple-blue rounded-full flex items-center justify-center shadow-premium-lg p-1 animate-float">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <img
                    src="/celeste.png"
                    alt="Celeste"
                    className="w-24 h-24 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            <span className="gradient-text">Celeste</span>
          </h1>
          <p className="text-lg text-gray-600 font-semibold mb-4 animate-fade-in-delay-2">
            Assistente IA Especializada em CLT
          </p>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-delay-3">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/40">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">100% Confiável</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/40">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">IA Avançada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative flex-1 max-w-6xl mx-auto w-full px-6 pb-6 flex flex-col">
        <div className="glass border-2 border-white/40 rounded-3xl shadow-premium-lg flex-1 flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-8" ref={scrollRef}>
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-fade-in ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* AI Avatar */}
                  {message.sender === "ai" && (
                    <div className="w-12 h-12 gradient-purple-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-premium">
                      <img
                        src="/celeste.png"
                        alt="Celeste"
                        className="w-10 h-10 rounded-xl"
                      />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] rounded-2xl p-6 shadow-lg ${
                      message.sender === "user"
                        ? "gradient-purple-blue text-white"
                        : "bg-white border-2 border-purple-100 text-gray-800"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className={`mb-3 last:mb-0 leading-relaxed ${
                              message.sender === "user" ? "text-white" : "text-gray-800"
                            }`}>
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className={`font-bold ${
                              message.sender === "user" ? "text-white" : "text-gray-900"
                            }`}>
                              {children}
                            </strong>
                          ),
                          li: ({ children }) => (
                            <li className={`mb-1 ${
                              message.sender === "user" ? "text-white" : "text-gray-800"
                            }`}>
                              {children}
                            </li>
                          ),
                          ul: ({ children }) => (
                            <ul className={`mb-3 last:mb-0 space-y-1 ${
                              message.sender === "user" ? "text-white" : "text-gray-800"
                            }`}>
                              {children}
                            </ul>
                          ),
                          h3: ({ children }) => (
                            <h3 className={`text-lg font-bold mb-2 ${
                              message.sender === "user" ? "text-white" : "text-gray-900"
                            }`}>
                              {children}
                            </h3>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <span
                      className={`text-xs mt-3 block font-medium ${
                        message.sender === "user" ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  {/* User Avatar */}
                  {message.sender === "user" && (
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4 justify-start animate-fade-in">
                  <div className="w-12 h-12 gradient-purple-blue rounded-2xl flex items-center justify-center shadow-premium">
                    <img
                      src="/celeste.png"
                      alt="Celeste"
                      className="w-10 h-10 rounded-xl"
                    />
                  </div>
                  <div className="bg-white border-2 border-purple-100 rounded-2xl p-6 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 gradient-purple-blue rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 gradient-purple-blue rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-3 h-3 gradient-purple-blue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t-2 border-purple-100 p-6 bg-white/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              {/* Input Row */}
              <div className="flex gap-3 mb-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Digite sua pergunta sobre CLT, direitos trabalhistas..."
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1 h-14 text-base border-2 border-purple-200 focus:border-purple-400 rounded-2xl px-6 font-medium"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="gradient-purple-blue hover:opacity-90 h-14 px-8 rounded-2xl font-bold shadow-premium hover-lift disabled:opacity-50"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-200">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-blue-700">Importante:</strong> Celeste é baseada em IA e fornece orientações sobre CLT. Para questões complexas ou decisões importantes, sempre consulte um advogado trabalhista ou seu departamento de RH.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
