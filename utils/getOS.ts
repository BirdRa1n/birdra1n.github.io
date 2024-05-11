export function detectOS() {
    if (typeof window === 'undefined') {
      // Se não estiver no navegador, retorna 'Unknown'
      return 'Unknown';
    }
    
    const userAgent = window.navigator.userAgent;
  
    if (userAgent.match(/Android/i)) {
      return 'Android';
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
      return 'iOS';
    } else if (userAgent.match(/Windows/i)) {
      return 'Windows';
    } else if (userAgent.match(/Mac/i)) {
      return 'MacOS';
    } else if (userAgent.match(/Linux/i)) {
      return 'Linux';
    } else {
      return 'Unknown';
    }
  }
  