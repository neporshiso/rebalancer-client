import * as React from "react";
import axios from "axios";
import {
  Container,
  Flex,
  VStack,
  Heading,
  SimpleGrid,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  GridItem,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { AiFillPlusSquare } from "react-icons/ai";

import TickerFormRow from "./TickerFormRow";
import Results from "./Results";
import { Security } from "../types/Security";

interface FormData {
  ticker: {
    securities: Security[];
  };
}

const MainForm = () => {
  const [formData, setFormData] = React.useState<FormData>({} as FormData);
  const [rebalanceResults, setRebalanceResults] = React.useState();
  const [initialNumberTickerRows, setInitialNumberTickerRows] =
    React.useState(3);

  const [portfolioValue, setPortfolioValue] = React.useState("0");

  const handleAddTickerField = () => {
    setInitialNumberTickerRows(
      (initialNumberTickerRows) => initialNumberTickerRows + 1
    );
  };

  const formatMoney = (val: string) => `$${val}`;
  const parseMoney = (val: string) => val.replace(/^\$/, "");

  const handleSubmit = async () => {
    const securitiesInput: Security[] = [];

    const payload = {
      totalValue: portfolioValue,
      securities: securitiesInput,
    };

    console.log("formdata", formData);

    Object.keys(formData).forEach((ticker) => {
      const securityObj = formData[ticker];
      securitiesInput.push(securityObj);
    });

    const { data } = await axios.post(
      "http://localhost:8080/portfolio",
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setRebalanceResults(data);
  };

  return (
    <>
      <Container maxWidth="container.xl" padding={10}>
        <Flex h="100vh" py={20}>
          <VStack
            w="full"
            h="full"
            p={10}
            spacing={10}
            alignItems="flex-start"
            bg="gray.50"
          >
            <Heading size="md">Enter Your Portfolio</Heading>

            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel>Total Portfolio Value</FormLabel>
                <NumberInput
                  onChange={(valueString) =>
                    setPortfolioValue(parseMoney(valueString))
                  }
                  value={formatMoney(portfolioValue)}
                  precision={2}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </GridItem>

            <SimpleGrid w="full" columns={6} columnGap={3} rowGap={6}>
              {[...Array(initialNumberTickerRows).keys()].map(() => {
                return (
                  <TickerFormRow
                    portfolioValue={portfolioValue}
                    setFormData={setFormData}
                  />
                );
              })}
            </SimpleGrid>

            <VStack alignItems="center" w="full">
              <Tooltip label="Add Ticker">
                <IconButton
                  colorScheme="green"
                  aria-label="Add Ticker"
                  icon={<AiFillPlusSquare />}
                  onClick={handleAddTickerField}
                >
                  Add a Security
                </IconButton>
              </Tooltip>
            </VStack>

            <VStack alignItems="center" w="full">
              <Button onClick={handleSubmit}>Rebalance</Button>
            </VStack>
          </VStack>
        </Flex>
      </Container>

      {rebalanceResults && <Results data={rebalanceResults} />}
    </>
  );
};

export default MainForm;
