import CustomButton from './CustomButton';


        <Box sx={{paddingTop: 2, paddingBottom: 2}}>
          <CustomButton
            backgroundColor="#FFB300"
            borderColor="#FFB300"
            textColor="#FFFFFF"
            centerText="Earn Jackpot"
            endText="$--"
            startIcon={<IdeaCoinIcon width={45} height={45}/>}
            startText="Crowdfund & Manufacture"
            onClick={() => console.log('Crowdfund and manufacture...')}
            sx={{ mb: 1 }}
          />
          
          <CustomButton
            startText="Set Patent Pending Token Price"
            backgroundColor="#f0eafc" 
            textColor="#632DDD"
            borderColor= '#632DDD'
            endText="$--"
            startIcon={<img src={PurpleHexagonIcon} alt="Hexagon Icon" />}
            onClick={() => console.log('Setting token price...')}
            sx={{ mt: 1 }}
          />
        </Box>
