// Mock Trading API Service - Simulates Zerodha Kite API

export interface Stock {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  bid: number;
  ask: number;
  bidQty: number;
  askQty: number;
}

export interface Position {
  symbol: string;
  qty: number;
  avg: number;
  ltp: number;
  pnl: number;
  dayPnl: number;
}

export interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
  ltp: number;
  currentValue: number;
  invested: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  orderType: "MARKET" | "LIMIT" | "SL" | "SL-M";
  quantity: number;
  price: number;
  triggerPrice?: number;
  status: "COMPLETED" | "PENDING" | "REJECTED" | "CANCELLED";
  time: string;
  filledQty: number;
}

export interface Funds {
  availableCash: number;
  usedMargin: number;
  availableMargin: number;
  totalCollateral: number;
  openingBalance: number;
}

export interface MarketDepth {
  bids: Array<{ price: number; quantity: number; orders: number }>;
  asks: Array<{ price: number; quantity: number; orders: number }>;
}

class TradingAPI {
  private stocks: Map<string, Stock> = new Map();
  private positions: Position[] = [];
  private holdings: Holding[] = [];
  private orders: Order[] = [];
  private funds: Funds;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.initializeMockData();
    this.startPriceSimulation();
    
    this.funds = {
      availableCash: 125430.50,
      usedMargin: 48500.00,
      availableMargin: 76930.50,
      totalCollateral: 125430.50,
      openingBalance: 150000.00,
    };
  }

  private initializeMockData() {
    const symbols = [
      { name: "NIFTY 50", base: 21850, vol: 125000000 },
      { name: "RELIANCE", base: 2456, vol: 8500000 },
      { name: "TCS", base: 3678, vol: 4200000 },
      { name: "INFY", base: 1542, vol: 9800000 },
      { name: "HDFC BANK", base: 1623, vol: 12000000 },
      { name: "ICICI BANK", base: 942, vol: 15000000 },
      { name: "ITC", base: 456, vol: 18000000 },
      { name: "BHARTI AIRTEL", base: 1234, vol: 6500000 },
    ];

    symbols.forEach(({ name, base, vol }) => {
      const change = (Math.random() - 0.5) * base * 0.02;
      const ltp = base + change;
      this.stocks.set(name, {
        symbol: name,
        ltp,
        change,
        changePercent: (change / base) * 100,
        volume: vol,
        high: ltp + Math.random() * base * 0.01,
        low: ltp - Math.random() * base * 0.01,
        open: base,
        close: base,
        bid: ltp - 0.05,
        ask: ltp + 0.05,
        bidQty: Math.floor(Math.random() * 1000) + 100,
        askQty: Math.floor(Math.random() * 1000) + 100,
      });
    });

    // Initialize positions
    this.positions = [
      { symbol: "NIFTY 50", qty: 50, avg: 21720.30, ltp: 21850.45, pnl: 6507.50, dayPnl: 6507.50 },
      { symbol: "RELIANCE", qty: 10, avg: 2433.35, ltp: 2456.80, pnl: 234.50, dayPnl: 234.50 },
      { symbol: "TCS", qty: -5, avg: 3691.20, ltp: 3678.90, pnl: 61.50, dayPnl: 61.50 },
    ];

    // Initialize holdings
    this.holdings = [
      {
        symbol: "INFY",
        qty: 50,
        avgPrice: 1480.00,
        ltp: 1542.60,
        currentValue: 77130.00,
        invested: 74000.00,
        pnl: 3130.00,
        pnlPercent: 4.23,
        dayChange: 435.00,
        dayChangePercent: 0.57,
      },
      {
        symbol: "HDFC BANK",
        qty: 30,
        avgPrice: 1590.00,
        ltp: 1623.50,
        currentValue: 48705.00,
        invested: 47700.00,
        pnl: 1005.00,
        pnlPercent: 2.11,
        dayChange: 456.00,
        dayChangePercent: 0.94,
      },
      {
        symbol: "ITC",
        qty: 100,
        avgPrice: 465.00,
        ltp: 456.80,
        currentValue: 45680.00,
        invested: 46500.00,
        pnl: -820.00,
        pnlPercent: -1.76,
        dayChange: -120.00,
        dayChangePercent: -0.26,
      },
    ];
  }

  private startPriceSimulation() {
    setInterval(() => {
      this.stocks.forEach((stock, symbol) => {
        const volatility = 0.002;
        const change = (Math.random() - 0.5) * stock.ltp * volatility;
        const newLtp = stock.ltp + change;
        
        const updatedStock: Stock = {
          ...stock,
          ltp: newLtp,
          change: newLtp - stock.open,
          changePercent: ((newLtp - stock.open) / stock.open) * 100,
          bid: newLtp - 0.05,
          ask: newLtp + 0.05,
          high: Math.max(stock.high, newLtp),
          low: Math.min(stock.low, newLtp),
          volume: stock.volume + Math.floor(Math.random() * 10000),
        };
        
        this.stocks.set(symbol, updatedStock);
        this.notifySubscribers(`stock:${symbol}`, updatedStock);
      });

      // Update positions based on new LTP
      this.positions = this.positions.map((pos) => {
        const stock = this.stocks.get(pos.symbol);
        if (stock) {
          const pnl = (stock.ltp - pos.avg) * pos.qty;
          return { ...pos, ltp: stock.ltp, pnl, dayPnl: pnl };
        }
        return pos;
      });
      this.notifySubscribers("positions", this.positions);

      // Update holdings
      this.holdings = this.holdings.map((holding) => {
        const stock = this.stocks.get(holding.symbol);
        if (stock) {
          const currentValue = stock.ltp * holding.qty;
          const pnl = currentValue - holding.invested;
          const dayChange = (stock.ltp - stock.open) * holding.qty;
          return {
            ...holding,
            ltp: stock.ltp,
            currentValue,
            pnl,
            pnlPercent: (pnl / holding.invested) * 100,
            dayChange,
            dayChangePercent: ((stock.ltp - stock.open) / stock.open) * 100,
          };
        }
        return holding;
      });
      this.notifySubscribers("holdings", this.holdings);
    }, 1000);
  }

  subscribe(channel: string, callback: (data: any) => void) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    this.subscribers.get(channel)!.add(callback);

    return () => {
      const subs = this.subscribers.get(channel);
      if (subs) {
        subs.delete(callback);
      }
    };
  }

  private notifySubscribers(channel: string, data: any) {
    const subs = this.subscribers.get(channel);
    if (subs) {
      subs.forEach((callback) => callback(data));
    }
  }

  getStock(symbol: string): Stock | undefined {
    return this.stocks.get(symbol);
  }

  getAllStocks(): Stock[] {
    return Array.from(this.stocks.values());
  }

  getPositions(): Position[] {
    return this.positions;
  }

  getHoldings(): Holding[] {
    return this.holdings;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getFunds(): Funds {
    return this.funds;
  }

  getMarketDepth(symbol: string): MarketDepth {
    const stock = this.stocks.get(symbol);
    if (!stock) {
      return { bids: [], asks: [] };
    }

    const bids = Array.from({ length: 5 }, (_, i) => ({
      price: stock.ltp - (i + 1) * 0.5,
      quantity: Math.floor(Math.random() * 5000) + 500,
      orders: Math.floor(Math.random() * 50) + 5,
    }));

    const asks = Array.from({ length: 5 }, (_, i) => ({
      price: stock.ltp + (i + 1) * 0.5,
      quantity: Math.floor(Math.random() * 5000) + 500,
      orders: Math.floor(Math.random() * 50) + 5,
    }));

    return { bids, asks };
  }

  async placeOrder(orderData: {
    symbol: string;
    type: "BUY" | "SELL";
    orderType: "MARKET" | "LIMIT" | "SL" | "SL-M";
    quantity: number;
    price?: number;
    triggerPrice?: number;
  }): Promise<Order> {
    const order: Order = {
      id: `ORD${Date.now()}`,
      symbol: orderData.symbol,
      type: orderData.type,
      orderType: orderData.orderType,
      quantity: orderData.quantity,
      price: orderData.price || this.stocks.get(orderData.symbol)?.ltp || 0,
      triggerPrice: orderData.triggerPrice,
      status: orderData.orderType === "MARKET" ? "COMPLETED" : "PENDING",
      time: new Date().toLocaleTimeString(),
      filledQty: orderData.orderType === "MARKET" ? orderData.quantity : 0,
    };

    this.orders.unshift(order);

    // Update funds
    if (order.status === "COMPLETED") {
      const orderValue = order.price * order.quantity;
      if (order.type === "BUY") {
        this.funds.usedMargin += orderValue;
        this.funds.availableMargin -= orderValue;
      } else {
        this.funds.usedMargin -= orderValue;
        this.funds.availableMargin += orderValue;
      }
    }

    this.notifySubscribers("orders", this.orders);
    this.notifySubscribers("funds", this.funds);

    // Simulate order execution after delay for non-market orders
    if (orderData.orderType !== "MARKET") {
      setTimeout(() => {
        order.status = Math.random() > 0.1 ? "COMPLETED" : "REJECTED";
        order.filledQty = order.status === "COMPLETED" ? order.quantity : 0;
        this.notifySubscribers("orders", this.orders);
      }, 2000);
    }

    return order;
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const order = this.orders.find((o) => o.id === orderId);
    if (order && order.status === "PENDING") {
      order.status = "CANCELLED";
      this.notifySubscribers("orders", this.orders);
      return true;
    }
    return false;
  }

  async squareOffPosition(symbol: string): Promise<Order | null> {
    const position = this.positions.find((p) => p.symbol === symbol);
    if (!position) return null;

    const orderType: "BUY" | "SELL" = position.qty > 0 ? "SELL" : "BUY";
    const order = await this.placeOrder({
      symbol: position.symbol,
      type: orderType,
      orderType: "MARKET",
      quantity: Math.abs(position.qty),
    });

    // Remove position after square off
    this.positions = this.positions.filter((p) => p.symbol !== symbol);
    this.notifySubscribers("positions", this.positions);

    return order;
  }
}

export const tradingApi = new TradingAPI();
