import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const CarouselWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
});

const CarouselContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '12px',
});

const SlideContainer = styled(Box)({
  display: 'flex',
  width: '100%',
});

const Slide = styled(Box)({
  width: '100%',
  flex: 'none',
  display: 'none',
  '&.active': {
    display: 'block',
  },
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '10px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  zIndex: 1,
  '&.left': {
    left: theme.spacing(-3),
  },
  '&.right': {
    right: theme.spacing(-3),
  },
}));

const PageIndicator = styled(Box)({
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  zIndex: 1,
  fontSize: '14px',
});

const Carousel = ({ items, autoSlide = false, autoSlideInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = items.length;
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const handleNextClick = () => {
    nextSlide();
    if (autoSlide) resetInterval();
  };

  const handlePrevClick = () => {
    prevSlide();
    if (autoSlide) resetInterval();
  };

  // 자동 슬라이드 관리
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);
  };

  useEffect(() => {
    if (autoSlide) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, autoSlideInterval);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoSlide, autoSlideInterval, totalItems]);

  return (
    <CarouselWrapper>
      <NavigationButton 
        className="left"
        onClick={handlePrevClick}
        size="large"
      >
        <ArrowBack />
      </NavigationButton>
      <CarouselContainer>
        <SlideContainer>
          {items.map((item, index) => (
            <Slide
              key={index}
              className={index === currentIndex ? 'active' : ''}
            >
              {item}
            </Slide>
          ))}
        </SlideContainer>
        <PageIndicator>
          {currentIndex + 1}/{totalItems}
        </PageIndicator>
      </CarouselContainer>
      <NavigationButton 
        className="right"
        onClick={handleNextClick}
        size="large"
      >
        <ArrowForward />
      </NavigationButton>
    </CarouselWrapper>
  );
};

export default Carousel; 