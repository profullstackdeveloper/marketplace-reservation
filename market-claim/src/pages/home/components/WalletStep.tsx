import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";

export default function WalletStep({
  verifiedCode,
  isConnecting,
  onConnectWallet,
  verifiedEmail,
  walletMutation,
}: {
  verifiedCode: string;
  verifiedEmail: string;
  onConnectWallet: () => Promise<void>;
  isConnecting: boolean;
  walletMutation: UseMutationResult<any, Error, string, unknown>;
}) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
        Invite Code: {verifiedCode}
      </Typography>
      <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
        Email: {verifiedEmail}
      </Typography>
      <TextField
        fullWidth
        type="text"
        placeholder="Your Wallet"
        disabled
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.05)",
          "& .MuiOutlinedInput-root": {
            color: "white",
          },
          mb: 2,
        }}
      />
      <Button
        fullWidth
        onClick={onConnectWallet}
        variant="contained"
        disabled={isConnecting || walletMutation.isError}
        sx={{
          bgcolor: "#F0B90B",
          color: "black",
          "&:hover": {
            bgcolor: "#D4A309",
          },
        }}
      >
        {isConnecting ? (
          <CircularProgress size={24} sx={{ color: "black" }} />
        ) : walletMutation.isPending ? (
          <CircularProgress size={24} sx={{ color: "black" }} />
        ) : walletMutation.isError ? (
          "Use Another Wallet"
        ) : (
          "Connect Wallet"
        )}
      </Button>
    </Box>
  );
}
