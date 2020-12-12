import AskoLotteryTokenAbi from '../contracts/abis/AskoLotteryToken.json';
import LotteryFactoryAbi from '../contracts/abis/LotteryFactory.json';
import addresses from '../contracts/addresses';

export const weiToEth = (weiBalance, web3) => {
  console.log('web3', web3);
  return web3.utils.fromWei(weiBalance);
};

export const ethToWei = (ethBalance, web3) => {
  return web3.utils.toWei(ethBalance);
};

//export const formatUnits = (weiBalance, decimals) => {
//  return ethers.utils.formatUnits(weiBalance, decimals);
//};

export const getETHBalance = async (address, web3) => {
  return await web3.eth.getBalance(address);
};

export const connectToMetamask = (web3Provider) => {
  web3Provider.request({ method: 'eth_requestAccounts' });
};

export const getAskoLotteryTokenContract = async (
  web3Provider,
  askoLotteryTokenAddress
) => {
  const AskoLotteryTokenContract = new web3Provider.eth.Contract(
    AskoLotteryTokenAbi,
    askoLotteryTokenAddress
  );

  return AskoLotteryTokenContract;
};

export const getLotteryFactoryContract = async (web3Provider) => {
  const LotteryFactoryContract = new web3Provider.eth.Contract(
    LotteryFactoryAbi,
    addresses.lotteryFactory
  );
  return LotteryFactoryContract;
};

export const getERC20Balance = async (tokenContract, accountAddress) => {
  return await tokenContract.methods.balanceOf(accountAddress).call();
};

export const getERC20Allowance = async (tokenContract, accountAddress) => {
  return await tokenContract.methods
    .allowance(accountAddress, addresses.askoStaking)
    .call();
};

// asko lottery token functions
export const getTokenName = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.name().call();
};

export const getTokenSymbol = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.symbol().call();
};

export const getLotteryPresaleStartTime = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.presaleStartTime().call();
};

export const getLotteryPresaleEndTime = async (askoLotteryTokenContract) => {
  let presaleEndTime = await askoLotteryTokenContract.methods
    .presaleEndTime()
    .call();
  return presaleEndTime;
};

export const getLotteryTokenPrice = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.tokenPrice().call();
};

export const getTokenMaxSupply = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.tokenMaxSupply().call();
};

export const getETHMaxSupply = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.ETHMaxSupply().call();
};

export const getUniswapTokenSupplyPercentNumerator = async (
  askoLotteryTokenContract
) => {
  return await askoLotteryTokenContract.methods
    .uniswapTokenSupplyPercentNumerator()
    .call();
};

export const getStakersETHRewardsPercentNumerator = async (
  askoLotteryTokenContract
) => {
  return await askoLotteryTokenContract.methods
    .stakersETHRewardsPercentNumerator()
    .call();
};

export const getAdminFeesETHPercentNumerator = async (
  askoLotteryTokenContract
) => {
  return await askoLotteryTokenContract.methods
    .adminFeesETHPercentNumerator()
    .call();
};

export const getStakersETHRewards = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.stakersETHRewards().call();
};

export const getLotteryTokenHardCap = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.lotteryTokenHardCap().call();
};

export const getETHHardCap = async (askoLotteryTokenContract) => {
  return await askoLotteryTokenContract.methods.ETHHardCap().call();
};

export const endPresale = async (askoLotteryTokenContract, senderAddress) => {
  return await askoLotteryTokenContract.methods
    .endPresale()
    .send({ from: senderAddress });
};

export const getUnclaimedETHRewards = async (
  askoLotteryTokenContract,
  userAddress
) => {
  return await askoLotteryTokenContract.methods
    .unclaimedETHRewards(userAddress)
    .call();
};

export const buy = async (
  amount,
  tokenPrice,
  senderAddress,
  askoLotteryTokenAddress,
  web3
) => {
  const askoLotteryTokenContract = new web3.eth.Contract(
    AskoLotteryTokenAbi,
    askoLotteryTokenAddress
  );

  let value = web3.utils.toBN(amount).mul(tokenPrice);
  console.log('value', value.toString());

  return await askoLotteryTokenContract.methods
    .buy(ethToWei(amount, web3))
    .send({
      from: senderAddress,
      value: value,
    });
};

export const claimStakerETHRewards = async (
  senderAddress,
  askoLotteryTokenAddress,
  web3
) => {
  const askoLotteryTokenContract = new web3.eth.Contract(
    AskoLotteryTokenAbi,
    askoLotteryTokenAddress
  );
  //const askoLotteryTokenContract = new web3.eth.Contract(
  //  LotteryFactoryAbi,
  //  addresses.lotteryFactory
  //);
  return await askoLotteryTokenContract.methods.claimStakerETHRewards().send({
    from: senderAddress,
  });
};

// Lottery Factory functions
export const startLotteryPresale = async (
  lotteryFactoryContract,
  lotteryTokenName,
  lotteryTokenSymbol,
  lotteryTokenPrice,
  lotteryTokenMaxSupply,
  ETHMaxSupply,
  uniswapTokenSupplyPercentNumerator,
  stakerETHRewardsPercentNumerator,
  adminFeesETHPercentNumerator,
  senderAddress
) => {
  return await lotteryFactoryContract.methods
    .startLotteryPresale(
      lotteryTokenName,
      lotteryTokenSymbol,
      lotteryTokenPrice,
      lotteryTokenMaxSupply,
      ETHMaxSupply,
      uniswapTokenSupplyPercentNumerator,
      stakerETHRewardsPercentNumerator,
      adminFeesETHPercentNumerator
    )
    .send({ from: senderAddress });
};

export const getCurrentLotteryRound = async (lotteryFactoryContract) => {
  let currRound = await lotteryFactoryContract.methods
    .currentLotteryRound()
    .call();
  return currRound;
};

export const getRegisteredStakersLength = async (lotteryFactoryContract) => {
  return await lotteryFactoryContract.methods
    .getRegisteredStakersLength()
    .call();
};

export const isStakerRegistered = async (lotteryFactoryContract, address) => {
  return await lotteryFactoryContract.methods
    .isStakerRegistered(address)
    .call();
};

export const getRegisteredStakers = async (lotteryFactoryContract) => {
  let registeredStakersLength = await lotteryFactoryContract.methods
    .getRegisteredStakersLength()
    .call();
  let registeredStakersAddressesPromises = [];

  for (let i = 0; i < registeredStakersLength; i++) {
    registeredStakersAddressesPromises.push(
      await lotteryFactoryContract.methods.registeredStakers(i).call()
    );
  }

  let results = await Promise.all(registeredStakersAddressesPromises);

  return results;
};

export const getLotteryAddresses = async (lotteryFactoryContract) => {
  console.log('lotteryFactoryContract', lotteryFactoryContract.options);
  let currLotteryRound = await getCurrentLotteryRound(lotteryFactoryContract);
  let lotteryAddressesPromises = [];

  for (let i = 0; i < currLotteryRound; i++) {
    lotteryAddressesPromises.push(
      await lotteryFactoryContract.methods.lotteryAddresses(i).call()
    );
  }

  let results = await Promise.all(lotteryAddressesPromises);
  return results;
};

export const registerStaker = async (
  _lotteryFactoryContract,
  senderAddress,
  web3
) => {
  const lotteryFactoryContract = new web3.eth.Contract(
    LotteryFactoryAbi,
    addresses.lotteryFactory
  );
  return await lotteryFactoryContract.methods
    .registerStaker()
    .send({ from: senderAddress });
};
