import { useState, useEffect } from "react";
import { tradingApi, Stock, Position, Holding, Order, Funds } from "@/services/tradingApi";

export const useStockData = (symbol: string) => {
  const [stock, setStock] = useState<Stock | undefined>(tradingApi.getStock(symbol));

  useEffect(() => {
    const unsubscribe = tradingApi.subscribe(`stock:${symbol}`, (data: Stock) => {
      setStock(data);
    });

    return unsubscribe;
  }, [symbol]);

  return stock;
};

export const useWatchlist = () => {
  const [stocks, setStocks] = useState<Stock[]>(tradingApi.getAllStocks().slice(0, 5));

  useEffect(() => {
    const unsubscribes = stocks.map((stock) =>
      tradingApi.subscribe(`stock:${stock.symbol}`, (updatedStock: Stock) => {
        setStocks((prev) =>
          prev.map((s) => (s.symbol === updatedStock.symbol ? updatedStock : s))
        );
      })
    );

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  return stocks;
};

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>(tradingApi.getPositions());

  useEffect(() => {
    const unsubscribe = tradingApi.subscribe("positions", (data: Position[]) => {
      setPositions(data);
    });

    return unsubscribe;
  }, []);

  const squareOff = async (symbol: string) => {
    return await tradingApi.squareOffPosition(symbol);
  };

  return { positions, squareOff };
};

export const useHoldings = () => {
  const [holdings, setHoldings] = useState<Holding[]>(tradingApi.getHoldings());

  useEffect(() => {
    const unsubscribe = tradingApi.subscribe("holdings", (data: Holding[]) => {
      setHoldings(data);
    });

    return unsubscribe;
  }, []);

  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const totalDayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);

  return {
    holdings,
    summary: {
      totalInvested,
      totalCurrent,
      totalPnl,
      totalPnlPercent: (totalPnl / totalInvested) * 100,
      totalDayChange,
      totalDayChangePercent: (totalDayChange / (totalCurrent - totalDayChange)) * 100,
    },
  };
};

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(tradingApi.getOrders());

  useEffect(() => {
    const unsubscribe = tradingApi.subscribe("orders", (data: Order[]) => {
      setOrders(data);
    });

    return unsubscribe;
  }, []);

  const placeOrder = async (orderData: any) => {
    return await tradingApi.placeOrder(orderData);
  };

  const cancelOrder = async (orderId: string) => {
    return await tradingApi.cancelOrder(orderId);
  };

  return { orders, placeOrder, cancelOrder };
};

export const useFunds = () => {
  const [funds, setFunds] = useState<Funds>(tradingApi.getFunds());

  useEffect(() => {
    const unsubscribe = tradingApi.subscribe("funds", (data: Funds) => {
      setFunds(data);
    });

    return unsubscribe;
  }, []);

  return funds;
};

export const useMarketDepth = (symbol: string) => {
  const [depth, setDepth] = useState(tradingApi.getMarketDepth(symbol));

  useEffect(() => {
    const interval = setInterval(() => {
      setDepth(tradingApi.getMarketDepth(symbol));
    }, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  return depth;
};
