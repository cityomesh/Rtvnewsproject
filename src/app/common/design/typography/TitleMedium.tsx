import React from 'react';
import Typography from "@mui/material/Typography";

// Define the props type explicitly if needed
interface TitleMedium {
  children: React.ReactNode;
}

export const TitleMedium: React.FC<TitleMedium> = ({ children }) => {
  return (
    <Typography
      sx={{// Ensure this font is loaded in your project
        fontWeight: 500,
        fontSize: "20px",
        color: "white",
        lineHeight: "28px", // Padding top as 40px
      }}
    >
      {children}
    </Typography>
  );
};
