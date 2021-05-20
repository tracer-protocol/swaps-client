import React, { useContext, useEffect, useReducer } from 'react';
import { FactoryContext } from './FactoryContext';
import { Children, Result, UserBalance } from 'types';
import { isEmpty } from 'lodash';
import { createBook, createOrder } from '@libs/Ome';
import { Web3Context } from './Web3Context';
import { OrderState } from './OrderContext';
import Web3 from 'web3';
import { signOrders, orderToOMEOrder, OrderData } from '@tracer-protocol/tracer-utils';
import Tracer from '@libs/Tracer';

interface ContextProps {
    tracerId: string | undefined;
    setTracerId: (tracerId: string) => any;
    selectedTracer: Tracer | undefined;
    balance: UserBalance;
    placeOrder: (order: OrderState) => Promise<Result | undefined>;
}

export const TracerContext = React.createContext<Partial<ContextProps>>({});

type TracerState = {
    selectedTracer: Tracer | undefined;
    balance: UserBalance;
};

type StoreProps = {
    tracer?: string;
} & Children;

export const SelectedTracerStore: React.FC<StoreProps> = ({ tracer, children }: StoreProps) => {
    const { account, web3, config } = useContext(Web3Context);
    const { tracers } = useContext(FactoryContext);
    const initialState: TracerState = {
        selectedTracer: undefined,
        balance: {
            quote: 0,
            base: 0,
            totalLeveragedValue: 0,
            lastUpdatedGasPrice: 0,
            tokenBalance: 0,
        },
    };

    const reducer = (state: TracerState, action: Record<string, any>) => {
        switch (action.type) {
            case 'setSelectedTracer':
                return { ...state, selectedTracer: action.value };
            case 'setUserBalance':
                return { ...state, balance: action.value };
            default:
                throw new Error('Unexpected action');
        }
    };

    const [tracerState, tracerDispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // for initialising the tracer store through props
        if (tracer) {
            tracerDispatch({ type: 'setSelectedTracer', value: tracers?.[tracer] });
        }
    }, [tracer]);

    useEffect(() => {
        // detecting when tracers changes so we can set a default tracer
        console.log(tracers, 'from tracers');
        if (tracers && !isEmpty(tracers)) {
            const defaultTracer = Object.values(tracers)[0];
            tracerDispatch({ type: 'setSelectedTracer', value: defaultTracer });
            createBook(defaultTracer);
        }
    }, [tracers]);

    const { selectedTracer, balance } = tracerState;

    const fetchUserData = async () => {
        if (tracers) {
            const userData = await Promise.all(
                Object.values(tracers).map((tracer: Tracer) => tracer?.updateUserBalance(account)),
            );
            tracerDispatch({ type: 'setUserBalance', value: userData[0] });
        }
    };

    const placeOrder = async (order: OrderState) => {
        const { rMargin, price, position } = order;
        // all orders are OME orders
        const parsedPrice = price * selectedTracer?.priceMultiplier;
        const amount = Web3.utils.toWei(rMargin.toString()) ?? 0;
        const expiration = new Date().getTime() + 604800;
        const makes: OrderData[] = [
            {
                amount: amount,
                price: parsedPrice.toString(),
                side: position === 0,
                user: account ?? '',
                expiration: expiration,
                targetTracer: selectedTracer?.address ? Web3.utils.toChecksumAddress(selectedTracer.address) : '',
                nonce: 5101,
            },
        ];
        const signedMakes = await signOrders(web3, makes, config?.contracts.trader.address as string);
        const omeOrder = orderToOMEOrder(web3, await signedMakes[0]);
        await createOrder(selectedTracer?.address as string, omeOrder);
        return { status: 'success' } as Result; // TODO add error check
    };

    useEffect(() => {
        const fetch = async () => {
            const balance = await selectedTracer?.updateUserBalance(account);
            tracerDispatch({ type: 'setUserBalance', value: balance });
        };
        fetch();
    }, [account]);

    useEffect(() => {
        if (selectedTracer) {
            fetchUserData();
            selectedTracer?.updateFeeRate();
        }
    }, [selectedTracer]);

    const tracerId = selectedTracer?.marketId;

    return (
        <TracerContext.Provider
            value={{
                tracerId,
                setTracerId: (tracerId: string) =>
                    tracerDispatch({ type: 'setSelectedTracer', value: tracers?.[tracerId] }),
                selectedTracer,
                balance,
                placeOrder,
            }}
        >
            {children}
        </TracerContext.Provider>
    );
};
