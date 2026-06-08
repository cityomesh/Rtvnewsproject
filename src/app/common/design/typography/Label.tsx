import React from 'react';
import Typography from "@mui/material/Typography";

// Define the props type explicitly if needed
interface Label {
  children: React.ReactNode;
}

export const Label: React.FC<Label> = ({ children }) => {
  return (
    <Typography
      sx={{// Ensure this font is loaded in your project
        fontWeight: 500,
        fontSize: "16px",
        color: "white",
        lineHeight: "24px", // Padding top as 40px
      }}
    >
      {children}
    </Typography>
  );
};
