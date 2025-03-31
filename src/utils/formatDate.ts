export const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    // Formata a data no fuso de São Paulo (Brasília)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    // O toLocaleString em pt-BR normalmente retorna "dd/mm/yyyy, hh:mm:ss"
    // Removemos a vírgula e dividimos a string.
    const formatted = date.toLocaleString('pt-BR', options).replace(',', '');
    const [datePart, timePart] = formatted.split(' ');
    if (!datePart || !timePart) return '';
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    return `${day}/${month}/${year} - ${hour}:${minute}:${second}`;
  };
  