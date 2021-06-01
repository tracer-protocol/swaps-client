import { OMEOrder } from '@tracer-protocol/tracer-utils';
import { OrderUpdatePayload } from 'types/OrderTypes';
import Tracer from '@libs/Tracer';
import { Result } from 'types/General';


const BASE_URL = process.env.NEXT_PUBLIC_OME_BASE_URL || 'http://localhost:8989';

/** Book API's */
export const createBook = async (tracer: Tracer) => {
    const market = tracer?.address;
    if (!market) {
        console.error('Failed to create book: Tracer not found');
        return;
    }
    const data = {
        market: market,
    };
    return fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err, 'Failed to create market');
        });
};
/**
 * Returns the entier list of tracer markets available to the OME
    An example return:
    {
    "markets": [
        "0xCa208BfD69ae6D2667f1FCbE681BAe12767c0078",
        "0x102abde8ca917fa923d3681a5a6379bbc367e8fe",
        "0x2157a7894439191e520825fe9399ab8655e0f708"
        ]
}
 */
export const getBooks = async () => {
    return fetch(`${BASE_URL}/book`, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            console.debug('Fetched books', res);
            return res;
        })
        .catch((err) => {
            console.error(err, 'Failed to fetch books');
        });
};

/**
 * Gets the orders related to a specific book
 */
export const getOrders = async (market: string) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}`, {
        method: 'GET',
    })
        .then((res) => res.json() )
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
        });
};


export const getUsersOrders: (market: string, account: string) => Promise<OMEOrder[]> = async (market: string, account: string) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}/${omefy(account)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            return res;
        })
        .catch((err) => {
            console.error("Failed to fetch user orders", err);
            return []
        });

}

const omefy = (str: string) => str.slice(2).toLowerCase();

/**
 * Creates an order within a market.
 *
 * Returns a unique identifier of the created order
 * @param market the market the order belongs to
 * @param data order data payload. An example of this request
 */
export const createOrder: (market: string, data: OMEOrder) => Promise<Response> = async (market, data) => {
    if (!market) {
        console.error('Failed to create order: Market is invalid');
        return;
    }
    return fetch(`${BASE_URL}/book/${omefy(market)}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            console.debug('Created order with ome', res);
            return res;
        })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
};

/**
 * Gets individual order specific information
 * @param market the market the order belongs to
 * @param orderId of the order being updated
 */
export const getOrder = async (market: string, orderId: string) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}/order/${orderId}`, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
        });
};

/**
 * Cancels a specific orderId within a market
 * @param market the market the order belongs to
 * @param orderId of the order being updated
 */
export const cancelOrder:(market: string, orderId: string) => Promise<Result> = async (
    market, orderId
) => {
    return fetch(`${BASE_URL}/book/${omefy(market)}/order/${orderId}`, {
        method: 'DELETE',
    })
        .then((res) => {
            console.log("Res beee", res)
            return res.body
        })
        .then((res) => {
            console.log(res)
            return {
                status: 'success',
                message: `Successfully cancelled order: ${orderId}`
            } as Result;
        })
        .catch((err) => {
            console.error(err);
            return {
                status: 'error',
                message: `Failed to cancel order: ${err}`
            } as Result;
        });
};

/**
 * Updates an order within a market
 * @param market the market the order belongs to
 * @param orderId of the order being updated
 * @param update json object representing the new state of the order
 */
export const updateOrder = (market: string, orderId: string, update: OrderUpdatePayload) => {
    return fetch(`${BASE_URL}/book/${market}/order/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error(err);
        });
};

export * from './hooks';
