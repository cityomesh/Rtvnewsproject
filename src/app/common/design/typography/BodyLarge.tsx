import React from 'react';
import Typography from "@mui/material/Typography";

// Define the props type explicitly if needed
interface BodyLarge {
  children: React.ReactNode;
}

export const BodyLarge: React.FC<BodyLarge> = ({ children }) => {
  return (
    <Typography
      sx={{
        fontFamily: "DM Sans", // Ensure this font is loaded in your project
        fontWeight: 500,
        fontSize: "14px",
        color: "white", // White color text
        paddingTop: "20px", // Padding top as 40px
      }}
    >
      {children}
    </Typography>
  );
};
