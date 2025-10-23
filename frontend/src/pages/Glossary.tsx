import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";

export const glossaryTerms = [
  {
    term: "Abono Pecuniário",
    definition: "Conversão de 1/3 das férias em dinheiro, permitida pela CLT.",
    example: "Funcionário com 30 dias de férias pode vender 10 dias e gozar 20 dias."
  },
  {
    term: "Acidente de Trabalho",
    definition: "Ocorrência imprevista que acontece durante o exercício do trabalho e resulta em lesão corporal ou perturbação funcional que cause morte, perda ou redução da capacidade para o trabalho.",
    example: "Funcionário que sofre queda de andaime na obra tem direito ao auxílio-doença acidentário e estabilidade de 12 meses após o retorno."
  },
  {
    term: "Acordo Coletivo",
    definition: "Negociação entre o sindicato dos trabalhadores e uma ou mais empresas, estabelecendo condições específicas de trabalho.",
    example: "Empresa negocia diretamente com o sindicato aumento salarial de 5% para seus funcionários."
  },
  {
    term: "Adicional de Insalubridade",
    definition: "Acréscimo salarial de 10%, 20% ou 40% para trabalhadores expostos a agentes nocivos à saúde, calculado sobre o salário mínimo.",
    example: "Enfermeiro exposto a agentes biológicos recebe adicional de 40% sobre o salário mínimo."
  },
  {
    term: "Adicional de Periculosidade",
    definition: "Acréscimo de 30% sobre o salário base para trabalhadores expostos a atividades perigosas (explosivos, inflamáveis, energia elétrica, segurança patrimonial).",
    example: "Frentista de posto de gasolina recebe adicional de 30% sobre seu salário base."
  },
  {
    term: "Adicional Noturno",
    definition: "Acréscimo de, no mínimo, 20% sobre o valor da hora normal para trabalhadores que atuam no período noturno (entre 22h e 5h).",
    example: "Se a hora normal é R$ 10, a hora noturna será de no mínimo R$ 12."
  },
  {
    term: "Atestado Médico",
    definition: "Documento que comprova a necessidade de afastamento do trabalho por motivos de saúde.",
    example: "Funcionário com gripe apresenta atestado médico de 2 dias e tem as faltas justificadas."
  },
  {
    term: "Auxílio-Acidente",
    definition: "Benefício pago pelo INSS ao trabalhador que sofreu acidente e ficou com sequelas que reduzem sua capacidade de trabalho.",
    example: "Trabalhador que perdeu parte da mobilidade da mão em acidente recebe 50% do salário de benefício mensalmente."
  },
  {
    term: "Auxílio-Doença",
    definition: "Benefício concedido pelo INSS ao trabalhador incapaz de trabalhar temporariamente por doença ou acidente.",
    example: "Funcionário afastado por hérnia de disco recebe auxílio-doença do INSS após 15 dias de afastamento."
  },
  {
    term: "Aviso Prévio",
    definition: "Comunicação antecipada do término do contrato de trabalho.",
    example: "Empregador deve comunicar com 30 dias de antecedência ou pagar o período."
  },
  {
    term: "Aviso Prévio Indenizado",
    definition: "Pagamento do valor correspondente ao aviso prévio quando o empregador dispensa o funcionário imediatamente.",
    example: "Empresa paga 30 dias de salário ao funcionário que é dispensado sem trabalhar o aviso prévio."
  },
  {
    term: "Banco de Horas",
    definition: "Acordo que flexibiliza a jornada de trabalho, permitindo que as horas extras trabalhadas sejam compensadas com folgas.",
    example: "Funcionário que trabalhou 2 horas a mais na segunda-feira pode sair 2 horas mais cedo na sexta-feira."
  },
  {
    term: "CAGED",
    definition: "Cadastro Geral de Empregados e Desempregados, substituído pelo eSocial, era usado para controlar admissões e demissões.",
    example: "Empresas enviavam o CAGED mensalmente até ser integrado ao eSocial em 2020."
  },
  {
    term: "CIPA",
    definition: "Comissão Interna de Prevenção de Acidentes e de Assédio, responsável por zelar pela segurança e saúde no trabalho.",
    example: "A CIPA realiza inspeções de segurança e promove a Semana Interna de Prevenção de Acidentes do Trabalho (SIPAT)."
  },
  {
    term: "CLT",
    definition: "Consolidação das Leis do Trabalho - principal legislação trabalhista brasileira.",
    example: "Decreto-Lei nº 5.452 de 1943, que regulamenta as relações de trabalho."
  },
  {
    term: "Contribuição Sindical",
    definition: "Desconto facultativo em favor do sindicato da categoria, que só pode ser feito com autorização prévia e expressa do trabalhador.",
    example: "Trabalhador autoriza desconto de um dia de salário por ano para o sindicato."
  },
  {
    term: "Convenção Coletiva de Trabalho",
    definition: "Acordo entre sindicatos de trabalhadores e de empregadores que estabelece as condições de trabalho para uma determinada categoria profissional.",
    example: "A convenção dos bancários define o piso salarial e o valor do vale-refeição para todos os bancários do país."
  },
  {
    term: "CTPS",
    definition: "Carteira de Trabalho e Previdência Social, documento que registra a vida profissional do trabalhador (hoje em formato digital).",
    example: "O empregador deve assinar a CTPS Digital do funcionário em até 5 dias úteis após a admissão."
  },
  {
    term: "Décimo Terceiro Salário",
    definition: "Gratificação natalina correspondente a 1/12 da remuneração por mês trabalhado, paga em duas parcelas (novembro e dezembro).",
    example: "Funcionário que trabalhou o ano todo recebe o equivalente a um salário extra em dezembro."
  },
  {
    term: "Demissão por Justa Causa",
    definition: "Rescisão do contrato de trabalho motivada por falta grave cometida pelo empregado, sem direito a aviso prévio, multa do FGTS e seguro-desemprego.",
    example: "Funcionário demitido por justa causa após furto no local de trabalho não recebe multa de 40% do FGTS."
  },
  {
    term: "Demissão sem Justa Causa",
    definition: "Rescisão do contrato de trabalho por iniciativa do empregador sem motivo grave, com direito a todas as verbas rescisórias.",
    example: "Funcionário demitido sem justa causa recebe aviso prévio, férias proporcionais, 13º proporcional, multa de 40% do FGTS e pode sacar o FGTS."
  },
  {
    term: "Descanso Semanal Remunerado (DSR)",
    definition: "Direito a 24 horas consecutivas de descanso, preferencialmente aos domingos, sem desconto salarial.",
    example: "Funcionário que trabalha de segunda a sábado tem direito ao domingo remunerado."
  },
  {
    term: "Dissídio Coletivo",
    definition: "Ação judicial movida pelos sindicatos quando não há acordo nas negociações coletivas, onde a Justiça do Trabalho determina as condições de trabalho.",
    example: "Sindicato dos bancários entra com dissídio coletivo pedindo 10% de aumento salarial."
  },
  {
    term: "eSocial",
    definition: "Sistema de escrituração digital das obrigações fiscais, previdenciárias e trabalhistas, unificando o envio de informações pelo empregador.",
    example: "Empresa envia folha de pagamento, admissões e afastamentos pelo portal do eSocial."
  },
  {
    term: "Estabilidade Gestante",
    definition: "Garantia de emprego à mulher desde a confirmação da gravidez até 5 meses após o parto.",
    example: "Gestante não pode ser demitida sem justa causa desde a concepção até o bebê completar 5 meses."
  },
  {
    term: "Estabilidade Pré-Aposentadoria",
    definition: "Proteção contra demissão sem justa causa para trabalhadores próximos à aposentadoria, quando prevista em acordo ou convenção coletiva.",
    example: "Convenção coletiva garante estabilidade para funcionários a 2 anos da aposentadoria."
  },
  {
    term: "Exame Admissional",
    definition: "Avaliação médica obrigatória antes da contratação para verificar se o candidato está apto para a função.",
    example: "Candidato aprovado no processo seletivo realiza exame admissional antes de assinar contrato."
  },
  {
    term: "Exame Demissional",
    definition: "Avaliação médica obrigatória no desligamento do funcionário para verificar suas condições de saúde.",
    example: "Funcionário demitido realiza exame demissional para comprovar que não adquiriu doença ocupacional."
  },
  {
    term: "Férias",
    definition: "Período anual de 30 dias de descanso remunerado, após 12 meses de trabalho (período aquisitivo), acrescido de 1/3 constitucional.",
    example: "Funcionário admitido em janeiro/2024 tem direito a 30 dias de férias a partir de janeiro/2025."
  },
  {
    term: "Férias Coletivas",
    definition: "Concessão de férias simultâneas a todos os empregados de uma empresa ou setor, em até 2 períodos anuais.",
    example: "Fábrica concede férias coletivas de 15 dias em dezembro e 15 dias em julho para todos os funcionários."
  },
  {
    term: "Férias Proporcionais",
    definition: "Pagamento proporcional de férias quando há rescisão do contrato antes de completar o período aquisitivo.",
    example: "Funcionário que trabalhou 6 meses recebe 15 dias de férias proporcionais na rescisão."
  },
  {
    term: "FGTS",
    definition: "Fundo de Garantia do Tempo de Serviço, depósito mensal de 8% do salário em conta vinculada ao trabalhador.",
    example: "Funcionário com salário de R$ 3.000 tem R$ 240 depositados mensalmente pelo empregador no FGTS."
  },
  {
    term: "Horas Extras",
    definition: "Horas trabalhadas além da jornada normal, com acréscimo mínimo de 50% nos dias úteis e 100% em domingos e feriados.",
    example: "Funcionário que trabalha 2 horas além das 8h diárias recebe essas horas com adicional de 50%."
  },
  {
    term: "Hora Noturna Reduzida",
    definition: "No período noturno (22h às 5h), cada hora tem 52 minutos e 30 segundos para cálculo de pagamento.",
    example: "Trabalhador que trabalha 7 horas no período noturno recebe como se tivesse trabalhado 8 horas."
  },
  {
    term: "INSS",
    definition: "Instituto Nacional do Seguro Social, responsável pelo pagamento de aposentadorias e benefícios previdenciários.",
    example: "Desconto de 8% a 14% do salário do trabalhador é recolhido mensalmente ao INSS."
  },
  {
    term: "Intervalo Intrajornada",
    definition: "Pausa obrigatória para repouso e alimentação durante a jornada de trabalho (mínimo de 1 hora para jornadas superiores a 6 horas).",
    example: "Funcionário que trabalha 8 horas tem direito a no mínimo 1 hora de intervalo para almoço."
  },
  {
    term: "IRRF",
    definition: "Imposto de Renda Retido na Fonte, desconto progressivo sobre o salário conforme faixas de tributação.",
    example: "Funcionário com salário de R$ 5.000 tem desconto de IRRF conforme tabela progressiva do IR."
  },
  {
    term: "Jornada de Trabalho",
    definition: "Período diário ou semanal em que o empregado fica à disposição do empregador, limitado a 8 horas diárias e 44 semanais.",
    example: "Funcionário trabalha 8 horas por dia, de segunda a sexta, e 4 horas no sábado, totalizando 44 horas semanais."
  },
  {
    term: "Licença-Maternidade",
    definition: "Afastamento remunerado de 120 dias (podendo ser prorrogado para 180 em empresas do Programa Empresa Cidadã) concedido à gestante.",
    example: "Funcionária grávida se afasta 28 dias antes do parto e retorna 120 dias após o nascimento do bebê."
  },
  {
    term: "Licença-Paternidade",
    definition: "Afastamento remunerado de 5 dias corridos (podendo ser estendido para 20 dias em empresas do Programa Empresa Cidadã) concedido ao pai.",
    example: "Funcionário pai tem direito a 5 dias de licença após o nascimento do filho."
  },
  {
    term: "Multa Rescisória",
    definition: "Multa de 40% sobre o saldo do FGTS paga pelo empregador na demissão sem justa causa.",
    example: "Funcionário com R$ 10.000 de FGTS recebe R$ 4.000 de multa rescisória ao ser demitido sem justa causa."
  },
  {
    term: "Piso Salarial",
    definition: "Menor remuneração permitida para determinada categoria profissional, estabelecida por lei ou convenção coletiva.",
    example: "Piso salarial dos professores de São Paulo é definido por lei estadual e não pode ser menor que o valor estipulado."
  },
  {
    term: "PPP",
    definition: "Perfil Profissiográfico Previdenciário, documento que registra condições de trabalho e exposição a agentes nocivos.",
    example: "Trabalhador solicita PPP na rescisão para comprovar tempo de atividade especial no INSS."
  },
  {
    term: "RAIS",
    definition: "Relação Anual de Informações Sociais, declaração anual obrigatória sobre vínculos trabalhistas.",
    example: "Empresa envia RAIS até março informando todos os funcionários ativos e desligados do ano anterior."
  },
  {
    term: "Rescisão Indireta",
    definition: "Modalidade de rescisão por iniciativa do empregado devido a falta grave cometida pelo empregador, com os mesmos direitos da demissão sem justa causa.",
    example: "Funcionário pede rescisão indireta por não receber salários há 3 meses e tem direito a todas as verbas rescisórias."
  },
  {
    term: "Salário-Família",
    definition: "Benefício pago pelo INSS aos trabalhadores de baixa renda com filhos de até 14 anos ou inválidos de qualquer idade.",
    example: "Trabalhador com salário de R$ 1.800 e dois filhos menores recebe salário-família proporcional."
  },
  {
    term: "Salário In Natura",
    definition: "Parcela da remuneração paga em bens ou serviços (alimentação, habitação, vestuário), limitada a 70% do salário.",
    example: "Caseiro que recebe moradia como parte do pagamento tem salário in natura."
  },
  {
    term: "Seguro-Desemprego",
    definition: "Benefício temporário concedido ao trabalhador desempregado sem justa causa, pago de 3 a 5 parcelas conforme tempo de trabalho.",
    example: "Funcionário demitido após 2 anos de trabalho recebe 4 parcelas de seguro-desemprego."
  },
  {
    term: "SESMT",
    definition: "Serviço Especializado em Engenharia de Segurança e em Medicina do Trabalho, equipe obrigatória em empresas com mais de 50 funcionários.",
    example: "Empresa com 200 funcionários mantém SESMT com médico do trabalho e técnico de segurança."
  },
  {
    term: "Sobreaviso",
    definition: "Período em que o trabalhador permanece em sua residência aguardando chamado para o trabalho, recebendo 1/3 do salário por hora.",
    example: "Técnico de TI em sobreaviso no fim de semana recebe 1/3 da hora normal por cada hora de disponibilidade."
  },
  {
    term: "Trabalho Intermitente",
    definition: "Modalidade de contrato onde o trabalho é prestado com subordinação, mas não é contínuo, com alternância de períodos de prestação de serviços e inatividade.",
    example: "Garçom contratado para trabalhar apenas em eventos específicos da empresa."
  },
  {
    term: "Vale-Transporte",
    definition: "Benefício obrigatório para custear despesas de deslocamento residência-trabalho-residência, com desconto máximo de 6% do salário.",
    example: "Funcionário recebe vale-transporte para ônibus e metrô, com desconto de até 6% do salário."
  }
];

export const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredTerms = glossaryTerms.filter(item => {
    const matchesSearch = searchTerm === "" ||
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLetter = selectedLetter === null ||
      item.term.charAt(0).toUpperCase() === selectedLetter;

    return matchesSearch && matchesLetter;
  });

  const availableLetters = new Set(
    glossaryTerms.map(item => item.term.charAt(0).toUpperCase())
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 mesh-gradient opacity-30 pointer-events-none" />

      {/* Premium Header */}
      <div className="relative pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-block mb-6 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 gradient-pink-purple rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
              <div className="relative w-24 h-24 gradient-pink-purple rounded-3xl flex items-center justify-center shadow-premium-lg animate-float">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold mb-3 animate-fade-in-delay-1">
            Glossário <span className="gradient-text">Trabalhista</span>
          </h1>
          <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay-2 max-w-2xl mx-auto">
            Dicionário completo com termos e explicações da legislação trabalhista
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pb-16">
        {/* Search Card */}
        <Card className="glass border-2 border-white/40 shadow-premium-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
              <Input
                placeholder="Buscar termos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-16 text-lg font-semibold border-2 border-pink-200 focus:border-pink-400 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Alphabet Filter */}
        <Card className="glass border-2 border-white/40 shadow-premium-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedLetter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(null)}
                className={`h-12 px-6 rounded-xl font-bold ${selectedLetter === null ? "gradient-pink-purple text-white hover:opacity-90" : "border-2 hover-lift"}`}
              >
                Todas
              </Button>
              {alphabet.map(letter => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  disabled={!availableLetters.has(letter)}
                  className={`w-12 h-12 p-0 rounded-xl font-bold ${selectedLetter === letter ? "gradient-pink-purple text-white hover:opacity-90" : "border-2 hover-lift"} disabled:opacity-30`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms List */}
        <div className="space-y-6">
          {filteredTerms.map((item, index) => (
            <Card key={index} className="glass border-2 border-white/40 shadow-premium hover-lift transition-premium animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <CardContent className="p-8">
                <h3 className="text-2xl font-extrabold mb-4 gradient-text">
                  {item.term}
                </h3>

                <div className="mb-5">
                  <h4 className="font-bold mb-3 text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-pink-600 rounded-full"></span>
                    Definição
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {item.definition}
                  </p>
                </div>

                <div className="glass border-2 border-yellow-200 bg-yellow-50/50 rounded-2xl p-5">
                  <h4 className="font-bold mb-3 text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    Exemplo Prático
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {item.example}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg font-semibold mb-2">
              Nenhum termo encontrado
            </p>
            <p className="text-gray-500">
              Tente buscar por outro termo ou letra
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
