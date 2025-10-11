import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const OPTIONS = [
  { label: "Strongly Agree", value: 5 },
  { label: "Agree",          value: 4 },
  { label: "Neutral",        value: 3 },
  { label: "Disagree",       value: 2 },
  { label: "Strongly Disagree", value: 1 },
];

export default function LikertRadio({
  name,
  label,
  value,             
  onChangeValue,      
  row = true,
}) {
  return (
    <FormControl>
      {label ? (
        <FormLabel id={`${name}-label`} sx={{ fontSize: 14, color: "#0f172a" }}>
          {label}
        </FormLabel>
      ) : null}
      <RadioGroup
        row={row}
        aria-labelledby={`${name}-label`}
        name={name}
        value={value ? String(value) : ""}
        onChange={(e) => onChangeValue?.(Number(e.target.value))}
      >
        {OPTIONS.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={String(opt.value)}
            control={<Radio size="small" />}
            label={opt.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
