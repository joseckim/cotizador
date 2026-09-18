const formulario = document.querySelector('#coin-form');
const coin = document.querySelector('#coin');
const crypto = document.querySelector('#crypto');
const amount = document.querySelector('#amount');
const coinInfo = document.querySelector('#coin-info');

formulario.addEventListener('submit', async e => {
    e.preventDefault();

     // spiner 
    coinInfo.innerHTML = '<div class="spinner"></div>';
    
    // Forma más limpia y directa de obtener el valor del select
    const coinSelected = coin.value;
    const cryptoSelected = crypto.value;
    const amountValue = amount.value;

    // Validación básica para asegurarte de que seleccionaron moneda y cripto
    if (coinSelected === "" || cryptoSelected === "") {
        coinInfo.innerHTML = `<p class="info" style="color: red;">Por favor selecciona una moneda y una criptomoneda.</p>`;
        return;
    }
    
    try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${cryptoSelected}${coinSelected}`);
        const data = await res.json();
        
        // Validar si Binance respondió con un error (ej. par no encontrado)
        if (data.code || data.msg) {
            coinInfo.innerHTML = `<p class="info" style="color: red;">El par ${cryptoSelected}/${coinSelected} no está disponible en Binance.</p>`;
            return;
        }

        const price = Number(data.lastPrice);
        const priceHigh = data.highPrice;
        const priceLow = data.lowPrice;
        const variation = data.priceChangePercent;

        if (amountValue !== '' && !isNaN(amountValue)) {
            const result = Number(amountValue) / price;
            coinInfo.innerHTML = `
                <p class="info">El precio es <span class="price">${price}</span></p>
                <p class="info">El precio mas alto es <span class="price">${priceHigh}</span></p>
                <p class="info">El precio mas bajo es <span class="price">${priceLow}</span></p>
                <p class="info">Variacion 24H <span class="price">${variation}%</span></p>
                <p class="info">Puedes comprar <span class="price">${result.toFixed(6)} ${cryptoSelected}</span></p>
            `;
        } else {
            coinInfo.innerHTML = `
                <p class="info">El precio es <span class="price">${price}</span></p>
                <p class="info">El precio mas alto es <span class="price">${priceHigh}</span></p>
                <p class="info">El precio mas bajo es <span class="price">${priceLow}</span></p>
                <p class="info">Variacion 24H <span class="price">${variation}%</span></p>     
            `;
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        coinInfo.innerHTML = `<p class="info">Hubo un error al consultar la API.</p>`;
    }
});