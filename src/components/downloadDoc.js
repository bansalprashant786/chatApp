import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import { getFileNameFromUrl } from '../helpers/utils';
export const DIR_PATH = '/chatApp';

let jobId = -1;

export function getAbsolutePath() {
  return `${
    Platform.OS === 'ios'
      ? RNFS.DocumentDirectoryPath
      : RNFS.ExternalStorageDirectoryPath
  }`;
}
export function getStoragePath(path, toFileUrl) {
  return `${path}/${toFileUrl}`;
}

/**
 * Open file
 * @param {*} path
 */
export function openFile(path) {
  FileViewer.open(path, {
    showOpenWithDialog: true,
  })
    .then(success => {
			// success
			console.log('success in open file', success);
    })
    .catch(error => {
      // error
			console.log('error in open file', error)
    });
}
/**
 * Check if file exists
 * @param {*} toFileUrl
 */
export async function isFileExist(path, toFileUrl) {
  const downloadDest = `${getAbsolutePath()}${path}/${toFileUrl}`;
  return await RNFS.exists(downloadDest);
}

/**
 * Download file
 * @param {*} background
 * @param {*} url
 * @param {*} toFileUrl
 */
export async function downloadDocFile(
  background,
  url,
  openDownloadedFile,
  changeProgress,
  path
) {
  return new Promise(async function(resolve, reject) {
    const dir_path = `${DIR_PATH}/${path}`;
    const toFileUrl = getFileNameFromUrl(url);
    const downloadDest = `${getAbsolutePath()}${dir_path}/${toFileUrl}`;
    console.log('downloadDest', downloadDest);
    console.log('downloadDest url', url);

    if (await isFileExist(dir_path, toFileUrl)) {
      console.log('downloadDest openDownloadedFile', openDownloadedFile);
      if (openDownloadedFile) {
        openFile(downloadDest);
      }
      resolve();
    } else {
      //download progree
      const progress = data => {
        const percentage = (100 * data.bytesWritten) / data.contentLength || 0;
        console.log('downloadDest percentage', percentage);
        if (changeProgress) {

          changeProgress(percentage);
        }
      };

      //download begin
      const begin = res => {};

      const progressDivider = 1;
      const ret = RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
        begin,
        progress,
        background,
        progressDivider,
      });
      jobId = ret.jobId;
      ret.promise
        .then(res => {
          console.log('downloadDest res', res);

          if (openDownloadedFile) {
            openFile(downloadDest);
          }
          resolve();
          jobId = -1;
        })
        .catch(err => {
          console.log('downloadDest err', err);

          jobId = -1;
          reject(err);
        });
    }
  });
}

export function downloadFile(
  background,
  url,
  openDownloadedFile,
  changeProgress,
  path
) {
  return new Promise(async function(resolve, reject) {
    const dir_path = `${DIR_PATH}/${path}`;
    const toFileUrl = getFileNameFromUrl(url);
    const downloadDest = `${getAbsolutePath()}${dir_path}/${toFileUrl}`;
    console.log('downloadDest', downloadDest);
    console.log('downloadDest url', url);
    if (await isFileExist(dir_path, toFileUrl)) {
      console.log('downloadDest openDownloadedFile', openDownloadedFile);
      if (openDownloadedFile) {
        openFile(downloadDest);
      }
      resolve();
    } else {
      //download progree
      const progress = data => {
        const percentage = (100 * data.bytesWritten) / data.contentLength || 0;
        console.log('downloadDest percentage', percentage);
        if (changeProgress) {

          changeProgress(percentage);
        }
      };

      //download begin
      const begin = res => {};

      const progressDivider = 1;
      const ret = RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadDest,
        begin,
        progress,
        background,
        progressDivider
      });
      jobId = ret.jobId;
      ret.promise
        .then(res => {
          console.log('downloadDest res', res);

          if (openDownloadedFile) {
            openFile(downloadDest);
          }
          if (changeProgress) {

            changeProgress(0);
          }
          resolve();
          jobId = -1;
        })
        .catch(err => {
          console.log('downloadDest err', err);
          jobId = -1;
          // x(err);
        });
      }
  });
}

/**
 * Stop download
 * @param {*} jobID
 */
export function stopDownloadTest(jobID) {
  if (jobID !== -1) {
    RNFS.stopDownload(jobID);
  }
}
