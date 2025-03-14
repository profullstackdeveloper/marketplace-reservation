import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Configure wagmi with mainnet and injected connector (MetaMask)
export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
