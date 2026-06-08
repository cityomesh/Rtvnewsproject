import React from 'react';
import Typography from "@mui/material/Typography";

// Define the props type explicitly if needed
interface ThirtyTwoTextProps {
  children: React.ReactNode;
}

export const ThirtyTwoText: React.FC<ThirtyTwoTextProps> = ({ children }) => {
  return (
    <Typography
      sx={{
        fontFamily: "Clash Display", // Ensure this font is loaded in your project
        fontWeight: 600,
        fontSize: "25px",
        textAlign: "center",
        color: "black", // White color text
        paddingTop: "40px", // Padding top as 40px
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {children}
    </Typography>
  );
};
