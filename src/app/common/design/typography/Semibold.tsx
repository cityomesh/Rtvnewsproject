import React from 'react';
import Typography from "@mui/material/Typography";

// Define the props type explicitly if needed
interface Semibold {
  children: React.ReactNode;
}

export const Semibold: React.FC<Semibold> = ({ children }) => {
  return (
    <Typography
      sx={{
        fontFamily: "Clash Display", // Ensure this font is loaded in your project
        fontWeight: 600,
        fontSize: "20px",
        color: "white", // White color text
        lineHeight: "32px"
      }}
    >
      {children}
    </Typography>
  );
};
