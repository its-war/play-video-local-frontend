self.onmessage = function(event){
    const {url, file} = event.data;
    const formData = new FormData();

    formData.append('videos', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            self.postMessage({ type: 'progress', fileName: file.name, progress });
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            self.postMessage({ type: 'success', fileName: file.name });
        } else {
            self.postMessage({ type: 'error', fileName: file.name, error: xhr.statusText });
        }
    };

    xhr.onerror = function() {
        self.postMessage({ type: 'error', fileName: file.name, error: xhr.statusText });
    };

    xhr.open('POST', `${url}/api/video/upload`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
}
