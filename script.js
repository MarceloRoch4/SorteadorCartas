document.addEventListener('DOMContentLoaded', () => {
    const roulette = document.querySelector('.roulette');
    const spinButton = document.getElementById('spinButton');
    const resultDiv = document.getElementById('result');
    const selectedPhotoCardContainer = document.getElementById('selectedPhotoCardContainer');
    const selectedPhotoCard = document.getElementById('selectedPhotoCard');

    const numberOfCards = 20;
    const cardImages = [];
    for (let i = 1; i <= numberOfCards; i++) {
        cardImages.push(`images/card${i}.png`);
    }

    let spinning = false;

    function createCards() {
        const angleStep = 360 / numberOfCards;
        roulette.innerHTML = '';
        cardImages.forEach((imagePath, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.style.backgroundImage = `url(${imagePath})`;

            const rotation = index * angleStep;
            // Define a variável CSS --card-rotation para cada carta
            card.style.setProperty('--card-rotation', `${rotation}deg`);
            // O translateY é agora definido no CSS para ser responsivo
            // A rotação é aplicada via CSS variável, o translate fixo aqui não é mais necessário
            // O transform será apenas o rotate(var(--card-rotation)) translateY(-Yvmin)
            // que é definido no CSS. Não precisamos de um transform direto aqui que sobreponha o CSS.
            // Para garantir que o JS possa definir a rotação da carta e o CSS aplique o translateY:
            card.style.transform = `rotate(${rotation}deg) translateY(-33vmin)`; // Mantendo para compatibilidade ou teste

            card.dataset.index = index;
            roulette.appendChild(card);
        });
    }

    createCards();

    spinButton.addEventListener('click', () => {
        if (spinning) return;
        spinning = true;
        spinButton.disabled = true;
        resultDiv.textContent = 'Girando...';
        selectedPhotoCardContainer.classList.add('hidden');

        const randomIndex = Math.floor(Math.random() * numberOfCards);
        const degreesPerCard = 360 / numberOfCards;

        const finalRotationValue = -(randomIndex * degreesPerCard);

        const extraSpins = 5;
        const totalDegreesToSpin = (extraSpins * 360) + finalRotationValue;

        roulette.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        roulette.style.transform = `rotate(${totalDegreesToSpin}deg)`;

        roulette.addEventListener('transitionend', () => {
            spinning = false;
            spinButton.disabled = false;

            roulette.style.transition = 'none';
            roulette.style.transform = `rotate(${finalRotationValue}deg)`;

            const selectedCardElement = document.querySelector(`.card[data-index="${randomIndex}"]`);

            if (selectedCardElement) {
                const imageUrl = selectedCardElement.style.backgroundImage;
                const imageUrlPathMatch = imageUrl.match(/url\(['"]?(.*?)['"]?\)/);
                const imageUrlPath = imageUrlPathMatch ? imageUrlPathMatch[1] : '';

                resultDiv.innerHTML = `Você selecionou a carta: <img src="${imageUrlPath}" alt="Carta Selecionada" style="width: 100px; height: auto; vertical-align: middle; margin-left: 10px; border-radius: 5px;">`;

                selectedPhotoCard.src = imageUrlPath;
                selectedPhotoCardContainer.classList.remove('hidden');
            } else {
                resultDiv.textContent = `Erro: Carta não encontrada!`;
                console.error("Erro: Elemento da carta selecionada não encontrado para o índice:", randomIndex);
            }
        }, { once: true });
    });
});