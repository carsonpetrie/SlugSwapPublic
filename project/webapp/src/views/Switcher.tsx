/*
#######################################################################
#
# Copyright (C) 2022-2023 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { useRouter } from 'next/router';
import { 
  Button,
  Tooltip,
} from '@mui/material';
import Flag from 'react-world-flags';

import { useTranslation } from 'next-i18next'

const Switcher = () => {
  const { t } = useTranslation('common')
  const router = useRouter();
  const changeTo = router.locale === 'en' ? 'es' : 'en'
  return (
    <Tooltip title={t('ln')}>
      <Button
        data-testid='switch'
        onClick={() => {
          router.push(router, router, { locale: changeTo })
        }}
      >
        <Flag code={changeTo === 'es' ? 'es' : 'usa'} height="16" />
      </Button>
    </Tooltip>
  )
}

export default Switcher