interface StyleCard {
    id: number;
    appId: number;
    // Outras propriedades dos estilos de cartão, se houver
    // Por exemplo: title: string;
}

const getStyleCard = (idApp: number, styleCard: StyleCard[]): StyleCard[] => {
    const filteredStyles = styleCard.filter(style => style.appId === idApp);
    return filteredStyles;
};


export default getStyleCard;