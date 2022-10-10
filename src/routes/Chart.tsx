import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId), {
    refetchInterval: 10000,
  });
  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type='candlestick'
          series={
            [
              {
                name: "Price",
                data: data?.map((price) => {
                  return [new Date(price.time_close).getTime(), price.open, price.high, price.low, price.close];
                }),
              },
            ] as any
          }
          options={{
            theme: {
              mode: "dark",
              palette: "palette1",
            },
            chart: {
              height: 400,
              width: 500,
              toolbar: {
                show: true,
              },
            },
            grid: {
              show: true,
            },

            yaxis: {
              show: true,
            },
            xaxis: {
              axisBorder: { show: true },
              axisTicks: { show: true },
              labels: { show: true },
              type: "datetime",
              categories: data?.map((price) => new Date(Number(price.time_close) * 1000)),
            },

            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
              x: {
                format: "dd/MM/yy",
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#3C90EB",
                  downward: "#df5046",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
