import {Checkbox, Box, FormControlLabel} from '@mui/material';
import * as React from 'react';
import Router, { useRouter } from 'next/router'

type StatProps = {
  attribute: string
  option: string
  enabled: boolean
}

export default function EnumCheckbox({attribute, option, enabled} : StatProps) {
  const router = useRouter();
  const [checked, setChecked] = React.useState(enabled)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      const q = router.query;
      const attr = q[attribute];
      if(attr && Array.isArray(attr)) {
        attr.push(option);
        q[attribute] = attr;
      } else {
        q[attribute] = ['TRUE', option];
      }
      Router.push({
        pathname: `/search`,
        query: q
      })
    } else {
      const q = router.query;
      let attr = q[attribute];
      if (attr && Array.isArray(attr)) {
        attr = attr.filter((e) => e !== option);
        console.log(attr);
        if(attr.length === 1) {
          delete q[attribute];
        } else {
          q[attribute] = attr;
        }
      }
      Router.push({
        pathname: `/search`,
        query: q
      })
    }
  }

  return (
    <Box>
      <FormControlLabel 
        label={option}
        control={<Checkbox checked={checked} onChange={handleChange} />}
      />
    </Box>
  )
}