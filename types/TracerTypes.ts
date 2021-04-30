export interface TracerData {
    tracerId?: string;
    matchingFee: number;
    balance: UserBalance;
    oraclePrice: number;
    fundingRate: number;
    marginRatio: number;
}

export type UserBalance = {
    quote: number; // the accounts deposited quote
    base: number; // the position the user is currently in
    totalLeveragedValue: number;
    lastUpdatedGasPrice: number;
    tokenBalance: number;
};

export type FundingRate = {
    recordTime: number;
    recordPrice: number;
    fundingRate: number;
    fundingRateValue: number;
};

export type TracerInfo = {
    balance: UserBalance | undefined;
    quoteTokenBalance: number | undefined;
    fundingRate: number | undefined;
    matchingFee: number;
    tracerquoteToken: string;
    oraclePrice: number;
    priceMultiplier: number;
};
