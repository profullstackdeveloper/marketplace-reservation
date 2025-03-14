import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/lib/queryClient";
import { WagmiConfig } from "wagmi";
import { config } from "./utils/lib/wagmi";

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
        {/* <Toaster /> */}
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
