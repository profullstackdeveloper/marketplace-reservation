import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

export default function EmailStep({
  emailForm,
  onEmailSubmit,
  verifiedCode,
  emailMutation
}: {
  emailForm: UseFormReturn<
    {
      email: string;
    },
    any,
    undefined
  >;
  onEmailSubmit: (data: { email: string }) => void;
  emailMutation: UseMutationResult<any, Error, string, unknown>
  verifiedCode: string;
}) {
  return (
    <Box
      component="form"
      onSubmit={emailForm.handleSubmit(onEmailSubmit)}
      sx={{ mt: 2 }}
    >
      <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
        Invite Code: {verifiedCode}
      </Typography>
      <TextField
        fullWidth
        type="email"
        placeholder="Enter your email"
        error={!!emailForm.formState.errors.email}
        helperText={emailForm.formState.errors.email?.message}
        {...emailForm.register("email")}
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
        type="submit"
        variant="contained"
        disabled={emailMutation.isPending}
        sx={{
          bgcolor: "#F0B90B",
          color: "black",
          "&:hover": {
            bgcolor: "#D4A309",
          },
        }}
      >
        {emailMutation.isPending ? (
          <CircularProgress size={24} sx={{ color: "black" }} />
        ) : (
          "Continue"
        )}
      </Button>
    </Box>
  );
}
