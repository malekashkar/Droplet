export async function getBtcPrice() {
    const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=BTC");
    if (response.status !== 200) return;

    const json = await response.json();
    return Number(json.data.rates.USD);
}
  
export async function usdToBtc(amt: number) {
    const bitcoinPrice = await getBtcPrice();
    return Number((amt / bitcoinPrice).toFixed(8));
}
  
export async function btcToUsd(amt: number) {
    const bitcoinPrice = await getBtcPrice();
    return Number((amt * bitcoinPrice).toFixed(2));
}