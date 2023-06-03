import styles from "@/styles/Home.module.css";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import calculateIncomeTax from "./api/tax_calculator";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import BigNumber from "bignumber.js";

export default function Home() {
  const [income, setIncome] = useState(0);
  const [incomeError, setIncomeError] = useState(false);

  const [relief, setRelief] = useState(0);
  const [reliefError, setReliefError] = useState(false);

  const [originalTaxPayable, setOriginalTaxPayable] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [reducedTaxPayable, setReducedTaxPayable] = useState<BigNumber>(
    new BigNumber(0)
  );

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Tax Savings Viewer</Typography>
      <Stack spacing={2} className={styles.form}>
        <TextField
          label="Chargeable Income"
          value={income}
          onChange={handleIncomeChange}
          error={incomeError}
          helperText={
            incomeError ? "Chargeable income must be a positive integer" : ""
          }
          required
        />
        <TextField
          label="Tax Relief"
          value={relief}
          onChange={handleReliefChange}
          error={reliefError}
          helperText={
            reliefError
              ? "Tax relief must be a positive integer or empty"
              : "Leave empty if you have no tax relief"
          }
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Compute Tax Payable
        </Button>
      </Stack>

      {!originalTaxPayable.isEqualTo(0) && (
        <Box>
          <Typography>
            Your Original Tax Payable is {originalTaxPayable.toString(10)}
          </Typography>
          <Typography>
            Your Reduced Tax Payable is {reducedTaxPayable.toString(10)}
          </Typography>
          <Typography>
            Savings: {originalTaxPayable.minus(reducedTaxPayable).toString(10)}
          </Typography>
          <Typography>
            Savings in %:{" "}
            {originalTaxPayable
              .minus(reducedTaxPayable)
              .dividedBy(originalTaxPayable)
              .multipliedBy(100)
              .decimalPlaces(2)
              .toString(10)}
            %
          </Typography>
        </Box>
      )}
    </Stack>
  );

  function handleIncomeChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const value = event.target.value;
    setIncome(parseInt(value));
    setIncomeError(!/^\d+$/.test(value));
  }

  function handleReliefChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const value = event.target.value;
    setRelief(parseInt(value));
    setReliefError(value !== "" && !/^\d+$/.test(value));
  }

  function handleSubmit() {
    const originalTaxPayable = calculateIncomeTax(income);
    const taxPayableAfterRelief = calculateIncomeTax(income, relief);

    setOriginalTaxPayable(originalTaxPayable);
    setReducedTaxPayable(taxPayableAfterRelief);
  }
}
