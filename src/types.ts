export interface ApiNewsItem {
  position: number;
  title: string;
  summary: string;
  practical_analysis: string;
  link: string;
  publication_date: string;
  source: string;
  category: string;
}

export interface NewsItem {
  id: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data_publicacao: string;
}