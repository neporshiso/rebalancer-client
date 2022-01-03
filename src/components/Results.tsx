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
} from "@chakra-ui/react";

const Results = (props) => {
  const { data } = props;

  console.log("DATA", data);

  return (
    <Container maxWidth="container.xl" padding={10}>
      <Box>
        <Heading size="md">
          Unallocated Portfolio Value: {`$${data?.unallocatedValue}`}
        </Heading>
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
          {data.portfolio.map((el) => {
            const {
              ticker,
              price,
              action,
              deltaUnits,
              currentWeight,
              desiredWeight,
            } = el;

            return (
              <Tr>
                <Td>{ticker}</Td>
                <Td>{`$${price}`}</Td>
                <Td>
                  {action === "HOLD"
                    ? "You don't have to do anything with this ticker."
                    : `${action} ${Math.abs(deltaUnits)} shares`}
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
