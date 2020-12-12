import React from 'react';
import {
  Text,
  Box,
  Grid,
  Button,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/core';
import { removeDecimal } from '../utils';

export default function LotteryInfo(props) {
  return (
    <Box
      w='100%'
      bg='asko.bgMed'
      p={{ base: '20px', sm: '40px' }}
      borderRadius={{ base: '20px', sm: '40px' }}
      mt='20px'
      mb={{ base: '20px', sm: '50px' }}
    >
      <Text fontWeight='bold' fontSize={{ base: '24px', sm: '36px' }} mb='20px'>
        Lottery
      </Text>
      <Grid
        templateRows='max-content'
        templateColumns={{ base: 'auto', sm: 'auto auto auto' }}
        w='100%'
        gap='20px'
      >
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Lottery Stage:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.lotteryStage}
          </Text>
        </Box>
      </Grid>

      <Grid
        templateRows='max-content'
        templateColumns={{ base: 'auto', sm: 'auto auto auto' }}
        w='100%'
        gap='20px'
        mt='40px'
      >
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Token Address:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.tokenAddress}
          </Text>
        </Box>
      </Grid>

      <Grid
        templateRows='max-content'
        templateColumns={{ base: 'auto', sm: 'auto auto auto' }}
        w='100%'
        gap='20px'
        mt='40px'
        mb='40px'
      >
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Token Name:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.tokenName}
          </Text>
        </Box>
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Token Symbol:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.tokenSymbol}
          </Text>
        </Box>
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Lottery Round:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.lotteryRound.toString()}
          </Text>
        </Box>
      </Grid>

      <Grid
        templateRows='max-content'
        templateColumns={{ base: 'auto', sm: 'auto auto auto' }}
        w='100%'
        gap='20px'
        mt='40px'
        mb='40px'
      >
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Total ETH in Lottery:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.lotteryETHBalance.toString()} ETH
          </Text>
        </Box>
      </Grid>

      <Grid
        templateRows='max-content'
        templateColumns={{ base: 'auto', sm: 'auto auto auto' }}
        w='100%'
        gap='20px'
        mt='40px'
        mb='40px'
      >
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Token Max Supply:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.tokenMaxSupply.toString()} {props.tokenSymbol}
          </Text>
        </Box>
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            ASKO Staker ETH Rewards %:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.stakersETHRewardsPercentNumerator.toString()}%
          </Text>
        </Box>
        <Box>
          <Text fontSize={{ base: '18px', sm: '21px' }} color='asko.fgMed'>
            Admin ETH Fees:
          </Text>
          <Text fontSize={{ base: '24px', sm: '30px' }} fontWeight='bold'>
            {props.adminFeesETHPercentNumerator.toString()}%
          </Text>
        </Box>
      </Grid>

      <Button
        bg='asko.accentButton'
        color='white'
        ml='auto'
        mr='auto'
        border='none'
        borderRadius='32px'
        w={{ base: '200px', sm: '430px' }}
        h='65px'
        mt='20px'
        mb='10px'
        fontWeight='regular'
        fontSize='24px'
        display='block'
        isDisabled={props.disableRegisterButton}
        onClick={() => {
          props.onRegister();
        }}
      >
        Register
      </Button>

      <Button
        bg='asko.accentButton'
        color='white'
        ml='auto'
        mr='auto'
        border='none'
        borderRadius='32px'
        w={{ base: '200px', sm: '430px' }}
        h='65px'
        mt='20px'
        mb='10px'
        fontWeight='regular'
        fontSize='24px'
        display='block'
        isDisabled={props.disableClaimButton}
        onClick={() => {
          props.onClaim();
        }}
      >
        Claim
      </Button>

      <Text
        fontSize={{ base: '16px', sm: '18px' }}
        color='asko.fgMed'
        w='100%'
        textAlign='center'
      >
        Claim{' '}
        <Text as='span' color='asko.fgAccent'>
          {props.unclaimedETHRewards.toString()}
        </Text>{' '}
        ETH
      </Text>
    </Box>
  );
}
