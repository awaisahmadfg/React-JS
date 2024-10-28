import React from 'react';
import Button from '@mui/material/Button';
import { Box, styled } from '@mui/material';

interface CustomButtonProps extends React.ComponentProps<typeof Button> {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  startIcon?: React.ReactNode;
  startText?: string;
  centerText?: string;
  endText?: string;
}

const StyledButton = styled(Button)<{ backgroundColor: string, borderColor: string, textColor: string }>(({ theme, backgroundColor, borderColor, textColor }) => ({
  background: `linear-gradient(180deg, transparent 0%, transparent 100%), ${backgroundColor}`,
  border: `1px solid ${borderColor}`,
  color: textColor,
  height: 60,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  boxShadow: 'none',
  [theme.breakpoints.down('md')]: {
    fontSize: '2px'
  },
  '&:hover': {
    background: backgroundColor,
    opacity: 0.9
  }
}));

const CustomButton: React.FC<CustomButtonProps> = ({
  backgroundColor, borderColor, textColor, startIcon, startText, centerText, endText, ...props
}) => {
  return (
    <StyledButton
      variant="contained"
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      textColor={textColor}
      fullWidth
      {...props}
    >
      <Box display="flex" alignItems="center">
        {startIcon}
        {startText && <span style={{ marginLeft: 8, fontWeight: '600', textTransform: 'none', fontSize: '1.125rem' }}>{startText}</span>}
      </Box>
      <Box display="flex" alignItems="center">
        {centerText && <span style={{ marginRight: 8, fontWeight: 'normal', fontSize: '0.875rem' }}>{centerText}</span>}
        {endText && <span style={{ fontWeight: '700', fontSize: '1.125rem' }}>{endText}</span>}
      </Box>
    </StyledButton>
  );
};

export default CustomButton;

