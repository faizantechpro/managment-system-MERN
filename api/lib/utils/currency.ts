/**
 * All currency number values are represented as a tenth of a cent.
 * This eliminates the need to work with floats and may make conversion easier
 * Functions here provide helper functions to convert cents into currency
 *
 * e.g.: 1 = 0.001 usd = 0.1 cent
 * e.g.: $1.23 will be represented as 1230 (tenths of a cent)
 * e.g.: $1,234.567 will be represented as 1234567
 */

export function toUSD(totalTenthOfCents: number) {
  const dollars = totalTenthOfCents / 1000;

  return toCurrency(dollars, 'USD');
}

function toCurrency(dollars: number, currency: 'USD') {
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency,
  });
}
