import React from 'react'
import { Link as HistoryLink } from 'react-router-dom'

import styled from 'styled-components'
import { useTokenBalanceTreatingWCXSasCXS } from '../../state/wallet/hooks'

import Row from '../Row'
import Web3Status from '../Web3Status'

import { Text } from 'rebass'
import { WCXS, ChainId, Token } from '@uniswap/sdk'
import { isMobile } from 'react-device-detect'
import { YellowCard } from '../Card'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'

//import Logo from '../../assets/svg/logo.svg'
import Wordmark from '../../assets/images/LOGO-NEXTEP.png'
//import LogoDark from '../../assets/svg/logo_white.svg'
import WordmarkDark from '../../assets/images/LOGO-NEXTEP.png'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { useTokenPrices } from '../../state/application/hooks'
import { usePair } from '../../data/Reserves'
import { updatePrices } from '../../state/application/actions'
import { useDispatch } from 'react-redux'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;

  pointer-events: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
  z-index: 2;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 0px;
  white-space: nowrap;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 0px;
  padding: 8px 12px;
`

const UniIcon = styled(HistoryLink)<{ to: string }>`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const MigrateBanner = styled(AutoColumn)`
  width: 100%;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-weight: 400;
  text-align: center;
  pointer-events: auto;
  a {
    color: ${({ theme }) => theme.primaryText1};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0;
    display: none;
  `};
`

const VersionLabel = styled.span<{ isV2?: boolean }>`
  padding: ${({ isV2 }) => (isV2 ? '0.15rem 0.5rem 0.16rem 0.45rem' : '0.15rem 0.5rem 0.16rem 0.35rem')};
  border-radius: 0px;
  background: ${({ theme, isV2 }) => (isV2 ? theme.primary1 : 'none')};
  color: ${({ theme, isV2 }) => (isV2 ? theme.white : theme.primary1)};
  font-size: 0.825rem;
  font-weight: 400;
  :hover {
    user-select: ${({ isV2 }) => (isV2 ? 'none' : 'initial')};
    background: ${({ theme, isV2 }) => (isV2 ? theme.primary1 : 'none')};
    color: ${({ theme, isV2 }) => (isV2 ? theme.white : theme.primary3)};
  }
`

const VersionToggle = styled.a`
  border-radius: 0px;
  border: 1px solid ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.primary1};
  display: flex;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  :hover {
    text-decoration: none;
  }
`

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useDispatch();

  const userEthBalance = useTokenBalanceTreatingWCXSasCXS(account, WCXS[chainId])
  const [isDark] = useDarkModeManager()
  const prices = useTokenPrices();
  const pairBetween = usePair(new Token(chainId,"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",18,"CXS","CXS" ), new Token(chainId, "0x0000000000000000000000000000000000001112", 18, "NEXTEP", "NEXTEP"));

  let nextepPrice = "?";
  if(pairBetween) {
    const cxsPrice : number = prices['CXS']? prices['CXS'] : 0;
    const price = parseFloat(pairBetween.reserve1.toExact()) / parseFloat(pairBetween.reserve0.toExact()) * cxsPrice;
    nextepPrice = "$" + price.toLocaleString('fr', {maximumFractionDigits: 4});
    // using small hack here to set manually the nextep price, not ideal
    dispatch(updatePrices({ symbol: 'NEXTEP', value: price }))
  }
    
  const cxsPrice = prices['CXS']? "$" + prices['CXS'].toLocaleString('fr', {maximumFractionDigits: 4}) : "?";

  return (
    <HeaderFrame>
      {/*<MigrateBanner>
        <Link href="https://uniswap.org/blog/launch-uniswap-v2/">
          <b>blog post ???</b>
        </Link>
        &nbsp;or&nbsp;
        <Link href="https://migrate.uniswap.exchange/">
          <b>migrate your liquidity ???</b>
        </Link>
        .
      </MigrateBanner>*/}
      <RowBetween padding="1rem">
        <HeaderElement>
          <Title>
            {/*
            <UniIcon id="link" to="/">
              <img src={isDark ? LogoDark : Logo} alt="logo" />
            </UniIcon>
            */}
            {!isMobile && (
              <TitleText>
                <HistoryLink id="link" to="/">
                  <img
                    style={{ height: '66px', marginLeft: '4px', marginTop: '4px' }}
                    src={isDark ? WordmarkDark : Wordmark}
                    alt="logo"
                  />
                </HistoryLink>
              </TitleText>
            )}
          </Title>
          <TestnetWrapper style={{ pointerEvents: 'auto' }}>
            {/*!isMobile && (
              <VersionToggle target="_self" href="https://v1.uniswap.exchange">
                <VersionLabel isV2={true}>V2</VersionLabel>
                <VersionLabel isV2={false}>V1</VersionLabel>
              </VersionToggle>
            )*/}
          </TestnetWrapper>
        </HeaderElement>
        <HeaderElement>
        <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Text style={{ flexShrink: 0, margin: "8px" }} px="0.5rem" fontWeight={500}>CXS {cxsPrice}</Text>
            <Text style={{ flexShrink: 0, margin: "8px" }} px="0.5rem" fontWeight={500}>NEXTEP {nextepPrice}</Text>
          </AccountElement>
        </HeaderElement>
        <HeaderElement>
          <TestnetWrapper>
            {!isMobile && chainId === ChainId.TESTNET && <NetworkCard>Testnet</NetworkCard>}
          </TestnetWrapper>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <Text style={{ flexShrink: 0 }} px="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} CXS
              </Text>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </RowBetween>
    </HeaderFrame>
  )
}

