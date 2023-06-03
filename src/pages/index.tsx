import styles from "@/styles/Home.module.css";
import TextField from "@mui/material/TextField";
import { ChangeEvent, useEffect, useState } from "react";
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
  const [reliefErrorMessage, setReliefErrorMessage] = useState("");

  const [originalTaxPayable, setOriginalTaxPayable] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [reducedTaxPayable, setReducedTaxPayable] = useState<BigNumber>(
    new BigNumber(0)
  );

  useEffect(() => {
    calculateTaxSavings();
  }, [income]);

  useEffect(() => {
    calculateTaxSavings();
  }, [relief]);

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
              ? reliefErrorMessage
              : "Leave empty if you have no tax relief"
          }
        />
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
    const income = parseInt(value);

    isNaN(income) ? setIncome(0) : setIncome(income);
    setIncomeError(!/^\d+$/.test(value));
  }

  function handleReliefChange(
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const value = event.target.value;
    if (value !== "" && !/^\d+$/.test(value)) {
      setReliefError(true);
      setReliefErrorMessage("Tax relief must be a positive integer or empty");
      return;
    }

    const relief = parseInt(value);
    if (relief > 80000) {
      setReliefError(true);
      setReliefErrorMessage("Tax relief cannot exceed $80,000");
      setRelief(80000);
      return;
    }

    setReliefError(false);
    isNaN(relief) ? setRelief(0) : setRelief(relief);
  }

  function calculateTaxSavings() {
    const originalTaxPayable = calculateIncomeTax(income);
    const taxPayableAfterRelief = calculateIncomeTax(income, relief);

    setOriginalTaxPayable(originalTaxPayable);
    setReducedTaxPayable(taxPayableAfterRelief);
  }
}
