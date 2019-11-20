/**
 * 深度合并
 */
import Decimal from 'decimal.js-light';

export default function combineDeep(trades, step) {
  let deep = 0;
  const timedTrades = [];
  let pointer = -1;
  const _trades = trades.filter(t => t[0]);
  for (let i = 0; i < _trades.length; i += 1) {
    const trade = _trades[i];
    const timedTrade = timedTrades[pointer];
    // 0.00015 -> 4位 -> 0.00015 * 10000 -> 1.5 -> 1
    const amount = new Decimal(trade[0]).div(step).toString().split('.')[0];
    if (timedTrade && timedTrade[0] === amount) {
      timedTrade[1] = timedTrade[1].add(new Decimal(trade[1]));
    } else {
      timedTrades.push([
        amount,
        new Decimal(trade[1]),
      ]);
      pointer += 1;
    }
  }
  const ret = timedTrades.map((row) => {
    const amount = row[1].toString();
    const amountFloat = parseFloat(amount);
    deep += amountFloat;
    const price = new Decimal(row[0]).times(step).toString();
    return [
      price,
      amount,
      parseFloat(price * amountFloat),
      deep,
    ];
  });
  return ret;
}

