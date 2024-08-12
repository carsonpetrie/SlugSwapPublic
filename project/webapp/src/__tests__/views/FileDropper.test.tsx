import { render, screen } from "@testing-library/react";
import FileDropper, {FileWithPreview} from "../../views/FileDropper";
import {act, fireEvent} from '@testing-library/react';
import React from "react";

window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

type wrapperProps = {
  input?: File[],
}

function Wrapper({input = []}: wrapperProps) {
  const [files, setFiles] = React.useState<File[]>(input);
  return (
    <FileDropper files={files} setFiles={setFiles}/>
  );
}

test('Render', async () => {
  render(<Wrapper/>);
})


test('Render with some data', async () => {
  render(<Wrapper input={[{ path: "aint no way.PNG", preview: "blob:http://localhost:3000/d0054e0e-2503-44fb-b94f-7b48b4297042", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview ]}/>);
})


test('Render drop data', async () => {
  render(<Wrapper />);
  await act(() => {
    fireEvent.drop(screen.getByLabelText("dropzone"), createDtWithFiles([{ path: "poop.PNG", preview: "http://localhost:3000/afsdfsafdsa", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview]));
  });
})

test('Render drop data with already data', async () => {
  render(<Wrapper input={[{ path: "aint no way.PNG", preview: "blob:http://localhost:3000/d0054e0e-2503-44fb-b94f-7b48b4297042", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview ]}/>);
  await act(() => {
    fireEvent.drop(screen.getByLabelText("dropzone"), createDtWithFiles([{ path: "poop.PNG", preview: "http://localhost:3000/afsdfsafdsa", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview]));
  });
})

test('Render use remove button', async () => {
  render(<Wrapper input={[{ path: "aint no way.PNG", preview: "blob:http://localhost:3000/d0054e0e-2503-44fb-b94f-7b48b4297042", name: "aint no way.PNG", lastModified: 1664408973938, webkitRelativePath: "", size: 37245, type: "image/png" } as FileWithPreview ]}/>);
  const removeButton = screen.getByLabelText('remove picture');
  fireEvent.click(removeButton);
})



function createDtWithFiles(files = [] as File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: "file",
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
}