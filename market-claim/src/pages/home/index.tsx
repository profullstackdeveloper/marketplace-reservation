import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyInviteCodeSchema,
  verifyEmailSchema,
} from "../../utils/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../utils/lib/queryClient";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Stack,
} from "@mui/material";
import CodeStep from "./components/CodeStep";
import EmailStep from "./components/EmailStep";
import WalletStep from "./components/WalletStep";
import ReservationStep from "./components/ReservationStep";
import { Step } from "../../utils/types";

export default function HomePage() {
  const [step, setStep] = useState<Step>("verify");
  const [verifiedCode, setVerifiedCode] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [_, setVerifiedWallet] = useState("");
  const [open, setOpen] = useState(false);
  const { address } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { signMessage, data: signature } = useSignMessage();

  const verifyForm = useForm({
    resolver: zodResolver(verifyInviteCodeSchema),
    defaultValues: { code: "" },
  });

  const emailForm = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: "" },
  });

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("GET", "/api/verifyCode", { code });
      return response.data;
    },
    onSuccess: () => {
      const code = verifyForm.getValues().code;
      setVerifiedCode(code);
      setStep("email");
    },
    onError: (error: Error) => {
      alert(`Your invitation code has been used before!: \n${error.message}`);
    },
  });

  const emailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest(
        "GET",
        `/api/isEmailUsed?email=${encodeURIComponent(email)}`
      );
      return response.data;
    },
    onSuccess: () => {
      const email = emailForm.getValues().email;
      setVerifiedEmail(email);
      setStep("wallet");
    },
    onError: (error: Error) => {
      alert(`Your email already registered!: \n${error.message}`);
    },
  });

  const walletMutation = useMutation({
    mutationFn: async (wallet: string) => {
      const response = await apiRequest(
        "GET",
        `/api/isWalletUsed?wallet=${encodeURIComponent(wallet)}`
      );
      return response.data;
    },
    onSuccess: () => {
      setVerifiedWallet(address || "");
      setStep("reserve");
    },
    onError: (error: Error) => {
      alert(`Your Wallet already registered!: \n${error.message}`);
    },
  });

  const reserveMutation = useMutation({
    mutationFn: async (data: {
      code: string;
      email: string;
      address: string;
      signature: string;
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/reserve",
        undefined,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      alert(`RESERVATION SUCCEEDED!`);
    },
    onError: (error: Error) => {
      alert(`RESERVATION FAILED!: \n${error.message}`);
    },
  });

  const onVerifySubmit = (data: { code: string }) => {
    verifyMutation.mutate(data.code);
  };

  const onEmailSubmit = (data: { email: string }) => {
    emailMutation.mutate(data.email);
  };

  const onWalletSubmit = (data: { wallet: string }) => {
    walletMutation.mutate(data.wallet);
  };

  const onConnectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        throw new Error("Please install MetaMask to connect your wallet");
      }
      connect({
        connector: injected({
          target: "metaMask",
        }),
      });
    } catch (error) {
      () => (
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={open}
          onClose={() => setOpen(false)}
          message={
            error instanceof Error ? error.message : "Failed to connect wallet"
          }
        />
      );
    }
  };

  const onReservation = async () => {
    try {
      const message = JSON.stringify({
        code: verifiedCode,
        email: verifiedEmail,
        address,
      });

      signMessage({ message });
    } catch (error) {
      return () => (
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={open}
          onClose={() => setOpen(false)}
          message={"Failed to sign message"}
        />
      );
    }
  };

  useEffect(() => {
    if (address && step === "wallet") {
      setStep("reserve");
      onWalletSubmit({ wallet: address });
    }
  }, [address, step]);

  useEffect(() => {
    if (signature) {
      reserveMutation.mutate({
        code: verifiedCode,
        email: verifiedEmail,
        address: address!,
        signature,
      });
    }
  }, [signature]);

  const renderStep = () => {
    switch (step) {
      case "verify":
        return (
          <CodeStep
            onVerifySubmit={onVerifySubmit}
            verifyForm={verifyForm}
            verifyMutation={verifyMutation}
          />
        );

      case "email":
        return (
          <EmailStep
            emailForm={emailForm}
            emailMutation={emailMutation}
            onEmailSubmit={onEmailSubmit}
            verifiedCode={verifiedCode}
          />
        );

      case "wallet":
        return (
          <WalletStep
            isConnecting={isConnecting}
            onConnectWallet={onConnectWallet}
            verifiedCode={verifiedCode}
            verifiedEmail={verifiedEmail}
            walletMutation={walletMutation}
          />
        );

      case "reserve":
        return (
          <ReservationStep
            address={address || ""}
            onReservation={onReservation}
            reserveMutation={reserveMutation}
            verifiedCode={verifiedCode}
            verifiedEmail={verifiedEmail}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#0A0D1C",
        boxSizing: "border-box",
      }}
    >
      <Stack
        spacing={3}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        height={"100vh"}
        boxSizing={"border-box"}
      >
        <Stack>
          <Card sx={{ bgcolor: "#141832", boxShadow: "none" }}>
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                sx={{ color: "white", mb: 2 }}
              >
                Use My Invite Code
              </Typography>
              <Typography
                variant="body2"
                align="center"
                sx={{ color: "gray", mb: 2 }}
              >
                Enter a Mocaverse distributed invite code to claim your own
                exclusive Moca ID!
              </Typography>
              {renderStep()}
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}
