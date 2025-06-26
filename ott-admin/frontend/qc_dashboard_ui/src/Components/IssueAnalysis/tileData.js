import React from 'react';
import {ListItem,FormGroup, FormControlLabel, Checkbox,} from '@material-ui/core'; 

export const contentPartnerList = ( 
   <div>
      <ListItem >
      <FormGroup>
            <FormControlLabel control={ <Checkbox color="primary"  value="Hot Star" />  } label="Hot Star" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Prime Video" />} label="Prime Video" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Zee 5" />  } label="Zee 5" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Netflix" />  } label="Netflix" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Voot" />  } label="Voot" /> 
         </FormGroup> 
      </ListItem>  
   </div>
);

export const contentPartnerType = (
   <div>
       <h3>Content Type</h3>
      <ListItem> 
      <FormGroup>
      <FormControlLabel control={ <Checkbox color="primary"  value="News" />  } label="News" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Movies" />} label="Movies" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Entertainment" />  } label="Entertainment" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Comedy" />  } label="Comedy" /> 
            <FormControlLabel control={<Checkbox color="primary"  value="Music Tv" />  } label="Music Tv" />   
</FormGroup>
      </ListItem>
   </div>
);