import { grantReadWritePermission } from './readAndWriteAccess';
import { downloadFile} from '../components/downloadDoc';

export const getRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export function getFileNameFromUrl(url){
  let newUrl = url.split(/[?#]/)[0];
  const decodedUrl = decodeURIComponent(newUrl);
  const fileName = decodedUrl.substring(decodedUrl.lastIndexOf('/')+1);
  return fileName;
}

export function downloadFileWithPermission(url, path, changeProgress=false,  openDownloadedFile = true,){
	grantReadWritePermission()
	.then((response) => {
		console.log('response', response)
		downloadFile(
			true,
			url,
			openDownloadedFile,
			changeProgress,
			path
		)
		.then(()=> console.log('file download success'));
	})

}
