import React from 'react';
import Typography from "@mui/material/Typography";

// Define the props type explicitly if needed
interface TitleSmall {
  children: React.ReactNode;
}

export const TitleSmall: React.FC<TitleSmall> = ({ children }) => {
  return (
    <Typography
      sx={{// Ensure this font is loaded in your project
        fontWeight: 500,
        fontSize: "16px",
        color: "white",
        lineHeight: "28px", // Padding top as 40px
      }}
    >
      {children}
    </Typography>
  );
};