import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useMatch } from "react-router";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  padding: 0px 20px;
  font-weight: 600;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 40px;
`;
const Loader = styled.h1`
  text-align: center;
  display: block;
`;

const InfoWrapper = styled.div`
  justify-content: center;

  margin-top: 20px;
`;
const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.boxColor};
  text-align: center;
  p {
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 800;
  }
  span {
    font-size: 22px;
    font-weight: 300;
  }
`;
const InfoDescription = styled.div`
  font-size: 20px;
  margin: 30px auto;
  padding: 8px;
  font-weight: 300;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 5px;
`;
const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.356);
  padding: 7px 0px;
  border-radius: 8px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  a {
    display: block;
  }
`;
interface Params {
  coinId: string;
}

function Coin() {
  const { coinId } = useParams() as unknown as Params;
  const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    contract: string;
    platform: string;
    contracts: object;
    logo: string;
    parent: object;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
  }
  interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
      USD: {
        ath_date: string;
        ath_price: number;
        market_cap: number;
        market_cap_change_24h: number;
        percent_change_1h: number;
        percent_change_1y: number;
        percent_change_6h: number;
        percent_change_7d: number;
        percent_change_12h: number;
        percent_change_15m: number;
        percent_change_24h: number;
        percent_change_30d: number;
        percent_change_30m: number;
        percent_from_price_ath: number;
        price: number;
        volume_24h: number;
        volume_24h_change_24h: number;
      };
    };
  }

  useEffect(() => {
    (async () => {
      const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
      const priceData = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();

      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, [coinId]);

  return (
    <Container>
      <Header>
        <Title>{state?.name ? state.name : loading ? "Loading..." : info?.name}</Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <InfoWrapper>
          <InfoBox>
            <div>
              <p>RANK</p>
              <span>{info?.rank}</span>
            </div>
            <div>
              <p>SYMBOL</p>
              <span> {info?.symbol}</span>
            </div>
            <div>
              <p>OPEN SOURCE</p>
              <span>{info?.open_source ? "YES" : "NO"}</span>
            </div>
          </InfoBox>
          <InfoDescription>{info?.description}</InfoDescription>
          <InfoBox>
            <div>
              <p>TOTAL SUPPLY</p>
              <span>{priceInfo?.total_supply}</span>
            </div>
            <div>
              <p>MAX SUPPLY</p>
              <span>{priceInfo?.max_supply}</span>
            </div>
          </InfoBox>
          {/* Tab button part*/}
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route path='chart' element={<Chart />} />
            <Route path='price' element={<Price />} />
          </Routes>
        </InfoWrapper>
      )}
    </Container>
  );
}

export default Coin;
