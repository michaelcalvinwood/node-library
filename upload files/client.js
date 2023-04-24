const uploadFiles = async files => {
    const url = 'https://example.com'; // add file upload endpoint here
    console.log('files', files);
    
    const fd = new FormData();
    files.forEach(file =>fd.append('File[]',file));
    
    const request = {
        url,
        method: 'post',
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' }
    }

    let response;

    try {
        response = await axios(request);
    } catch (err) {
        return console.error(err);
    }

    for (let i = 0; i < files.length; ++i) {
        console.log(`Uploaded: ${files[i].name}`);
    }
}

/*
<Dropzone 
    onDrop={acceptedFiles => uploadFiles(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
            <section>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop chart csv file here.<br /> Or click to select file</p>
            </div>
            </section>
        )}
</Dropzone> 
*/