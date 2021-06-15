import React from 'react';
import SmallInput from '@components/General/Input/SmallInput';
import { Tracer } from 'libs';
import { LIMIT, OrderAction } from '@context/OrderContext';
import DefaultSlider from '@components/Slider';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { defaults } from '@libs/Tracer';
import { AmountTip, LeverageTip, PriceTip } from '@components/Tooltips';

export const Exposure: React.FC<{
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    exposure: number;
    className?: string;
}> = ({ selectedTracer, orderDispatch, exposure, className }) => {
    const tracerId = selectedTracer?.marketId ?? '';
    return (
        <>
            <SmallInput
                title={'Amount'}
                className={className ?? ''}
                onChange={(e) => {
                    orderDispatch
                        ? orderDispatch({ type: 'setExposure', value: parseFloat(e.target.value) })
                        : console.error('No dispatch function set');
                }}
                setMax={(e) => {
                    e.preventDefault();
                    orderDispatch
                        ? orderDispatch({ type: 'setMaxExposure' })
                        : console.error('No dispatch function set');
                }}
                unit={tracerId.split('/')[0]}
                amount={exposure}
            />
            <AmountTip base={tracerId.split('/')[0]} />
        </>
    );
};

export const Price: React.FC<{
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    selectedTracer: Tracer | undefined;
    price: number;
    className?: string;
}> = ({ selectedTracer, orderDispatch, price, className }) => {
    const tracerId = selectedTracer?.marketId ?? '';
    return (
        <>
            <SmallInput
                title={'Price'}
                className={className ?? ''}
                onChange={(e) => {
                    if (orderDispatch) {
                        orderDispatch({ type: 'setPrice', value: parseFloat(e.target.value) });
                        orderDispatch({ type: 'setOrderType', value: LIMIT });
                    } else {
                        console.error('No dispatch function set');
                    }
                }}
                unit={tracerId.split('/')[1]}
                amount={price}
            />
            <PriceTip base={tracerId.split('/')[0]} />
        </>
    );
};

type LProps = {
    leverage: number;
    className?: string;
    min?: BigNumber;
    max?: BigNumber;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
};

export const Leverage: React.FC<LProps> = styled(({ leverage, orderDispatch, className, min, max }: LProps) => {
    console.log(min?.toNumber(), 'min');
    console.log(max?.toNumber(), 'max');
    return (
        <div className={`${className} m-3`}>
            <a className="label" data-tip="" data-for="leverage">
                Leverage
            </a>
            <div className="w-3/4 pl-4 pr-6 pb-4 mt-2">
                <DefaultSlider
                    min={Math.ceil(min?.toNumber() ?? 1) ?? 1}
                    max={max?.toNumber() ?? defaults.maxLeverage.toNumber()}
                    value={leverage}
                    handleChange={(num) => {
                        orderDispatch
                            ? orderDispatch({ type: 'setLeverage', value: num })
                            : console.error('Order dispatch not set');
                    }}
                />
            </div>
            <LeverageTip />
        </div>
    );
})`
    display: flex;

    > .label {
        margin: 5px auto 35px 0;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
    }
`;
