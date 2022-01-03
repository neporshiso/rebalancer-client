import { ChakraProvider } from "@chakra-ui/react";
import MainForm from "./components/MainForm";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <MainForm />
    </ChakraProvider>
  );
}

export default App;
