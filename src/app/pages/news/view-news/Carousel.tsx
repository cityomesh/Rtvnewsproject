import React, { useState } from "react";
import {
  CardMedia,
  MobileStepper,
  Button as MuiButton,
  Paper,
  useTheme,
  Chip,
} from "@mui/material/";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import "react-toastify/dist/ReactToastify.css";
import { KTIcon } from "../../../../_metronic/helpers";
import { NewsItem } from "./NewsTypes";

interface NewsItemCarouselProps {
  newsItem: NewsItem;
  onReadMore: () => void;
  onEdit: () => void;
  onDelete: () => void;
  findDateTime: (timestamp: string) => [string, string];
}

export const NewsItemCarousel: React.FC<NewsItemCarouselProps> = ({ newsItem, onReadMore, onEdit, onDelete, findDateTime }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const storyCards = newsItem.storyCards || [];
  const maxSteps = storyCards.length;

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const activeCard = storyCards[activeStep];
  const imageUrl = typeof activeCard.bannerImage === 'string' ? activeCard.bannerImage : activeCard.bannerImage?.path;

  return (
    <div className="p-5 w-100">
      <div className="d-flex flex-column mb-3" onClick={onReadMore} style={{ cursor: 'pointer' }}>
        <span className="text-gray-800 fs-6 fw-bold" dangerouslySetInnerHTML={{ __html: newsItem.title }}/>
        <span className="text-gray-500 fw-semibold">
          {findDateTime(newsItem.updatedAt)[0]} | {findDateTime(newsItem.updatedAt)[1]}
        </span>
      </div>
      <Paper elevation={2} className="mb-5" onClick={onReadMore} style={{ cursor: 'pointer' }}>
        <CardMedia
          component="img"
          height="250"
          image={imageUrl || toAbsoluteUrl("/media/image-not-found.png")}
          alt={activeCard.title}
          style={{ objectFit: "cover" }}
        />
        <div className="p-4">
          <div className="fw-bold fs-5 mb-2" dangerouslySetInnerHTML={{ __html: activeCard.title }}/>
          <div className="text-gray-700 fs-6" dangerouslySetInnerHTML={{ __html: activeCard.description }}/>
        </div>
        {maxSteps > 1 && (
            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <MuiButton size="small" onClick={(e) => { e.stopPropagation(); handleNext(); }} disabled={activeStep === maxSteps - 1}>
                    Next {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </MuiButton>
                }
                backButton={
                    <MuiButton size="small" onClick={(e) => { e.stopPropagation(); handleBack(); }} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />} Back
                    </MuiButton>
                }
            />
        )}
      </Paper>
      {newsItem.tags && newsItem.tags.length > 0 && (
        <div className="my-3 d-flex flex-wrap" style={{gap: '0.5rem'}}>
            {newsItem.tags.slice(0, 3).map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" size="small" />
            ))}
            {newsItem.tags.length > 3 && (
                <Chip label="..." variant="outlined" size="small" />
            )}
        </div>
      )}
      <div className="d-flex align-items-center justify-content-center">
        <button onClick={onEdit} className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4">
          <KTIcon iconName="pencil" className="fs-2 text-primary" />
        </button>
        <button onClick={onDelete} className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2">
          <KTIcon iconName="trash" className="fs-2 text-danger" />
        </button>
      </div>
    </div>
  );
};