import React, { useState } from 'react';
import {
  Text,
  Box,
  Grid,
  Button,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/core';
import { removeDecimal } from '../utils';

export default function LotteryPurchase(props) {
  const [tokenBuyAmount, setTokenBuyAmount] = useState('');

  return (

    <Box
      w='100%'
      bg='asko.bgMed'
      p={{ base: '20px', sm: '40px' }}
      borderRadius={{ base: '20px', sm: '40px' }}
      mt='20px'
      mb={{ base: '20px', sm: '50px' }}
    >
      <Text
        fontWeight='bold'
        fontSize={{ base: '24px', sm: '36px' }}
        textAlign='center'
        mb='20px'
      >
        Buy Presale Lottery Tokens ({props.tokenSymbol})
      </Text>

      <Text
        fontSize={{ base: '18px', sm: '21px' }}
        textAlign='center'
        mb='20px'
        color='asko.fgMed'
      >
        Lottery Token Presale Price:{' '}
        <span style={{ color: '#03C4A3' }}>
          {props.tokenPrice.toString()} ETH
        </span>
      </Text>

      <Box
        w='100%'
        pt='50px'
        pb='50px'
        textAlign='center'
        color='asko.fg'
        position='relative'
      >
        <NumberInput
          fontSize={{ base: '18px', sm: '21px' }}
          w={{ base: '100%', md: '700px' }}
          display='inline-block'
          value={removeDecimal(tokenBuyAmount)}
          min={0}
          //max={removeDecimal(props.tokensAvailable.toString())}
          step={1}
        >
          <NumberInputField
            w='100%'
            h='60px'
            border='none'
            borderRadius='30px'
            pl='20px'
            fontSize={{ base: '18px', sm: '21px' }}
            position='relative'
            zIndex='1'
            type='number'
            bg='asko.fg'
            color='asko.bg'
            placeholder='Amount of tokens to buy'
            whilePlaceholder={{ color: 'asko.fgMed' }}
            onChange={(e) => {
              if (isNaN(e.target.value)) return;
              if (e.target.value === '') {
                setTokenBuyAmount('');
              } else if (Number(e.target.value) < 1) {
                setTokenBuyAmount('1');
              } else {
                setTokenBuyAmount(removeDecimal(Number(e.target.value)));
              }
            }}
          />
        </NumberInput>
      </Box>

      <Text
        fontSize={{ base: '18px', sm: '21px' }}
        textAlign='center'
        mb='20px'
        color='asko.fgMed'
      >
        You own {' '}
        <span style={{ color: '#03C4A3' }}>
          {props.lotteryTokenBalance.toString()} {props.tokenSymbol}
        </span>
      </Text>

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
        isDisabled={props.lotteryStage !== 'Presale'}
        onClick={() => {
          if (tokenBuyAmount !== '') {
            props.onBuy(tokenBuyAmount);
          }
        }}
      >
        Buy
      </Button>
    </Box>
  );
}
