import * as React from "react";
import {
  GridItem,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Checkbox,
} from "@chakra-ui/react";

import { Security } from "../types/Security";

interface TickerFormRowProps {
  // Fix this later...
  setFormData: any;
  portfolioValue: any;
}

const TickerFormRow: React.FC<TickerFormRowProps> = (props) => {
  const [readyToBeAdded, setReadyToBeAdded] = React.useState(false);
  const [ticker, setTicker] = React.useState("");
  const [price, setPrice] = React.useState("0");
  const [balance, setBalance] = React.useState("0");

  const [currPercentage, setCurrPercentage] = React.useState("0");
  const [desiredWeight, setDesiredWeight] = React.useState("0");

  const [security, setSecurity] = React.useState<Security>({} as Security);

  const formatMoney = (val: string) => `$${val}`;
  const parseMoney = (val: string) => val.replace(/^\$/, "");

  const formatPercentage = (val: string) => `${val}%`;
  const parsePercentage = (val: string) => val.replace(/^\%/, "");

  React.useEffect(() => {
    if (+balance) {
      const weight = (+balance / +props.portfolioValue);
      setCurrPercentage((+weight * 100).toFixed(2).toString());
      setSecurity((s) => {
        return { ...s, currentWeight: weight };
      });
    }
  }, [balance]);

  React.useEffect(() => {
    if ((+price && +balance) || (+price && +balance === 0)) {
      const units = +balance / +price;

      setSecurity((s) => {
        return { ...s, currentUnits: units };
      });
    }
  }, [price, balance]);

  React.useEffect(() => {
    setSecurity((s) => {
      return {
        ...s,
        ticker,
        price: +price,
        desiredWeight: +desiredWeight / 100,
      };
    });
  }, [ticker, price, desiredWeight]);

  React.useEffect(() => {
    if (ticker && price && balance && desiredWeight) {
      props.setFormData((prevState: any) => {
        return { ...prevState, [ticker]: security };
      });
    }
  }, [readyToBeAdded]);

  return (
    <>
      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>Ticker</FormLabel>
          <Input onChange={(event) => setTicker(event.currentTarget.value)} />
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <NumberInput
            onChange={(valueString) => setPrice(parseMoney(valueString))}
            value={formatMoney(price)}
            precision={2}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>Balance</FormLabel>
          <NumberInput
            onChange={(valueString) => setBalance(parseMoney(valueString))}
            value={formatMoney(balance)}
            precision={2}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>Current %</FormLabel>
          <NumberInput
            isDisabled={true}
            value={formatPercentage(currPercentage)}
            precision={2}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>Desired %</FormLabel>
          <NumberInput
            max={100}
            isDisabled={readyToBeAdded}
            onChange={(valueString) =>
              setDesiredWeight(parsePercentage(valueString))
            }
            value={formatPercentage(desiredWeight)}
            precision={0}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl>
          <FormLabel>Save</FormLabel>
          <Checkbox onChange={(e) => setReadyToBeAdded((ps) => !ps)}></Checkbox>
        </FormControl>
      </GridItem>
    </>
  );
};

export default TickerFormRow;
