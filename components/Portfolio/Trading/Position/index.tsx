import React, { useState } from 'react';
import { Logo } from '@components/General';
import { toApproxCurrency } from '@libs/utils';
import {
    TableHead,
    TableHeadEnd,
    TableRow,
    TableCell,
    SecondaryCell,
    Button,
    StatusIndicator,
    getStatusColour,
} from '@components/Portfolio';
import Tracer from '@libs/Tracer';
import { calcLiquidationPrice, calcTotalMargin } from '@tracer-protocol/tracer-utils';

const Position:React.FC<{ tracers: Record<string, Tracer> }> = ({ tracers }) => {
    const [show, setShow] = useState(false);
    const headings = [
        'Market',
        'Position',
        'Unrealised P&L',
        'Realised P&L',
        'Margin Used',
        'Exposure',
        'Liquidation Price/ Mark Price',
        'Status',
    ];

    const _status = [
        "Open", "Eligible for Liquidation", "Approaching Liquidation", "Closed"
    ]

    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setShow(!show);
    };

    const activeButton = {
        width: '100px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    const inactiveButton = {
        width: '100px',
    };

    const largeButton = {
        width: '250px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    };

    const openRow = {
        display: 'normal',
        color: '#fff',
        opacity: 1,
        hoverBG: '#002886',
        hoverCursor: 'pointer',
    };

    const showClosedRow = {
        display: 'normal',
        color: '##00000029',
        opacity: 0.5,
    };

    const hideClosedRow = {
        display: 'none',
    };

    const getRowStatus = (status: string, show: boolean) => {
        if (status !== 'Closed') {
            return openRow;
        } else {
            if (show) {
                return showClosedRow;
            } else {
                return hideClosedRow;
            }
        }
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {headings.map((heading, i) =>
                            i === 7 ? <TableHeadEnd>{heading}</TableHeadEnd> : <TableHead>{heading}</TableHead>,
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Object.values(tracers).map((tracer, i) => { 
                        let name = tracer.marketId.split("/")[0];
                        let status = _status[i];
                        let { quote, base } = tracer.balances;

                        // TODO calculate these
                        let unrealisedPL= 453.23, realisedPL = -4.5;

                        return (
                            <TableRow key={`table-row-${i}`} theme={getRowStatus(status[i], show)}>
                                <TableCell>
                                    <div className="flex flex-row">
                                        <div className="my-auto">
                                            <Logo ticker={name} />
                                        </div>
                                        <div className="my-auto ml-2">{tracer.marketId}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{base.lt(0) ? 'SHORT' : 'LONG'}</TableCell>
                                <TableCell color={unrealisedPL < 0 ? '#F15025' : '#21DD53'}>
                                    {toApproxCurrency(unrealisedPL)}
                                </TableCell>
                                <TableCell color={realisedPL < 0 ? '#F15025' : '#21DD53'}>
                                    {toApproxCurrency(realisedPL)}
                                </TableCell>
                                <TableCell>{toApproxCurrency(calcTotalMargin(quote, base, tracer.oraclePrice))}</TableCell>
                                <TableCell>
                                    {base.abs().toNumber()} {name}
                                </TableCell>
                                <TableCell>
                                    {toApproxCurrency(calcLiquidationPrice(quote, base, tracer.oraclePrice, tracer.maxLeverage))}
                                    <SecondaryCell>{toApproxCurrency(tracer.oraclePrice)}</SecondaryCell>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-row">
                                        <StatusIndicator
                                            color={getStatusColour(status)}
                                            className="text-2xl my-auto"
                                        >
                                            &bull;
                                        </StatusIndicator>
                                        <div className="mx-2 my-auto">{status}</div>
                                        <div className="my-auto ml-auto">
                                            <Button theme={status !== 'Closed' ? activeButton : inactiveButton}>
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    )}
                </tbody>
            </table>
            <div className="flex mt-8 justify-center">
                <Button theme={largeButton} onClick={(e) => onClick(e)}>
                    {show ? 'Hide Closed Positions' : 'Show Closed Positions'}
                </Button>
            </div>
        </>
    );
};
export default Position;
