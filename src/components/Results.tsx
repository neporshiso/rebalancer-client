import * as React from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Container,
  Heading,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

type Direction = "UP" | "DOWN";

type Security = {
  action: "BUY" | "SELL" | "HOLD";
  balance: number;
  currentUnits: number;
  currentWeight: number;
  deltaUnits: number;
  desiredWeight: number;
  price: number;
  ticker: string;
};

type RebalancedPortfolio = {
  portfolio: Security[];
  unallocatedValue: number;
  totalValue: number;
};

// @ts-ignore
const Results = ({ data, setRebalanceResults }) => {
  const [rebalancedPortfolio, setRebalancedPortfolio] =
    React.useState<RebalancedPortfolio>(data);

  const handleAdjustment = (
    e: React.SyntheticEvent,
    direction: Direction,
    ticker: string
  ) => {
    setRebalancedPortfolio((prevState) => {
      let unallocatedValue = prevState.unallocatedValue;
      const portfolio = prevState.portfolio.map((security) => {
        if (security.ticker === ticker) {
          if (direction === "UP" && security.action === "BUY") {
            const newCurrentUnits = security.currentUnits + 1;
            const newDeltaUnits = security.deltaUnits + 1;
            const newBalance = newCurrentUnits * security.price;
            unallocatedValue = unallocatedValue - security.price;
            const newCurrentWeight = newBalance / prevState.totalValue;
            return {
              ...security,
              currentUnits: newCurrentUnits,
              deltaUnits: newDeltaUnits,
              balance: newBalance,
              currentWeight: newCurrentWeight,
            };
          }

          if (direction === "DOWN" && security.action === "BUY") {
            const newCurrentUnits = security.currentUnits - 1;
            const newDeltaUnits = security.deltaUnits - 1;
            const newBalance = newCurrentUnits * security.price;
            unallocatedValue = unallocatedValue + security.price;
            const newCurrentWeight = newBalance / prevState.totalValue;

            return {
              ...security,
              currentUnits: newCurrentUnits,
              deltaUnits: newDeltaUnits,
              balance: newBalance,
              currentWeight: newCurrentWeight,
            };
          }

          if (direction === "UP" && security.action === "SELL") {
            const newDeltaUnits = security.deltaUnits - 1;
            const newCurrentUnits = security.currentUnits - 1;
            const newBalance = newCurrentUnits * security.price;
            unallocatedValue = unallocatedValue + security.price;
            const newCurrentWeight = newBalance / prevState.totalValue;

            return {
              ...security,
              currentUnits: newCurrentUnits,
              deltaUnits: newDeltaUnits,
              balance: newBalance,
              currentWeight: newCurrentWeight,
            };
          }

          if (direction === "DOWN" && security.action === "SELL") {
            const newDeltaUnits = security.deltaUnits + 1;
            const newCurrentUnits = security.currentUnits + 1;
            const newBalance = newCurrentUnits * security.price;
            unallocatedValue = unallocatedValue - security.price;
            const newCurrentWeight = newBalance / prevState.totalValue;

            return {
              ...security,
              currentUnits: newCurrentUnits,
              deltaUnits: newDeltaUnits,
              balance: newBalance,
              currentWeight: newCurrentWeight,
            };
          }
        }

        return security;
      });

      return { portfolio, unallocatedValue, totalValue: prevState.totalValue };
    });
  };

  return (
    <Container maxWidth="container.xl" padding={10}>
      <Box>
        <Heading
          size="md"
          style={{
            color: rebalancedPortfolio.unallocatedValue < 0 ? "red" : "black",
          }}
        >
          Unallocated Portfolio Value:{" "}
          {`$${rebalancedPortfolio.unallocatedValue}`}
        </Heading>
        <ButtonGroup>
          <Button onClick={() => setRebalanceResults()}>Go Back</Button>
          <Button
            onClick={() => {
              setRebalancedPortfolio(data);
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Ticker</Th>
            <Th>Price</Th>
            <Th>Action</Th>
            <Th isNumeric>Actual %</Th>
            <Th isNumeric>Desired %</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rebalancedPortfolio.portfolio.map((el) => {
            const {
              ticker,
              price,
              action,
              deltaUnits,
              currentWeight,
              desiredWeight,
            } = el;
            return (
              <Tr key={ticker}>
                <Td>{ticker}</Td>
                <Td>{`$${price}`}</Td>
                <Td>
                  {action === "HOLD" ? (
                    "Do nothing."
                  ) : (
                    <>
                      <div>
                        {action} {Math.abs(deltaUnits)} shares
                      </div>
                      <ButtonGroup variant={"outline"} size="sm">
                        <Button
                          onClick={(e) => handleAdjustment(e, "UP", ticker)}
                          leftIcon={<AddIcon />}
                        >
                          Increase Number of Shares to {action.toLowerCase()}
                        </Button>

                        <Button
                          onClick={(e) => handleAdjustment(e, "DOWN", ticker)}
                          leftIcon={<MinusIcon />}
                        >
                          Decrease Number of Shares to {action.toLowerCase()}
                        </Button>
                      </ButtonGroup>
                    </>
                  )}
                </Td>
                <Td isNumeric>{`${(currentWeight * 100).toFixed(2)}%`}</Td>
                <Td isNumeric>{`${desiredWeight * 100}%`}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
};

export default Results;
