import BigNumber from 'bignumber.js'

const formatDecimals = (result: string) => {
  const [integerValue, floatValue] = result.split('.')

  return new BigNumber(floatValue).isZero() ? integerValue : result
}

export const bignumberUtils = {
  fromCall: (amount: string | number, decimals: number) =>
    new BigNumber(amount || 0)
      .div(new BigNumber(10).pow(decimals))
      .toString(10),

  toSend: (amount: string | number, decimals: number) =>
    new BigNumber(amount || 0)
      .multipliedBy(new BigNumber(10).pow(decimals))
      .toString(10),

  format: (amount?: string | number | null, decimal = 2) => {
    const result = new BigNumber(amount || 0)

    if (result.isInteger()) return result.toFormat(0)

    if (result.lt(10)) return formatDecimals(result.toFormat(decimal))

    if (result.lt(10000)) return formatDecimals(result.toFormat(decimal))

    if (result.lt(100000)) return formatDecimals(result.toFormat(decimal))

    if (result.lt(1000000)) return formatDecimals(result.toFormat(decimal))

    if (result.isGreaterThanOrEqualTo(1000000000))
      return `${formatDecimals(result.div(1000000000).toFormat(decimal))}B`

    return `${formatDecimals(result.div(1000000).toFormat(decimal))}M`
  },

  getPercentage: (
    count?: string | number | null,
    total?: string | number | null
  ) => {
    const percentageBN = new BigNumber(count ?? 0)
      .div(total ?? 1)
      .multipliedBy(100)

    return percentageBN.isFinite() ? percentageBN.integerValue().toNumber() : 0
  },

  total: (...numbers: Array<string | number | null>) =>
    numbers
      .reduce((acc, num) => acc.plus(num ?? 0), new BigNumber(0))
      .toString(10),

  estimateGas: <T extends { toString: () => string }>(
    value: T,
    options?: {
      gasSlippage?: number
    }
  ) =>
    new BigNumber(value.toString())
      .multipliedBy(options?.gasSlippage || 1.2)
      .toFixed(0),

  gte: (num1?: string | number | null, num2?: string | number | null) =>
    new BigNumber(num1 || 0).isGreaterThanOrEqualTo(num2 || 0),

  gt: (num1?: string | number | null, num2?: string | number | null) =>
    new BigNumber(num1 || 0).isGreaterThan(num2 || 0),

  eq: (num1?: string | number | null, num2?: string | number | null) =>
    new BigNumber(num1 || 0).isEqualTo(num2 || 0),

  plus: (num1?: string | number | null, num2?: string | number | null) =>
    new BigNumber(num1 || 0).plus(new BigNumber(num2 || 0)).toString(10),
}
