import React, { useContext, useState } from 'react';
import { AdvancedOrderButton, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect';
import { DefaultSlider } from '@components/Trade/LeverageSlider';
import { OrderContext } from 'context';
import InputSelects from './Inputs';
import { Tracer } from 'libs';
import { Box, Logo } from '@components/General';
import styled from 'styled-components';
import { defaults } from '@libs/Tracer';
import PostTradeDetails from './PostTradeDetails';
import BigNumber from 'bignumber.js';
import { toApproxCurrency, toPercent } from '@libs/utils';

const Market = styled.div`
    letter-spacing: -0.4px;
    font-size: 20px;
    color: #fff;
    display: flex;
`;

const SLogo = styled(Logo)`
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0.7rem;
`;

const ColouredDiv = styled.div`
    color: ${(props: any) => props.color as string};
`;

type MarketSelectDropdownProps = {
    className?: string;
    display: boolean;
};

const MarketSelectDropdown: React.FC<MarketSelectDropdownProps> = styled(({ className }: MarketSelectDropdownProps) => {
    const tracers = [
        {
            name: 'ETH',
            market: 'ETH-USDC',
            price: 3424.23,
            change: 0.0003,
        },
        {
            name: 'ETH',
            market: 'ETH-USDC',
            price: 3424.23,
            change: 0.0003,
        },
        {
            name: 'ETH',
            market: 'ETH-USDC',
            price: 3424.23,
            change: 0.0003,
        },
    ];

    return (
        <div className={className}>
            {tracers.map((tracer, i) => (
                <div key={`table-row-${i}`} className="flex market">
                    <div className="flex flex-row ml-5 py-2">
                        <div className="my-auto">
                            <Logo ticker={tracer.name} />
                        </div>
                        <div className="my-auto ml-2">{tracer.market}</div>
                    </div>
                    <ColouredDiv className="m-auto py-2" color={tracer.change < 0 ? '#F15025' : '#21DD53'}>
                        {toPercent(tracer.change)}
                    </ColouredDiv>
                    <div className="my-auto mr-8 py-2">{toApproxCurrency(tracer.price)}</div>
                </div>
            ))}
        </div>
    );
})`
    transition: 1s;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #011772;
    z-index: ${(props) => (props.display ? '10' : '-1')};
    opacity: ${(props) => (props.display ? '1' : '0')};

    .market {
        transition: 0.5s;
    }

    .market:hover {
        background: #002886;
        cursor: pointer;
    }
`;

const MarketSelectDropdownButton = styled.div`
    color: #3da8f5;
    font-size: 1rem;
    border: 1px solid #3da8f5;
    border-radius: 20px;
    padding: 5px 0;
    width: 160px;

    &:hover {
        cursor: pointer;
    }

    .down-arrow {
        transition: ${(props: any) => props.theme.transition as string};
        transform: ${(props: any) => props.theme.transform as string};
        margin-top: ${(props: any) => props.theme.marginTop as string};
    }

    &:hover .down-arrow {
        transform: rotate(180deg);
        margin-top: 6px;
    }
`;

const BackgroundColouredDiv = styled.div`
    background-color: ${(props: any) => props.color as string};
`;

export const MarketSelect: React.FC = styled(({ className }) => {
    const [popup, setPopup] = useState(false);
    const ArrowDownTheme = {
        transition: '0.5s',
    };
    const ArrowUpTheme = {
        transition: '0.5s',
        transform: 'rotate(180deg)',
        marginTop: '6px',
    };

    return (
        <BackgroundColouredDiv
            className={className}
            onMouseLeave={() => {
                setPopup(false);
            }}
            color={popup ? '#011772' : '#03065e'}
            style={{ transition: '0.5s' }}
        >
            <Box className="relative">
                <Market>
                    <SLogo ticker="ETH" />
                    <div className="my-auto">ETH-USDC</div>
                </Market>
                <MarketSelectDropdownButton
                    onMouseEnter={() => {
                        setPopup(true);
                    }}
                    theme={popup ? ArrowUpTheme : ArrowDownTheme}
                    className="ml-auto mr-2 px-3"
                >
                    <div className="flex justify-center">
                        <div>View Markets</div>
                        <div>
                            <img
                                className="down-arrow w-4 ml-1"
                                src="/img/general/triangle_down.svg"
                                alt="Down Arrow"
                            />
                        </div>
                    </div>
                </MarketSelectDropdownButton>
                <MarketSelectDropdown display={popup} />
            </Box>
        </BackgroundColouredDiv>
    );
})``;

type TIProps = {
    selectedTracer: Tracer | undefined;
    account: string;
    className?: string;
};

export const TradingInput: React.FC<TIProps> = styled(({ selectedTracer, className }: TIProps) => {
    const { order } = useContext(OrderContext);
    return (
        <Box className={`${className}`}>
            <div className="body text-xs">
                {/* Position select */}
                <div className="py-2">
                    <OrderTypeSelect selected={order?.orderType ?? 0} />
                </div>

                {/* Position select */}
                <div className="py-2">
                    <PositionSelect selected={order?.position ?? 0} />
                </div>

                {/* Quantity and Price Inputs */}
                <InputSelects amount={order?.amountToPay} price={order?.price} selectedTracer={selectedTracer} />

                {/* Dont display these if it is a limit order*/}
                {order?.orderType !== 1 ? (
                    <>
                        {/* Leverage select */}
                        <Leverage leverage={order?.leverage ?? 1} />
                    </>
                ) : (
                    <></>
                )}

                <PostTradeDetails
                    fairPrice={selectedTracer?.oraclePrice ?? defaults.oraclePrice}
                    balances={selectedTracer?.balances ?? defaults.balances}
                    exposure={order?.amountToBuy ? new BigNumber(order.amountToBuy) : defaults.amountToBuy}
                    position={order?.position ?? 0}
                    maxLeverage={selectedTracer?.maxLeverage ?? defaults.maxLeverage}
                />

                {/* Place Order */}
                <div className="py-1">
                    <AdvancedOrderButton />
                </div>
            </div>
        </Box>
    );
})`
    transition: 0.8s;
    overflow: scroll;
    opacity: ${(props) => (props.account === '' ? 0 : 1)};
`;

type SProps = {
    selected: number;
};

const SSlideSelect = styled(SlideSelect)`
    height: 40px;
`;

const PositionSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                // when we go back to market order we need to ensure the price is locked
                if (orderDispatch) {
                    orderDispatch({ type: 'setPosition', value: index });
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>SHORT</Option>
            <Option>LONG</Option>
        </SSlideSelect>
    );
};

const OrderTypeSelect: React.FC<SProps> = ({ selected }: SProps) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <SSlideSelect
            onClick={(index, _e) => {
                if (orderDispatch) {
                    orderDispatch({ type: 'setOrderType', value: index });
                    if (index === 0) {
                        orderDispatch({ type: 'setLock', value: true });
                    }
                } else {
                    console.error('Order dispatch function not set');
                }
            }}
            value={selected}
        >
            <Option>MARKET</Option>
            <Option>LIMIT</Option>
        </SSlideSelect>
    );
};

type LProps = {
    leverage: number;
    className?: string;
};

const Leverage: React.FC<LProps> = styled(({ leverage, className }: LProps) => {
    return (
        <div className={`${className} m-3`}>
            <a className="label">Leverage</a>
            <div className="w-3/4 p-2">
                <DefaultSlider leverage={leverage} />
            </div>
        </div>
    );
})`
    display: flex;

    > .label {
        margin: auto auto 35px 0;
        font-size: 16px;
        letter-spacing: -0.32px;
        color: #3da8f5;
    }
`;

export { AccountPanel } from './Account';
