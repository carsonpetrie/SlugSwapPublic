import React from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

import { 
  Box,
  IconButton,
  Typography,
} from '@mui/material';

export interface FileWithPreview extends FileWithPath {
  preview: string,
}


type FileDropperProps = {
  maxFiles?: number,
  maxSize?: number,
  files: File[],
  setFiles: React.Dispatch<React.SetStateAction<File[]>>,
}

import { useTranslation } from 'next-i18next'

export default function FileDropper({files, setFiles, maxFiles = 5, maxSize = 3 * 1024 * 1024}: FileDropperProps) {
  const { t } = useTranslation('common');
  const {
    getRootProps, 
    getInputProps
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: maxFiles,
    maxSize: maxSize,
    onDrop: acceptedFiles => {if (files.length + acceptedFiles.length <= maxFiles) {
      setFiles(currFiles=>
        (currFiles.map(file => {(file as FileWithPreview).preview = URL.createObjectURL(file); console.log('here'); return file;}))
          .concat(acceptedFiles.map(file => {
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            });
            return file;
          }))
      );
    }}
  });

  const removeFile = (previewBlob: string) => {
    setFiles(prevFiles => (prevFiles as FileWithPreview[]).filter(file => file.preview !== previewBlob))
  }

  const thumbs = (files as FileWithPreview[]).map(file => (
    <Box key={file.preview} sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <Image
        src={file.preview}
        width={100}
        height={100}
        style={{
          objectFit:'contain',
        }}
        // Revoke data uri after image is loaded
        onLoad={() => { URL.revokeObjectURL(file.preview); } } 
        alt={file.name}        
      />

      <IconButton color="primary" aria-label="remove picture" onClick={() => removeFile(file.preview)}>
        <CloseIcon/>
      </IconButton>
    </Box>
  ));

  React.useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    //return () => (files as FileWithPreview[]).forEach(file => URL.revokeObjectURL(file.preview));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container">
      <div aria-label='dropzone' {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <Typography component={'span'} color='gray'>{t('d.desc')}</Typography>
      </div>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        overflowX:'auto',
      }}>
        {thumbs}
      </Box>
    </section>
  );
}
