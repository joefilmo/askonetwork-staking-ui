import React, { useState, useEffect } from 'react';
import addresses from './contracts/addresses';
import abis from './contracts/abis';
import * as blockchainApi from './apis/blockchain';
import {
  ThemeProvider,
  CSSReset,
  Box,
  SimpleGrid,
  Image,
  Heading,
  Flex,
  Text,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Link
} from '@chakra-ui/core';
import theme from './theme';
import './App.css';

import Web3 from 'web3';
import Web3Modal from 'web3modal';

import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import UniLogin from '@unilogin/provider';
import Portis from '@portis/web3';
import Squarelink from 'squarelink';
import MewConnect from '@myetherwallet/mewconnect-web-client';

import CountDown from './components/CountDown';
import Footer from './components/Footer';
import Header from './components/Header';
import StakingButtonGroup from './components/StakingButtonGroup';
import AccountStakingStats from './components/AccountStakingStats';
import TotalStakingStats from './components/TotalStakingStats';
import StakeTab from './components/StakeTab';
import UnstakeTab from './components/UnstakeTab';
import DividendsTab from './components/DividendsTab';
import StakingBonus from './components/StakingBonus';
import LotteryInfo from './components/LotteryInfo';
import LotteryPurchase from './components/LotteryPurchase';

const INFURA_ID = '82014a99110c48dabeb8e2d5489599e5';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: 'pk_live_522E2B32F46FB16A', // required
    },
  },
  torus: {
    package: Torus, // required
  },
  authereum: {
    package: Authereum, // required
  },
  unilogin: {
    package: UniLogin, // required
  },
  portis: {
    package: Portis, // required
    options: {
      id: '12f64063-f3e7-4bed-bb31-8c6dd697867b', // required
    },
  },
  squarelink: {
    package: Squarelink, // required
    options: {
      id: '88f1885b8489c400f03b', // required
    },
  },
  mewconnect: {
    package: MewConnect, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
};

console.log(Web3Modal);

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

function App() {
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(
    //new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/' + INFURA_ID)
    new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_ID)
  );
  const [web3, setWeb3] = useState(new Web3(provider));

  const toBN = web3.utils.toBN;
  const toWei = web3.utils.toWei;
  const fromWei = web3.utils.fromWei;

  const [lotteryState, setLotteryState] = useState({
    lotteryFactoryContract: null,
    mostRecentAskoLotteryTokenContract: null,

    lotteryAddresses: [],
    registeredStakers: [],

    lotteryTokenName: '',
    lotteryTokenSymbol: '',
    lotteryTokenBalance: toBN('0'),
    mostRecentPresaleStartTime: toBN('0'),
    mostRecentPresaleEndTime: toBN('0'),
    tokenPrice: toBN('0'),
    tokenMaxSupply: toBN('0'),
    ETHMaxSupply: toBN('0'),
    lotteryTokenHardCap: toBN('0'),
    ETHHardCap: toBN('0'),
    lotteryRound: toBN('0'),
    uniswapTokenSupplyPercentNumerator: toBN('0'),
    stakersETHRewardsPercentNumerator: toBN('0'),
    adminFeesETHPercentNumerator: toBN('0'),
    stakersETHRewards: toBN('0'),
    unclaimedETHRewards: toBN('0'),
    isStakerRegistered: false,
    askoAllowance: toBN('0'),

    lotteryETHBalance: toBN('0'),
  });

  const [connected, setConnected] = useState(false);
  const [chainId, setChainId] = useState(1);
  const [networkId, setNetworkId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [
    rewardPoolRegistrationStart,
    setRewardPoolRegistrationStart,
  ] = useState(Date.UTC(2020, 6, 9, 13, 30, 0, 0));
  const [rewardPoolStart, setRewardPoolStart] = useState(
    Date.UTC(2020, 6, 10, 13, 30, 0, 0)
  );
  const [
    isRewardPoolRegistrationActive,
    setIsRewardPoolRegistrationActive,
  ] = useState(Date.now() > rewardPoolRegistrationStart);
  const [isRewardPoolActive, setIsRewardPoolActive] = useState(
    Date.now() > rewardPoolStart
  );
  const [requestStakeValue, setRequestStakeValue] = useState('');
  const [requestUnstakeValue, setRequestUnstakeValue] = useState('');
  const [requestWithdrawValue, setRequestWithdrawValue] = useState('');
  const [requestReinvestValue, setRequestReinvestValue] = useState('');

  const [totalStaked, setTotalStaked] = useState('');
  const [totalStakers, setTotalStakers] = useState('');
  const [totalDistributions, setTotalDistributions] = useState('');
  const [totalAsko, setTotalAsko] = useState('');

  const [accountAsko, setAccountAsko] = useState('');
  const [accountStake, setAccountStake] = useState('');
  const [accountDivis, setAccountDivis] = useState('');
  const [accountApproved, setAccountApproved] = useState('');
  const [accountIsRegistered, setAccountIsRegistered] = useState(false);

  const [askoStakingSC, setAskoStakingSC] = useState(null);
  const [askoTokenSC, setAskoTokenSC] = useState(null);
  const [askoStakingRewardPoolSC, setAskoStakingRewardPoolSC] = useState(null);

  const [currentCycle, setCurrentCycle] = useState('0');

  const [
    previousCycleStakerPoolOwnership,
    setPreviousCycleStakerPoolOwnership,
  ] = useState('');
  const [
    currentCycleStakerPoolOwnership,
    setCurrentCycleStakerPoolOwnership,
  ] = useState('');
  const [
    nextCycleStakerPoolOwnership,
    setNextCycleStakerPoolOwnership,
  ] = useState('');

  const [previousCyclePoolTotal, setPreviousCyclePoolTotal] = useState('');
  const [currentCyclePoolTotal, setCurrentCyclePoolTotal] = useState('');
  const [nextCyclePoolTotal, setNextCyclePoolTotal] = useState('');

  const [previousCyclePayout, setPreviousCyclePayout] = useState('');
  const [currentCyclePayout, setCurrentCyclePayout] = useState('');
  const [nextCyclePayout, setNextCyclePayout] = useState('');

  const setupStates = async () => {
    let lotteryFactoryContract = await blockchainApi.getLotteryFactoryContract(
      web3
    );

    try {
      const lotteryAddresses = await blockchainApi.getLotteryAddresses(
        lotteryFactoryContract
      );

      const registeredStakers = await blockchainApi.getRegisteredStakers(
        lotteryFactoryContract
      );

      const mostRecentAskoLotteryTokenContract = await blockchainApi.getAskoLotteryTokenContract(
        web3,
        lotteryAddresses[lotteryAddresses.length - 1]
      );

      const lotteryTokenName = await blockchainApi.getTokenName(
        mostRecentAskoLotteryTokenContract
      );

      const lotteryTokenSymbol = await blockchainApi.getTokenSymbol(
        mostRecentAskoLotteryTokenContract
      );

      const lotteryTokenBalance = await blockchainApi.getERC20Balance(
        mostRecentAskoLotteryTokenContract,
        address
      );

      const mostRecentPresaleStartTime = await blockchainApi.getLotteryPresaleStartTime(
        mostRecentAskoLotteryTokenContract
      );

      const mostRecentPresaleEndTime = await blockchainApi.getLotteryPresaleEndTime(
        mostRecentAskoLotteryTokenContract
      );

      const tokenPrice = await blockchainApi.getLotteryTokenPrice(
        mostRecentAskoLotteryTokenContract
      );

      const tokenMaxSupply = await blockchainApi.getTokenMaxSupply(
        mostRecentAskoLotteryTokenContract
      );

      const ETHMaxSupply = await blockchainApi.getETHMaxSupply(
        mostRecentAskoLotteryTokenContract
      );

      const lotteryTokenHardCap = await blockchainApi.getLotteryTokenHardCap(
        mostRecentAskoLotteryTokenContract
      );

      const ETHHardCap = await blockchainApi.getETHHardCap(
        mostRecentAskoLotteryTokenContract
      );

      const lotteryRound = await blockchainApi.getCurrentLotteryRound(
        lotteryFactoryContract
      );

      const uniswapTokenSupplyPercentNumerator = await blockchainApi.getUniswapTokenSupplyPercentNumerator(
        mostRecentAskoLotteryTokenContract
      );

      const stakersETHRewardsPercentNumerator = await blockchainApi.getStakersETHRewardsPercentNumerator(
        mostRecentAskoLotteryTokenContract
      );

      const adminFeesETHPercentNumerator = await blockchainApi.getAdminFeesETHPercentNumerator(
        mostRecentAskoLotteryTokenContract
      );

      const stakersETHRewards = await blockchainApi.getStakersETHRewards(
        mostRecentAskoLotteryTokenContract
      );

      const unclaimedETHRewards = await blockchainApi.getUnclaimedETHRewards(
        mostRecentAskoLotteryTokenContract,
        address
      );

      const isStakerRegistered = await blockchainApi.isStakerRegistered(
        lotteryFactoryContract,
        address
      );

      const lotteryETHBalance = await blockchainApi.getETHBalance(
        lotteryAddresses[lotteryAddresses.length - 1],
        web3
      );

      const askoAllowance = await blockchainApi.getERC20Allowance(
        mostRecentAskoLotteryTokenContract,
        address
      );

      console.log('state',
      {
        ...lotteryState,
        lotteryFactoryContract,
        mostRecentAskoLotteryTokenContract,
        lotteryAddresses,
        registeredStakers,
        lotteryTokenName,
        lotteryTokenSymbol,
        mostRecentPresaleStartTime: toBN(mostRecentPresaleStartTime),
        mostRecentPresaleEndTime: toBN(mostRecentPresaleEndTime),
        tokenPrice: toBN(tokenPrice),
        tokenMaxSupply: toBN(tokenMaxSupply),
        ETHMaxSupply: toBN(ETHMaxSupply),
        lotteryTokenHardCap: toBN(lotteryTokenHardCap),
        ETHHardCap: toBN(ETHHardCap),
        lotteryRound: toBN(lotteryRound),
        uniswapTokenSupplyPercentNumerator: toBN(uniswapTokenSupplyPercentNumerator),
        stakersETHRewardsPercentNumerator: toBN(stakersETHRewardsPercentNumerator),
        adminFeesETHPercentNumerator: toBN(adminFeesETHPercentNumerator),
        stakersETHRewards: toBN(stakersETHRewards),
        unclaimedETHRewards: toBN(unclaimedETHRewards),
        isStakerRegistered,
        lotteryETHBalance: toBN(lotteryETHBalance),
        askoAllowance: toBN(askoAllowance)
      }
      )
      setLotteryState({
        ...lotteryState,
        lotteryFactoryContract,
        mostRecentAskoLotteryTokenContract,
        lotteryAddresses,
        registeredStakers,
        lotteryTokenName,
        lotteryTokenSymbol,
        lotteryTokenBalance: toBN(lotteryTokenBalance),
        mostRecentPresaleStartTime: toBN(mostRecentPresaleStartTime),
        mostRecentPresaleEndTime: toBN(mostRecentPresaleEndTime),
        tokenPrice: toBN(tokenPrice),
        tokenMaxSupply: toBN(tokenMaxSupply),
        ETHMaxSupply: toBN(ETHMaxSupply),
        lotteryTokenHardCap: toBN(lotteryTokenHardCap),
        ETHHardCap: toBN(ETHHardCap),
        lotteryRound: toBN(lotteryRound),
        uniswapTokenSupplyPercentNumerator: toBN(uniswapTokenSupplyPercentNumerator),
        stakersETHRewardsPercentNumerator: toBN(stakersETHRewardsPercentNumerator),
        adminFeesETHPercentNumerator: toBN(adminFeesETHPercentNumerator),
        stakersETHRewards: toBN(stakersETHRewards),
        unclaimedETHRewards: toBN(unclaimedETHRewards),
        isStakerRegistered,
        lotteryETHBalance: toBN(lotteryETHBalance),
        askoAllowance: toBN(askoAllowance)
      });
    } catch (error) {
      console.error(error);
    }
  };

  const initWeb3 = async (provider) => {
    const web3 = new Web3(provider);

    web3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: web3.utils.hexToNumber,
        },
      ],
    });

    return web3;
  };

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAddress('');
    setWeb3(null);
    setProvider(null);
    setConnected(false);
    setChainId(1);
    setNetworkId(1);
    setShowModal(false);
  };

  const subscribeProvider = async (provider, web3) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp(web3));
    provider.on('accountsChanged', async (accounts) => {
      setAddress(accounts[0]);
    });
    provider.on('chainChanged', async (chainId) => {
      const networkId = await web3.eth.net.getId();
      setChainId(chainId);
      setNetworkId(networkId);
    });
    provider.on('networkChanged', async (networkId) => {
      const chainId = await web3.eth.chainId();
      setChainId(chainId);
      setNetworkId(networkId);
    });
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    const web3 = await initWeb3(provider);
    await subscribeProvider(provider, web3);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.chainId();

    setConnected(true);
    setAddress(address);
    setChainId(chainId);
    setNetworkId(networkId);
    setProvider(provider);
    setWeb3(web3);
  };

  const handleApprove = async () => {
    if (!web3 || !address || !askoStakingSC || !askoTokenSC) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    await askoTokenSC.methods
      .approve(addresses.askoStaking, web3.utils.toWei('140000000'))
      .send({ from: address });
    alert(
      'Approve request sent. Check your wallet to see when it has confirmed.'
    );
  };

  const handleStake = async () => {
    console.log('accountAsko', accountAsko)
    const accountAskoWei = toBN(toWei(accountAsko));
    const requestStakeValueWei = toBN(toWei(requestStakeValue.toString()));
    if (!web3 || !address || !askoStakingSC) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    if (accountAskoWei.lt(requestStakeValueWei)) {
      alert('Your account does not have enough ASKO.');
      return;
    }
    if (lotteryState.askoAllowance.lt(requestStakeValueWei)) {
      handleApprove();
    }
    await askoStakingSC.methods
      .stake(requestStakeValueWei)
      .send({ from: address });
    alert(
      'Stake request sent. stake your wallet to see when it has confirmed.'
    );
  };

  const handleUnstake = async () => {
    const accountStakeWei = toBN(toWei(accountStake));
    const requestUnstakeValueWei = toBN(toWei(requestUnstakeValue.toString()));
    if (!web3 || !address || !askoStakingSC) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    if (accountStakeWei.lt(requestUnstakeValueWei)) {
      alert('Your stake is not that large.');
      return;
    }
    await askoStakingSC.methods
      .unstake(requestUnstakeValueWei)
      .send({ from: address });
    alert(
      'Unstake request sent. Check your wallet to see when it has confirmed.'
    );
  };

  const handleRewardPoolRegistration = async () => {
    await askoStakingRewardPoolSC.methods.register().send({ from: address });
  };

  const handleRewardPoolClaim = async () => {
    await askoStakingRewardPoolSC.methods
      .claim(Number(currentCycle) - 1)
      .send({ from: address });
  };

  const handleWithdraw = async () => {
    const accountDivisWei = toBN(toWei(accountDivis));
    if (!web3 || !address || !askoStakingSC) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    await askoStakingSC.methods
      .withdraw(accountDivisWei)
      .send({ from: address });
    alert(
      'Withdraw request sent. Check your wallet to see when it has confirmed.'
    );
  };

  const handleReinvest = async () => {
    const accountDivisWei = toBN(toWei(accountDivis));
    if (!web3 || !address || !askoStakingSC) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    await askoStakingSC.methods
      .reinvest(accountDivisWei)
      .send({ from: address });
    alert(
      'Reinvest request sent. Check your wallet to see when it has confirmed.'
    );
  };

  useEffect(() => {
    if (window.web3) onConnect();
  }, []);

  useEffect(() => {
    if (!web3) return;
    if (!address) return;

    setupStates();

    const askoTokenSC = new web3.eth.Contract(
      abis.askoToken,
      addresses.askoToken
    );
    const askoStakingSC = new web3.eth.Contract(
      abis.askoStaking,
      addresses.askoStaking
    );
    const askoStakingRewardPoolSC = new web3.eth.Contract(
      abis.askoStakingRewardPool,
      addresses.askoStakingRewardPool
    );
    if (!askoTokenSC) return;
    if (!askoStakingSC) return;
    if (!askoStakingRewardPoolSC) return;


    let fetchData = async (
      web3,
      address,
      askoTokenSC,
      askoStakingSC,
      askoStakingRewardPoolSC
    ) => {
    //console.log('asko balance' ,await askoTokenSC.methods.balanceOf(address).call())

      const [
        totalStaked,
        totalStakers,
        totalDistributions,
        accountAsko,
        accountStake,
        accountDivis,
        accountApproved,
        accountIsRegistered,
        currentCycle,
        totalAsko,
      ] = await Promise.all([
        askoStakingSC.methods.totalStaked().call(),
        askoStakingSC.methods.totalStakers().call(),
        askoStakingSC.methods.totalDistributions().call(),
        askoTokenSC.methods.balanceOf(address).call(),
        askoStakingSC.methods.stakeValue(address).call(),
        askoStakingSC.methods.dividendsOf(address).call(),
        askoTokenSC.methods.allowance(address, addresses.askoStaking).call(),
        askoStakingRewardPoolSC.methods.isStakerRegistered(address).call(),
        askoStakingRewardPoolSC.methods.getCurrentCycleCount().call(),
        //true,
        //'0',
        askoTokenSC.methods.totalSupply().call(),
      ])
      console.log('here',[
        totalStaked,
        totalStakers,
        totalDistributions,
        accountAsko,
        accountStake,
        accountDivis,
        accountApproved,
        accountIsRegistered,
        currentCycle,
        totalAsko,
      ] )

      console.log('4')

      const nextCycle = (Number(currentCycle) + 1).toString();
      const previousCycle = (Number(currentCycle) - 1).toString();
      let previousCycleStakerPoolOwnership,
      currentCycleStakerPoolOwnership,
      nextCycleStakerPoolOwnership,
      previousCyclePoolTotal,
      currentCyclePoolTotal,
      nextCyclePoolTotal,
      previousCyclePayout,
      currentCyclePayout,
      nextCyclePayout;
      try {
        [
          previousCycleStakerPoolOwnership,
          currentCycleStakerPoolOwnership,
          nextCycleStakerPoolOwnership,
          previousCyclePoolTotal,
          currentCyclePoolTotal,
          nextCyclePoolTotal,
          previousCyclePayout,
          currentCyclePayout,
          nextCyclePayout,
        ] = await Promise.all([
          askoStakingRewardPoolSC.methods
            .cycleStakerPoolOwnership(previousCycle, address)
            .call(),
          askoStakingRewardPoolSC.methods
            .cycleStakerPoolOwnership(currentCycle, address)
            .call(),
          askoStakingRewardPoolSC.methods
            .cycleStakerPoolOwnership(nextCycle, address)
            .call(),
          askoStakingRewardPoolSC.methods.cyclePoolTotal(previousCycle).call(),
          askoStakingRewardPoolSC.methods.cyclePoolTotal(currentCycle).call(),
          askoStakingRewardPoolSC.methods.cyclePoolTotal(nextCycle).call(),
          askoStakingRewardPoolSC.methods
            .calculatePayout(address, previousCycle)
            .call(),
          askoStakingRewardPoolSC.methods
            .calculatePayout(address, currentCycle)
            .call(),
          askoStakingRewardPoolSC.methods
            .calculatePayout(address, nextCycle)
            .call(),
        ]);
      } catch(error) {console.error(error)}

      console.log('5')
      setTotalStaked(web3.utils.fromWei(totalStaked));
      setTotalStakers(totalStakers);
      setTotalDistributions(web3.utils.fromWei(totalDistributions));
      console.log('web3.utils.fromWei(accountAsko)', web3.utils.fromWei(accountAsko))
      setAccountAsko(web3.utils.fromWei(accountAsko));
      setAccountStake(web3.utils.fromWei(accountStake));
      setAccountDivis(web3.utils.fromWei(accountDivis));
      setAccountApproved(web3.utils.fromWei(accountApproved));
      setAccountIsRegistered(accountIsRegistered);
      setCurrentCycle(currentCycle);
      setTotalAsko(web3.utils.fromWei(totalAsko));

      setRequestWithdrawValue(accountDivis);
      setRequestReinvestValue(accountDivis);

      setPreviousCycleStakerPoolOwnership(
        web3.utils.fromWei(previousCycleStakerPoolOwnership)
      );
      setCurrentCycleStakerPoolOwnership(
        web3.utils.fromWei(currentCycleStakerPoolOwnership)
      );
      setNextCycleStakerPoolOwnership(
        web3.utils.fromWei(nextCycleStakerPoolOwnership)
      );

      setPreviousCyclePoolTotal(web3.utils.fromWei(previousCyclePoolTotal));
      setCurrentCyclePoolTotal(web3.utils.fromWei(currentCyclePoolTotal));
      setNextCyclePoolTotal(web3.utils.fromWei(nextCyclePoolTotal));

      setPreviousCyclePayout(web3.utils.fromWei(previousCyclePayout));
      setCurrentCyclePayout(web3.utils.fromWei(currentCyclePayout));
      setNextCyclePayout(web3.utils.fromWei(nextCyclePayout));
    };

    fetchData(
      web3,
      address,
      askoTokenSC,
      askoStakingSC,
      askoStakingRewardPoolSC
    );

    let interval;
    if (window.web3) {
      interval = setInterval((web3, address, askoTokenSC, askoStakingSC) => {
        if (!web3 || !address || !askoTokenSC || !askoStakingSC) return;
        fetchData(web3, address, askoTokenSC, askoStakingSC);
      }, 3000);
    } else {
      interval = setInterval((web3, address, askoTokenSC, askoStakingSC) => {
        if (!web3 || !address || !askoTokenSC || !askoStakingSC) return;
        fetchData(web3, address, askoTokenSC, askoStakingSC);
      }, 7000);
    }

    setAskoTokenSC(askoTokenSC);
    setAskoStakingSC(askoStakingSC);
    setAskoStakingRewardPoolSC(askoStakingRewardPoolSC);

    return () => clearInterval(interval);
  }, [web3, address]);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Box w='100%' bg='asko.bg' color='asko.fg' p='20px' pb='160px'>
        <Box
          w='100%'
          maxW='1240px'
          pl={{ base: '5px', sm: '20px' }}
          pr='20px'
          ml='auto'
          mr='auto'
          position='relative'
        >
          <Header web3={web3} address={address} onConnect={onConnect} />

          <Box w="100%" minH="100px" bg="gray.800" color="gray.200" position="relative"  p="20px" textAlign="center" fontSize={{base:"sm", md:"md"}} >
            <Box>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://etherscan.io/address/"+addresses.askoToken}>Token SC</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://etherscan.io/address/"+addresses.askoPresale}>Presale SC</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://etherscan.io/address/"+addresses.askoStaking}>Staking SC</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://app.uniswap.org/#/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&outputCurrency="+addresses.askoToken}>Uniswap</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://github.com/joefilmo/askonetwork-contracts">Github</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://t.me/Askomain">Telegram</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://twitter.com/asko_official">Twitter</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://askobarnetwork.medium.com">Medium</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://discord.gg/vpV3SdZ">Discord</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://www.reddit.com/u/AskobarNetwork">Reddit</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://www.facebook.com/askonetwork/">Facebook</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://www.instagram.com/askobarnetwork/">Instagram</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://bitcointalk.org/index.php?topic=5258683">Bitcointalk</Link>
            </Box>
            <Box>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://dorg.tech/"}>dOrg</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://docs.google.com/document/d/1dblrWWCp2BVfG8qwJF0SYeZaC9c9WqNEWwCeyGlvrN4/edit?usp=sharing"}>Asko Litepaper</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://docs.google.com/document/d/1fS9wwntBEjZHbkSYF_D009b0BvJNjCdOfXnmx8BeyNU/edit?usp=sharing"}>AskoLend</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://github.com/AskobarNetwork/Askolend/tree/master"}>AskoLend Github</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://docs.google.com/document/d/1e--E5ILIUiZo0Wl36M15jp91NKPsWkqgv36EFkphm_8/edit?usp=sharing">AskoLottery</Link>
              <Link color="gray.600" m="5px" display="inline-block" href={"https://etherscan.io/address/"+addresses.lotteryFactory}>AskoLottery SC</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://docs.google.com/document/d/1jmLMq7jz1KOxxzQDdI2-qCWEeLw50g5Xh_p4mYRwNWQ/edit?usp=sharing">AskoLaunch</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://coinmarketcap.com/currencies/askobar-network/markets/">Coinmarketcap</Link>
              <Link color="gray.600" m="5px" display="inline-block" href="https://www.coingecko.com/en/coins/asko">Coingecko</Link>
            </Box>
          </Box>


          <AccountStakingStats
            accountAsko={accountAsko}
            accountStake={accountStake}
            accountDivis={accountDivis}
            totalStaked={totalStaked}
          />

          <TotalStakingStats
            totalStaked={totalStaked}
            totalStakers={totalStakers}
            totalDistributions={totalDistributions}
            totalAsko={totalAsko}
          />

          <Tabs
            isFitted
            w='100%'
            bg='asko.bgMed2'
            p={{ base: '10px', sm: '40px' }}
            borderRadius={{ base: '20px', sm: '40px' }}
            mt={{ base: '20px', sm: '50px' }}
            mb={{ base: '20px', sm: '50px' }}
            variant='unstyled'
          >
            <TabList borderBottom='solid 1px' borderColor='asko.fgMed2'>
              <Tab
                color='asko.fgMed2'
                fontSize={{ base: '18px', sm: '32px' }}
                _selected={{ color: 'asko.fg', border: 'none' }}
                _hover={{ color: 'asko.fg' }}
              >
                Stake
              </Tab>
              <Tab
                color='asko.fgMed2'
                fontSize={{ base: '18px', sm: '32px' }}
                _selected={{ color: 'asko.fg', border: 'none' }}
                _hover={{ color: 'asko.fg' }}
              >
                Unstake
              </Tab>
              <Tab
                color='asko.fgMed2'
                fontSize={{ base: '18px', sm: '32px' }}
                _selected={{ color: 'asko.fg', border: 'none' }}
                _hover={{ color: 'asko.fg' }}
              >
                Dividends
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel h='480px'>
                <StakeTab
                  accountAsko={accountAsko}
                  setRequestStakeValue={setRequestStakeValue}
                  requestStakeValue={requestStakeValue}
                  handleStake={handleStake}
                  handleApprove={handleApprove}
                />
              </TabPanel>
              <TabPanel h='480px'>
                <UnstakeTab
                  accountStake={accountStake}
                  setRequestUnstakeValue={setRequestUnstakeValue}
                  requestUnstakeValue={requestUnstakeValue}
                  handleUnstake={handleUnstake}
                />
              </TabPanel>
              <TabPanel h='480px'>
                <DividendsTab
                  accountDividends={accountDivis}
                  handleWithdraw={handleWithdraw}
                  handleReinvest={handleReinvest}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <StakingBonus
            previousCycle={Number(currentCycle) - 1}
            previousCycleOwnership={previousCycleStakerPoolOwnership}
            previousCycleTotal={previousCyclePoolTotal}
            previousCyclePayout={previousCyclePayout}
            currentCycle={Number(currentCycle)}
            currentCycleOwnership={currentCycleStakerPoolOwnership}
            currentCycleTotal={currentCyclePoolTotal}
            currentCyclePayout={currentCyclePayout}
            nextCycle={Number(currentCycle) + 1}
            nextCycleOwnership={nextCycleStakerPoolOwnership}
            nextCycleTotal={nextCyclePoolTotal}
            nextCyclePayout={nextCyclePayout}
            handleRewardPoolClaim={handleRewardPoolClaim}
            handleRewardPoolRegistration={handleRewardPoolRegistration}
          />

          <LotteryInfo
            lotteryStage={
              lotteryState.mostRecentPresaleStartTime.toString() === '0'
                ? 'Not Started'
                : lotteryState.mostRecentPresaleEndTime.toString() === '0'
                ? 'Presale'
                : 'Started'
            }
            tokenAddress={
              lotteryState.lotteryAddresses[
                lotteryState.lotteryAddresses.length - 1
              ]
            }
            tokenName={lotteryState.lotteryTokenName}
            tokenSymbol={lotteryState.lotteryTokenSymbol}
            lotteryRound={lotteryState.lotteryRound}
            lotteryETHBalance={fromWei(lotteryState.lotteryETHBalance)}
            tokenMaxSupply={fromWei(lotteryState.tokenMaxSupply)}
            stakersETHRewardsPercentNumerator={
              lotteryState.stakersETHRewardsPercentNumerator
            }
            adminFeesETHPercentNumerator={
              lotteryState.adminFeesETHPercentNumerator
            }
            stakersETHRewards={lotteryState.stakersETHRewards}
            unclaimedETHRewards={fromWei(lotteryState.unclaimedETHRewards)}
            disableRegisterButton={lotteryState.isStakerRegistered}
            disableClaimButton={
              fromWei(lotteryState.unclaimedETHRewards).toString() === '0' ||
              !lotteryState.isStakerRegistered
            }
            onRegister={async () => {
              await blockchainApi.registerStaker(
                lotteryState.lotteryFactoryContract,
                address,
                web3
              );
            }}
            onClaim={async () => {
              await blockchainApi.claimStakerETHRewards(
                address,
                lotteryState.lotteryAddresses[
                  lotteryState.lotteryAddresses.length - 1
                ],
                web3
              );
            }}
          />

          <LotteryPurchase
            tokenSymbol={lotteryState.lotteryTokenSymbol}
            lotteryStage={
              lotteryState.mostRecentPresaleStartTime.toString() === '0'
                ? 'Not Started'
                : lotteryState.mostRecentPresaleEndTime.toString() === '0'
                ? 'Presale'
                : 'Started'
            }
            lotteryTokenBalance={fromWei(lotteryState.lotteryTokenBalance)}
            tokenPrice={fromWei(lotteryState.tokenPrice)}
            onRegister={async () => {
              await blockchainApi.registerStaker(
                lotteryState.lotteryFactoryContract,
                address,
                web3
              );
            }}
            onBuy={async (tokenAmount) => {
              console.log('web3 here', web3)
              await blockchainApi.buy(
                tokenAmount,
                lotteryState.tokenPrice,
                address,
                lotteryState.lotteryAddresses[
                  lotteryState.lotteryAddresses.length - 1
                ],
                web3
              );
            }}
          />
        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
