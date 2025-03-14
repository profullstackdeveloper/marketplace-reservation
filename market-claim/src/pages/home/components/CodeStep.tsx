import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";

export default function CodeStep({
  verifyForm,
  onVerifySubmit,
  verifyMutation
}: {
  verifyForm: UseFormReturn<
    {
      code: string;
    },
    any,
    undefined
  >;
  onVerifySubmit: (data: { code: string }) => void;
  verifyMutation: UseMutationResult<any, Error, string, unknown>
}) {
  return (
    <Box
      component="form"
      onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
      sx={{ mt: 2 }}
    >
      <TextField
        fullWidth
        placeholder="Enter invite code"
        error={!!verifyForm.formState.errors.code}
        helperText={verifyForm.formState.errors.code?.message}
        {...verifyForm.register("code")}
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
        disabled={verifyMutation.isPending}
        sx={{
          bgcolor: "#F0B90B",
          color: "black",
          "&:hover": {
            bgcolor: "#D4A309",
          },
        }}
      >
        {verifyMutation.isPending ? (
          <CircularProgress size={24} sx={{ color: "black" }} />
        ) : (
          "Verify Code"
        )}
      </Button>
    </Box>
  );
}
