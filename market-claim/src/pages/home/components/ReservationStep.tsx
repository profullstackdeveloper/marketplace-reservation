import { JSX } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";

export default function ReservationStep({
  address,
  onReservation,
  reserveMutation,
  verifiedCode,
  verifiedEmail,
}: {
  verifiedCode: string;
  verifiedEmail: string;
  address: string;
  onReservation: () => Promise<(() => JSX.Element) | undefined>;
  reserveMutation: UseMutationResult<
    any,
    Error,
    {
      code: string;
      email: string;
      address: string;
      signature: string;
    },
    unknown
  >;
}) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
        Invite Code: {verifiedCode}
      </Typography>
      <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
        Email: {verifiedEmail}
      </Typography>
      <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
        Wallet: {address}
      </Typography>
      <Button
        fullWidth
        onClick={onReservation}
        variant="contained"
        disabled={reserveMutation.isPending}
        sx={{
          bgcolor: "#F0B90B",
          color: "black",
          "&:hover": {
            bgcolor: "#D4A309",
          },
        }}
      >
        {reserveMutation.isPending ? (
          <CircularProgress size={24} sx={{ color: "black" }} />
        ) : (
          "Sign & Claim NFT"
        )}
      </Button>
    </Box>
  );
}
