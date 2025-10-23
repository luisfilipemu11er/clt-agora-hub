export interface ApiNewsItem {
  title: string;
  link: string;
  date: string;
  source: string;
  category: string;
  content: string;
  importance_score: number;
  news_of_the_day?: boolean;
  ai_justification?: string;
}

export interface NewsItem {
  id: string;
  titulo: string;
  link: string;
  source: string;
  categoria: string;
  conteudo: string;
  data_publicacao: string;
  importance_score: number;
  news_of_the_day?: boolean;
  ai_justification?: string;
}

export interface NewsAPIResponse {
  success: boolean;
  count: number;
  articles: ApiNewsItem[];
  news_of_the_day?: ApiNewsItem;
}