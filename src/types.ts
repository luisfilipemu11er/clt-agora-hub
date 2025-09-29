export interface ApiNewsItem {
  title: string;
  link: string;
  date: string;
  source: string;
  category: string;
  importance_score: number;
}

export interface NewsItem {
  id: string;
  titulo: string;
  link: string;
  source: string;
  categoria: string;
  data_publicacao: string;
  importance_score: number;
}