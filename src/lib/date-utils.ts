export const parseDate = (dateString: string): Date | null => {
  try {
    // Try to parse ISO 8601 format (from Mundo RH and trabalhista.blog)
    if (dateString.includes('T')) {
      return new Date(dateString);
    }

    // Try to parse RFC 822 format (from Contábeis RSS)
    if (dateString.includes(',')) {
      return new Date(dateString);
    }

    // Try to parse DD/MM/YYYY format (from Guia Trabalhista)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day);
    }
    
    // Try to parse "Hoje HH:mm" and "Ontem HH:mm"
    if (dateString.includes('Hoje')) {
        const time = dateString.replace('Hoje', '').trim();
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    if (dateString.includes('Ontem')) {
        const time = dateString.replace('Ontem', '').trim();
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setDate(date.getDate() - 1);
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    return null;
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
};